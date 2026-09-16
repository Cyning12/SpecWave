/**
 * OQ-5 · 闸泛化基线快照扫描器（3.0 W1 · 一次性 · 统一口径重扫）
 *
 * 口径（与机检逐字一致）：直接 import 现行 src/cli-shared.ts 的
 * parseHumanGates / findGate / evaluateMayStart30 —— 扫描 docs/tasks/active/ +
 * docs/tasks/done/ 全部 *.md 的 `### 人工闸` 节，逐行产出「现行白名单 3 闸逻辑下
 * 该行是否影响 may_start_30」的判定结果快照，作为 W1 验收 #5「存量逐条不变」的比对基线。
 *
 * 行口径：GATE_ROW_RE 命中 + id 以 HG- 开头 + 排除 human_gate 表头行（= parseHumanGates
 * 采集口径），不含表头/分隔行；与 SPEC 快照 229/13、评审文快测 284/17 的差值归因见
 * docs/tasks/active/task_3_0_w1_schema_leap.md 基线节。
 *
 * 用法：node --experimental-strip-types scripts/scan-human-gates-baseline.mts --out=<path>（**必填**）
 *
 * 防覆写（A1 · 2026-09-16 · R1 审查 advisory）：--out 缺省 → 报错退出（无默认输出 · 防裸跑冲掉基线）；
 * 输出目标已存在 → 拒绝覆写报错退出（fail-closed）；--out 为绝对路径时**原样使用**（不再被
 * path.join 拼成仓内相对路径）。基线 fixture 本体 = test/fixtures/human-gates/baseline_20260916.json
 * （永不作为默认输出 · 重扫请用 --out=test/fixtures/human-gates/rescan_<date>.json 或仓外绝对路径）。
 */
import { existsSync, readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  evaluateMayStart30,
  findGate,
  parseHumanGates,
  type HumanGate,
} from '../src/cli-shared.ts'

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const SCAN_DIRS = ['docs/tasks/active', 'docs/tasks/done']

/** 现行白名单 3 闸逻辑的逐行判定（与 evaluateMayStart30 / findGate 同语义） */
type RowVerdict = {
  gate_id: string
  status: string
  blocks_hats: string
  /** 命中的白名单规则（findGate 前缀）；未命中 = null（该行对 may_start_30 恒无影响） */
  matched_rule: 'HG-AUDIT-R1' | 'HG-TASK-DRAFT' | 'HG-GRAPH-MODULES' | null
  /** 同前缀先前行已占住 findGate 首匹配 ⇒ 该行被遮蔽（恒无影响） */
  shadowed: boolean
  /** 现行逻辑下该行是否翻转向 may_start_30=false（缺行即拒不计入行级 · 见文件级 verdict） */
  blocks_30_current: boolean
  /** 判定理由（blocks_30_current=true 时 = evaluateMayStart30 reason 同形） */
  reason: string | null
}

type FileVerdict = {
  file: string
  has_gate_section: boolean
  audit_r1_row_present: boolean
  /** 缺 HG-AUDIT-R1 行即拒（fail-closed by absence · F-W1-05 现行行为） */
  may_start_30: { ok: boolean; reason: string | null }
  rows: RowVerdict[]
}

function verdictRow(row: HumanGate, gates: HumanGate[]): RowVerdict {
  const rules = ['HG-AUDIT-R1', 'HG-TASK-DRAFT', 'HG-GRAPH-MODULES'] as const
  let matched: RowVerdict['matched_rule'] = null
  let shadowed = false
  for (const prefix of rules) {
    if (row.id === prefix || row.id.startsWith(prefix + '（') || row.id.startsWith(prefix + '(')) {
      matched = prefix
      // findGate 取首个匹配：本行若不是首个同前缀行则被遮蔽
      shadowed = findGate(gates, prefix) !== row
      break
    }
  }
  let blocks = false
  let reason: string | null = null
  if (!shadowed && matched === 'HG-AUDIT-R1' && row.status !== 'approved') {
    blocks = true
    reason = 'HG-AUDIT-R1 pending'
  }
  if (!shadowed && matched === 'HG-TASK-DRAFT' && row.status !== 'approved' && row.blocksHats.includes('30')) {
    blocks = true
    reason = 'HG-TASK-DRAFT pending'
  }
  if (!shadowed && matched === 'HG-GRAPH-MODULES' && row.status === 'pending') {
    blocks = true
    reason = 'HG-GRAPH-MODULES pending'
  }
  return {
    gate_id: row.id,
    status: row.status,
    blocks_hats: row.blocksHats,
    matched_rule: matched,
    shadowed,
    blocks_30_current: blocks,
    reason,
  }
}

