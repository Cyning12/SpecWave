import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

export class CliError extends Error {
  readonly exitCode: number
  constructor(message: string, exitCode = 1) {
    super(message)
    this.name = 'CliError'
    this.exitCode = exitCode
  }
}

export type HumanGate = {
  id: string
  status: string
  blocksHats: string
}

export type MayStart = { ok: boolean; reason: string | null }

export const STATUS_RE = /\*\*状态\*\*：?\s*`?([a-z_]+)/i
const META_TICK_RE = /\|\s*\*\*([^*]+)\*\*\s*\|\s*`([^`]+)`/
const META_PLAIN_RE = /\|\s*\*\*([^*]+)\*\*\s*\|\s*([^|\n]+)\|/
const GATE_ROW_RE =
  /^\|\s*(?:\*\*)?([^*|]+?)(?:\*\*)?\s*\|\s*([^|]+)\|\s*([^|]+)\|\s*([^|]*)\|/

export function packageRoot(): string {
  return path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
}

/**
 * T-02 git-root 探测唯一真值源（C1-b · DEF-017 同算法）：
 * 从 start 逐级向上找最近含 .git 的祖先目录；无 .git 一路查到文件系统根，返回 null。
 * 插件侧 override 根探测（index.ts userOverrideRoot）与 CLI --target 归属校验共用本实现，不新造。
 */
export function findGitRoot(start: string): string | null {
  let dir = path.resolve(start)
  for (;;) {
    if (existsSync(path.join(dir, '.git'))) return dir
    const parent = path.dirname(dir)
    if (parent === dir) return null
    dir = parent
  }
}

/**
 * 解析 --target（缺省=cwd）。
 * C1-b（2.2-W2 · 安全设计 §2.2.4 跨仓引用禁止）：opts.requireGitRoot=true 时
 * target 须落在某 git 仓内（findGitRoot 向上探测），否则 fail(1)（用法错误档 · 非静默接受）。
 * 默认不校验：init / host / refresh-ide-blocks 等非 git 仓合法面不回归（refresh-ide-blocks
 * 显式支持 git=none 备份回滚档）。
 */
export function resolveTarget(
  cwd: string,
  targetArg?: string,
  opts?: { requireGitRoot?: boolean },
): string {
  const target = path.resolve(targetArg || cwd)
  if (opts?.requireGitRoot && !findGitRoot(target)) {
    fail(
      `错误: --target 不在任何 git 仓内（向上未找到 .git）: ${target}\n` +
        '迁移: 先在该目录执行 git init，或将 --target 指向既有 git 仓内的路径。',
      1,
    )
  }
  return target
}

export function takeOption(
  args: string[],
  name: string,
): { value: string | undefined; rest: string[] } {
  const idx = args.indexOf(name)
  if (idx === -1 || idx + 1 >= args.length) return { value: undefined, rest: args }
  const value = args[idx + 1]
  const rest = args.slice(0, idx).concat(args.slice(idx + 2))
  return { value, rest }
}

export function fail(message: string, exitCode = 1): never {
  throw new CliError(message, exitCode)
}

/**
 * S2 过程域前缀唯一真值源（F1 / X7）。
 * 规范三路径 + legacy 裸前缀并集；判定用「相等或前缀/」——禁止各命令本地再硬编码等价列表。
 */
export const S2_TRUTH_PREFIXES = [
  'docs/tasks',
  'docs/harness/reviews',
  'docs/harness/invokes/by-task',
  'reviews',
  'invokes/by-task',
] as const

export type S2TruthPrefix = (typeof S2_TRUTH_PREFIXES)[number]

export function normalizeSlashPath(p: string): string {
  return p.replace(/\\/g, '/')
}

/** 相对路径（仓内 rel）是否命中 S2 */
export function isS2RelPath(destRel: string): boolean {
  const n = normalizeSlashPath(destRel).replace(/^\.\//, '')
  return S2_TRUTH_PREFIXES.some((seg) => n === seg || n.startsWith(`${seg}/`))
}

/**
 * 绝对路径是否命中 S2。
 * `.dsh/skills` 安装落点白名单：永不视为 S2（与 skills install 历史语义一致）。
 */
export function isS2AbsPath(absPath: string): boolean {
  const n = normalizeSlashPath(absPath)
  if (n.endsWith('/.dsh/skills') || n.includes('/.dsh/skills/')) return false
  return S2_TRUTH_PREFIXES.some((seg) => {
    const needle = `/${seg}`
    return n.endsWith(needle) || n.includes(`${needle}/`)
  })
}

export function assertNotS2Abs(
  absPath: string,
  message?: string,
  exitCode = 2,
): void {
  if (isS2AbsPath(absPath)) {
    fail(
      message ??
        `拒写：路径命中 S2 过程域（${S2_TRUTH_PREFIXES.join(' · ')}）: ${absPath}`,
      exitCode,
    )
  }
}


function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/** 现行落盘根（F4 方案 B） */
export const KIT_LAYOUT_DIR = '.coding-kit' as const
/** legacy 只读探测根（不再作为新写默认目标） */
export const LEGACY_LAYOUT_DIR = '.cyning-harness' as const
/** DSH 场景等价落盘根（与 KIT_LAYOUT_DIR 并列的合法 dest） */
export const KIT_DSH_LAYOUT_DIR = '.dsh/coding-kit' as const
/**
 * dest 白名单单一真值（T-16 · 2.2-W7 C7）：init / host apply / 写盘路径判定统一消费。
 * `.cyning-harness`（LEGACY_LAYOUT_DIR）仅 legacy 只读探测，**显式不入白名单**（事实卡 §10）。
 */
export const KIT_DEST_WHITELIST = [KIT_LAYOUT_DIR, KIT_DSH_LAYOUT_DIR] as const

/** Harness 元信息节标题（task 文档权威节名 · 单一真值 · 2.2-W7 E1） */
export const HARNESS_META_HEADING = '## Harness 元信息' as const

export function kitLayoutJoin(target: string, ...parts: string[]): string {
  return path.join(target, KIT_LAYOUT_DIR, ...parts)
}

export function legacyLayoutJoin(target: string, ...parts: string[]): string {
  return path.join(target, LEGACY_LAYOUT_DIR, ...parts)
}

/**
 * 解析布局内相对文件：优先 `.coding-kit/`，否则 legacy `.cyning-harness/`。
 * `source=none` 时 `abs` 仍指向新布局路径（供写入）。
 */
export function resolveLayoutFile(
  target: string,
  relWithinLayout: string,
): { abs: string; source: 'kit' | 'legacy' | 'none' } {
  const kit = kitLayoutJoin(target, relWithinLayout)
  if (existsSync(kit)) return { abs: kit, source: 'kit' }
  const legacy = legacyLayoutJoin(target, relWithinLayout)
  if (existsSync(legacy)) return { abs: legacy, source: 'legacy' }
  return { abs: kit, source: 'none' }
}

export function legacyLayoutHint(target: string): string | null {
  const hasLegacy = existsSync(path.join(target, LEGACY_LAYOUT_DIR))
  const hasKit = existsSync(path.join(target, KIT_LAYOUT_DIR))
  if (hasLegacy && !hasKit) {
    return (
      `提示: 检测到 legacy 目录 ${LEGACY_LAYOUT_DIR}/；新落盘已统一为 ${KIT_LAYOUT_DIR}/。` +
      `请运行 \`npx spec-wave upgrade --yes\` 将 manifest 写入新目录（旧目录只读保留，不删除）。`
    )
  }
  if (hasLegacy && hasKit) {
    return `提示: ${LEGACY_LAYOUT_DIR}/ 为 legacy 只读；现行落盘为 ${KIT_LAYOUT_DIR}/。`
  }
  return null
}


export function extractSection(content: string, startMarker: string, endMarker?: string): string | null {
  const startRe = new RegExp(`^${escapeRegExp(startMarker)}`, 'm')
  const startMatch = content.match(startRe)
  if (!startMatch || startMatch.index === undefined) return null
  const start = startMatch.index
  let end = content.length
  if (endMarker) {
    const next = content.indexOf(endMarker, start + startMarker.length)
    if (next !== -1) end = next
  }
  return content.slice(start, end)
}

export function normalizeCell(raw: string): string {
  return raw.replace(/[`*]/g, '').trim()
}

export function parseHarnessMeta(content: string): Record<string, string> {
  const meta: Record<string, string> = {}
  const section = extractSection(content, HARNESS_META_HEADING, '###')
  if (!section) return meta
  for (const line of section.split('\n')) {
    const tick = line.match(META_TICK_RE)
    if (tick) {
      meta[tick[1].trim()] = tick[2].trim()
      continue
    }
    const plain = line.match(META_PLAIN_RE)
    if (!plain) continue
    const key = plain[1].trim()
    const val = plain[2].trim()
    if (!key || key === '字段') continue
    if (/^[-:\s]+$/.test(val)) continue
    if (!(key in meta)) meta[key] = val
  }
  return meta
}

// K1（task wiki-delta-section-diagnostics）：错节诊断 helper —— 诊断非兼容。
// parseHarnessMeta 权威节名仍只认 HARNESS_META_HEADING（不改）；本 helper 仅在解析落空时
// 全文查找「写在其他节的 wiki_delta 字段行」，供 lint-wiki-delta（wiki_delta_wrong_section）
// 与 task lint（E8）输出指向正确节的诊断。key 单元格须恰为 wiki_delta（不误伤 wiki_delta_note）；
// 启发式可能命中正文代码块示例（residual_risk 已登记）——诊断 detail 带行号便于人判。
const WIKI_DELTA_ROW_RE = /^\s*\|?\s*(?:\*\*)?wiki_delta(?:\*\*)?\s*[|:]/
const HEADING_RE = /^(#{1,6})\s+(.+?)\s*$/

export function findWikiDeltaOutsideMetaSection(
  content: string,
): { line: number; section: string } | null {
  const lines = content.split('\n')
  let inMeta = false
  let section = '（文首 · 无节）'
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i]
    const heading = line.match(HEADING_RE)
    if (heading) {
      const level = heading[1].length
      const title = heading[2]
      if (level === 2 && title === 'Harness 元信息') {
        inMeta = true
        continue
      }
      // 与 extractSection(content, HARNESS_META_HEADING, '###') 同口径：节域止于下一个
      // ### 及以上标题（level >= 3）；后继 ## 节仍在解析节域内（与解析器行为一致，避免误报）
      if (inMeta && level >= 3) inMeta = false
      if (!inMeta) section = `${heading[1]} ${title}`
      continue
    }
    if (inMeta) continue
    if (WIKI_DELTA_ROW_RE.test(line)) return { line: i + 1, section }
  }
  return null
}

export function parseHumanGates(content: string): HumanGate[] {
  const section = extractSection(content, '### 人工闸', '\n##')
  if (!section) return []
  const gates: HumanGate[] = []
  for (const line of section.split('\n')) {
    const match = line.match(GATE_ROW_RE)
    if (!match) continue
    const id = match[1].trim()
    if (!id.startsWith('HG-') || id.includes('human_gate')) continue
    gates.push({
      id,
      status: normalizeCell(match[2]),
      blocksHats: normalizeCell(match[3]),
    })
  }
  return gates
}

export function findGate(gates: HumanGate[], prefix: string): HumanGate | undefined {
  return gates.find((g) => g.id === prefix || g.id.startsWith(`${prefix}（`) || g.id.startsWith(`${prefix}(`))
}

export function evaluateMayStart30(gates: HumanGate[]): MayStart {
  const audit = findGate(gates, 'HG-AUDIT-R1')
  const draft = findGate(gates, 'HG-TASK-DRAFT')
  const graph = findGate(gates, 'HG-GRAPH-MODULES')
  if (audit?.status !== 'approved') {
    return { ok: false, reason: 'HG-AUDIT-R1 pending' }
  }
  if (draft && draft.status !== 'approved' && draft.blocksHats.includes('30')) {
    return { ok: false, reason: 'HG-TASK-DRAFT pending' }
  }
  if (graph?.status === 'pending') {
    return { ok: false, reason: 'HG-GRAPH-MODULES pending' }
  }
  return { ok: true, reason: null }
}

export function extractTaskSlug(fileName: string): string {
  let base = path.basename(fileName).replace(/\.md$/, '')
  base = base.replace(/^(task_|done_)/, '')
  base = base.replace(/_(\d{8}|\d{4}-\d{2}-\d{2})$/, '')
  base = base.replace(/_v\d+$/, '')
  return base
}

export function normalizeSlug(slug: string): string {
  return String(slug).replace(/_/g, '-')
}

/**
 * C1-a（2.2-W2 · T-13 任意文件读穿越封堵 · D-W2-ABS-PATH-UX 冻结：拒止+迁移指引 exit 1）：
 * --task/--spec 单点收口（覆盖 cli.ts verify/audit/gate-check/--spec 4 调用点及
 * cli-checks / cli-status / cli-timeline 全部共用方 —— 禁逐调用点补丁 F-W2-04）。
 * 拒 target 之外的路径：绝对路径在 target 外、或相对路径经 .. 逃逸（F-W2-01/F-W2-03），
 * 一律在读文件之前 fail(1)（不留读痕）；target 内绝对路径（存量 CI 合法用法）放行。
 */
export function resolveTaskPath(target: string, taskFile: string): string {
  const abs = path.isAbsolute(taskFile)
    ? path.normalize(taskFile)
    : path.resolve(target, taskFile)
  const rel = path.relative(target, abs)
  if (rel === '..' || rel.startsWith(`..${path.sep}`) || path.isAbsolute(rel)) {
    fail(
      `错误: --task/--spec 拒绝 target 之外的路径: ${taskFile}\n` +
        '迁移: 将文件放入 target 仓内，改用仓内相对路径（如 docs/tasks/active/task_*.md）。\n' +
        '示例: npx spec-wave verify --target <repo> --task docs/tasks/active/<file>.md',
      1,
    )
  }
  return abs
}

export function readTextIfExists(file: string): string | null {
  if (!existsSync(file)) return null
  return readFileSync(file, 'utf8')
}

/**
 * 相对化展示口径（C3 · 2.2-W2：stdout 不再出现绝对目标路径）。
 * 永不回落绝对路径：相等 → '.'；base 之外 → '..' 相对形（反斜杠统一归一为正斜杠）。
 * 既有调用方（cli-host backup/destRel · cli-status · cli-timeline）输入恒在 base 内，行为不变；
 * base 外路径的 S2 判定由 isS2AbsPath(destAbs) 独立兜底，不依赖本函数的绝对回落。
 */
export function toRel(target: string, abs: string): string {
  const rel = path.relative(target, abs)
  if (!rel) return '.'
  return rel.split(path.sep).join('/')
}

export function extractHatsFromInvokeFilename(name: string): string[] {
  const base = path.basename(name, '.md')
  const parts = base.split('_')
  if (parts.length >= 3 && parts[0] === 'invoke') {
    return [parts[2]]
  }
  return []
}

// K5（task close-done-snapshot · 拟 1.8.0）：done 片段快照 —— 摘录归档文件内
// HARNESS_META_HEADING 节原文（与 parseHarnessMeta 同一 extractSection 口径 · 思考轮 R2：
// 归档真值摘录 > 静态模板，防模板漂移）；取不到（异常态）回落 canonical 模板占位 + warn。
// 调用方仅在真归档（renameSync 执行 · CLOSE: PASS）后消费；READY（dry-run · 含豁免）不消费
// —— 快照存在性唯绑归档事件，与豁免旗标无关（20 审 R2 口径裁决）。
export type DoneSnapshot = {
  path: string
  harness_meta_section: string
  warn: string | null
}

// 异常态兜底：canonical 模板（assets/harness/templates/TASK_TEMPLATE.md）亦不可读时的最小节。
const CANONICAL_META_FALLBACK = `${HARNESS_META_HEADING}\n\n| 字段 | 值 |\n|------|-----|\n| **task_slug** | \`<slug>\` |`

export function canonicalHarnessMetaSection(): string {
  try {
    const tpl = readFileSync(
      path.join(packageRoot(), 'assets', 'harness', 'templates', 'TASK_TEMPLATE.md'),
      'utf8',
    )
    const section = extractSection(tpl, HARNESS_META_HEADING, '###')
    if (section) return section.trimEnd()
  } catch {
    // 落兜底常量
  }
  return CANONICAL_META_FALLBACK
}

export function buildDoneSnapshot(dest: string): DoneSnapshot {
  const content = readFileSync(dest, 'utf8')
  const excerpt = extractSection(content, HARNESS_META_HEADING, '###')
  if (excerpt) return { path: dest, harness_meta_section: excerpt.trimEnd(), warn: null }
  return {
    path: dest,
    harness_meta_section: canonicalHarnessMetaSection(),
    warn: `归档文件缺 ${HARNESS_META_HEADING} 节 · done_snapshot 打印 canonical 模板占位（assets/harness/templates/TASK_TEMPLATE.md）`,
  }
}