const files: string[] = []
for (const dir of SCAN_DIRS) {
  const abs = path.join(REPO_ROOT, dir)
  for (const name of readdirSync(abs).filter((n) => n.endsWith('.md')).sort()) {
    files.push(path.join(dir, name))
  }
}

const fileVerdicts: FileVerdict[] = []
const gateIdSet = new Set<string>()
let totalRows = 0
let blockingRows = 0
let shadowedRows = 0

for (const rel of files) {
  const content = readFileSync(path.join(REPO_ROOT, rel), 'utf8')
  const gates = parseHumanGates(content)
  const may = evaluateMayStart30(gates)
  const rows = gates.map((g) => verdictRow(g, gates))
  for (const r of rows) {
    gateIdSet.add(r.gate_id)
    totalRows += 1
    if (r.blocks_30_current) blockingRows += 1
    if (r.shadowed) shadowedRows += 1
  }
  fileVerdicts.push({
    file: rel.split(path.sep).join('/'),
    has_gate_section: gates.length > 0,
    audit_r1_row_present: findGate(gates, 'HG-AUDIT-R1') !== undefined,
    may_start_30: may,
    rows,
  })
}

const filesWithSection = fileVerdicts.filter((f) => f.has_gate_section).length
const filesBlocked = fileVerdicts.filter((f) => !f.may_start_30.ok).length

const snapshot = {
  meta: {
    generated_at: new Date().toISOString().slice(0, 10),
    generator: 'scripts/scan-human-gates-baseline.mts',
    semantics: '现行白名单 3 闸逻辑（src/cli-shared.ts parseHumanGates + evaluateMayStart30 import 同口径）',
    scan_dirs: SCAN_DIRS,
    criteria:
      '行 = GATE_ROW_RE 命中且 id 以 HG- 开头且不含 human_gate（parseHumanGates 采集口径 · 不含表头/分隔行）；' +
      'blocks_30_current = 该行在现行 evaluateMayStart30 下是否致 may_start_30=false（缺行即拒为文件级 · 不计入行级）',
  },
  summary: {
    files_scanned: files.length,
    files_with_gate_section: filesWithSection,
    total_gate_rows: totalRows,
    distinct_gate_ids: [...gateIdSet].sort(),
    distinct_gate_id_count: gateIdSet.size,
    rows_blocking_30_current: blockingRows,
    rows_shadowed: shadowedRows,
    files_may_start_30_false: filesBlocked,
  },
  files: fileVerdicts,
}

// A1（2026-09-16 · R1 advisory 落实）：--out 必填 · 已存在拒写（fail-closed）· 绝对路径原样使用
const outArg = process.argv.find((a) => a.startsWith('--out='))
const outRaw = outArg ? outArg.slice('--out='.length) : ''
if (outRaw.trim().length < 1) {
  console.error('错误: --out=<path> 必填（无默认输出 · 防裸跑覆写基线）')
  console.error('用法: node --experimental-strip-types scripts/scan-human-gates-baseline.mts --out=test/fixtures/human-gates/rescan_<date>.json')
  process.exit(1)
}
const outAbs = path.isAbsolute(outRaw) ? outRaw : path.join(REPO_ROOT, outRaw)
if (existsSync(outAbs)) {
  console.error(`错误: 输出目标已存在 · 拒绝覆写（fail-closed · A1）: ${outAbs}`)
  process.exit(1)
}
mkdirSync(path.dirname(outAbs), { recursive: true })
writeFileSync(outAbs, JSON.stringify(snapshot, null, 2) + '\n')

console.log('扫描目录:', SCAN_DIRS.join(' + '))
console.log('文件数:', files.length, '· 含闸节文件:', filesWithSection)
console.log('闸行总数（统一口径）:', totalRows)
console.log('闸 ID 种数:', gateIdSet.size)
console.log('闸 ID 清单:', [...gateIdSet].sort().join(', '))
console.log('现行逻辑下行级 blocks_30 行数:', blockingRows, '· 被遮蔽行:', shadowedRows)
console.log('文件级 may_start_30=false 数:', filesBlocked)
console.log('快照已写:', outAbs)
