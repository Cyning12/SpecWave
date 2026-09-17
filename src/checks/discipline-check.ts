import { spawnSync } from 'node:child_process'
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { defaultAuditFile, readAuditEvents } from '../audit/log.ts'
import { packageRoot } from '../cli-shared.ts'

/**
 * 3.0 W6 阶段一 · S6.2 F4：S2 公理接真实触发源（SPEC 07 范围② · F-W6-05）。
 *
 * statements[] 增 additive trigger 字段（{ command, expect, audit_event? } · 只增 · 闸行裁决③），
 * 本模块对登记 trigger 的条目**实跑验证**：在临时 fixture 仓（本模块统一播种）内执行 command，
 * 比对真实 exit code 与 expect —— 输出 declared（yaml 纸面 status）vs verified（实跑 pass/fail/unreachable）
 * 双列可区分（纸面口径 ≠ 真实口径直呈 · 不互相粉饰）。
 *
 * v1 收窄面（登记留痕）：S2 公理 A1/A5/A6/A7/B4 + 本波四条 G2(C1/C2)/G4(D3)/G7(B2) 对应声明；
 * 全量 mechanical 条目触发源化归后续波次（非范围 · task S6.2 在案）。
 *
 * 分档语义（F-W6-05 · 硬约束 10 精神）：
 *   pass        = exit 吻合 expect（且 audit_event 在轨 · 若声明）
 *   fail        = exit 不吻合 / 声明的审计事件缺轨 → 真红 · 命令级 failClosed（exit 2 点名）
 *   unreachable = 触发源不可达（CLI 入口缺失 / exit 126·127 命令未找到 / spawn 错误 / trigger 形态非法）
 *                 → 分档诊断 + 原因点名 · **不误报 fail** · 不抬 exit code
 *
 * 命令占位符：$CLI = 本包 CLI 入口（dev: node --experimental-strip-types src/cli.ts ·
 * 安装态: node lib/cli.js · packageRoot 探测）；$FIXTURE = 临时 fixture 仓根（每次运行现造现毁）。
 */

export type DisciplineTrigger = { command: string; expect: number; audit_event?: string }

export type DisciplineCheckRow = {
  id: string
  /** 纸面口径（yaml status） */
  declared: string
  /** 真实口径（实跑分档） */
  verified: 'pass' | 'fail' | 'unreachable'
  note: string
}

export type DisciplineCheckReport = {
  rows: DisciplineCheckRow[]
  triggered: number
  pass: number
  fail: number
  unreachable: number
}

/** trigger 形态校验（坏 trigger → unreachable 分档 · 原因点名 · 不静默） */
export function parseDisciplineTrigger(raw: unknown): { trigger?: DisciplineTrigger; invalidReason?: string } {
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) {
    return { invalidReason: 'trigger 形态非法（须 { command, expect } 对象）' }
  }
  const t = raw as Record<string, unknown>
  if (typeof t.command !== 'string' || !t.command.trim()) {
    return { invalidReason: 'trigger.command 缺/非字符串' }
  }
  if (typeof t.expect !== 'number' || !Number.isInteger(t.expect)) {
    return { invalidReason: 'trigger.expect 缺/非整数（期望 exit code）' }
  }
  if (t.audit_event !== undefined && typeof t.audit_event !== 'string') {
    return { invalidReason: 'trigger.audit_event 非字符串' }
  }
  return { trigger: { command: t.command, expect: t.expect, ...(t.audit_event ? { audit_event: t.audit_event } : {}) } }
}

/** 本包 CLI 入口 shell 前缀（$CLI 真值 · dev/安装态双形态 · 缺失 = unreachable） */
export function resolveCliShellPrefix(): string | null {
  const root = packageRoot()
  const quote = (s: string): string => '"' + s.replace(/"/g, '\\"') + '"'
  const srcCli = path.join(root, 'src', 'cli.ts')
  const libCli = path.join(root, 'lib', 'cli.js')
  if (existsSync(srcCli)) return [quote(process.execPath), '--experimental-strip-types', quote(srcCli)].join(' ')
  if (existsSync(libCli)) return [quote(process.execPath), quote(libCli)].join(' ')
  return null
}

const DC_REVIEW =
  '# R1 fixture\n\n## 结论\n\nPASS · 零内容阻塞（fixture）\n\n审查结论：fixture 范围与验收全项合规，无阻塞遗留，准予关账。\n'

function dcTaskMd(
  slug: string,
  gateStatus: 'approved' | 'pending',
  opts?: { placeholderSelfCheck?: boolean; unchecked?: boolean; thinkNoTable?: boolean },
): string {
  const lines = [
    '# Task ' + slug,
    '',
    '> **状态**：`draft`',
    '',
    '## Harness 元信息',
    '',
    '| 字段 | 值 |',
    '|------|-----|',
    '| **task_slug** | `' + slug + '` |',
    '| **test_strategy** | `recommended` |',
    '| **wiki_delta** | `none` |',
    '',
    '### 人工闸',
    '',
    '| human_gate_id | status | blocks_hats | 说明 |',
    '|---------------|--------|-------------|------|',
    '| HG-TASK-DRAFT | approved | 20,30 | fixture |',
    '| HG-AUDIT-R1 | ' + gateStatus + ' | 30 | fixture |',
    '',
    '## 验收标准',
    '',
    opts?.unchecked ? '- [ ] fixture item' : '- [x] fixture item',
    '',
    '## 失败路径',
    '',
    '| F | Scenario |',
    '|---|----------|',
    '| F1 | fixture |',
    '',
    '### 自检结论（执行者）',
    '',
    opts?.placeholderSelfCheck ? '（待 30 回填）' : '自检已回填：fixture。',
    '',
  ]
  if (opts?.thinkNoTable) {
    // 思考轮节缺 R1–R5 槽位与控制表（W5/W6 warn-only 现状 · D-23-W4-G4-EXIT 升级归后续阶段）
    lines.push('## 思考轮', '', '### R0 · 证据', '', 'fixture 证据。', '')
  }
  return lines.join('\n')
}

/** 通用 fixture 仓播种（$FIXTURE 真值 · 覆盖 v1 登记 trigger 全部场景） */
export function seedDisciplineFixture(dir: string): void {
  mkdirSync(path.join(dir, '.git'), { recursive: true })
  const files: Record<string, string> = {
    // A1/C2：HG-AUDIT-R1 pending → verify --task 真闸 BLOCKED exit 2
    'docs/tasks/active/task_w6dc_pending_v1.md': dcTaskMd('w6dc_pending', 'pending'),
    // C1：缺 R<n> 审查文 → verify --task BLOCKED exit 2
    'docs/tasks/active/task_w6dc_noreview_v1.md': dcTaskMd('w6dc_noreview', 'approved'),
    // A6：review 齐但缺 pre-30 invoke hats → verify --task BLOCKED exit 2
    'docs/tasks/active/task_w6dc_noinvoke_v1.md': dcTaskMd('w6dc_noinvoke', 'approved'),
    'docs/harness/reviews/task_w6dc_noinvoke_audit_R1_2026-09-17.md': DC_REVIEW,
    // A5：自检结论占位 + 验收未勾 → task close BLOCKED exit 2
    'docs/tasks/active/task_w6dc_closebad_v1.md': dcTaskMd('w6dc_closebad', 'approved', {
      placeholderSelfCheck: true,
      unchecked: true,
    }),
    // D3：思考轮节缺控制表 → verify --task G4 闸 failClosed exit 2（3.0-W6 S6.4）
    'docs/tasks/active/task_w6dc_noround_v1.md': dcTaskMd('w6dc_noround', 'approved', { thinkNoTable: true }),
    // A9/N2-C：lint-FAIL（缺验收标准 E3）→ verify --task lint 步 failClosed exit 2（3.0-W6 S6.5）
    'docs/tasks/active/task_w6dc_lintbad_v1.md': dcTaskMd('w6dc_lintbad', 'approved').replace('## 验收标准', '## 验收（缺标准节名 · 触 E3）'),
    // A7：done 文件二次 close → task close BLOCKED exit 2
    'docs/tasks/done/task_w6dc_done_v1.md': dcTaskMd('w6dc_done', 'approved'),
  }
  for (const [rel, body] of Object.entries(files)) {
    const abs = path.join(dir, rel)
    mkdirSync(path.dirname(abs), { recursive: true })
    writeFileSync(abs, body, 'utf8')
  }
}

function runOneTrigger(
  trigger: DisciplineTrigger,
  fixture: string,
  cliPrefix: string,
): { verified: 'pass' | 'fail' | 'unreachable'; note: string } {
  const command = trigger.command.split('$CLI').join(cliPrefix).split('$FIXTURE').join('"' + fixture + '"')
  const r = spawnSync(command, { shell: true, cwd: fixture, encoding: 'utf8', timeout: 60_000 })
  if (r.error) {
    return { verified: 'unreachable', note: '触发源执行失败（' + r.error.message + ' · F-W6-05 不误报 fail）' }
  }
  const status = r.status ?? -1
  // exit 126/127 = shell 层命令不可执行/未找到（环境不具备）→ unreachable 分档（F-W6-05）
  if (status === 126 || status === 127) {
    return { verified: 'unreachable', note: '命令不可达（exit ' + status + ' · 环境缺触发条件 · F-W6-05 不误报 fail）' }
  }
  let verified: 'pass' | 'fail' = status === trigger.expect ? 'pass' : 'fail'
  let note =
    status === trigger.expect
      ? 'exit ' + status + ' 吻合期望 ' + trigger.expect
      : 'exit ' + status + ' ≠ 期望 ' + trigger.expect
  if (verified === 'pass' && trigger.audit_event) {
    // G7 佐证面：审计轨须存在对应事件（hooks 门禁真跑过留证 · S6.6 联动）
    const { events } = readAuditEvents(defaultAuditFile(fixture))
    if (events.some((e) => e.event === trigger.audit_event)) {
      note += ' · 审计轨 ' + trigger.audit_event + ' 事件在轨'
    } else {
      verified = 'fail'
      note += ' · 审计轨缺 ' + trigger.audit_event + ' 事件'
    }
  }
  return { verified, note }
}

/**
 * 对登记 trigger 的 statements 逐条实跑（统一 fixture 仓 · 现造现毁）。
 * CLI 入口缺失 → 全条目 unreachable（环境诊断 · 不判 fail）。
 */
export function runDisciplineCheck(
  statements: { id: string; status: string; trigger?: unknown }[],
): DisciplineCheckReport {
  const rows: DisciplineCheckRow[] = []
  const triggered = statements.filter((s) => s.trigger !== undefined && s.trigger !== null)
  const cliPrefix = resolveCliShellPrefix()
  if (triggered.length === 0) return { rows, triggered: 0, pass: 0, fail: 0, unreachable: 0 }
  if (!cliPrefix) {
    for (const s of triggered) {
      rows.push({ id: s.id, declared: s.status, verified: 'unreachable', note: 'CLI 入口缺失（src/cli.ts 与 lib/cli.js 均不存在 · F-W6-05）' })
    }
    return summarize(rows)
  }
  const fixture = mkdtempSync(path.join(os.tmpdir(), 'spec-wave-dc-'))
  try {
    seedDisciplineFixture(fixture)
    for (const s of triggered) {
      const parsed = parseDisciplineTrigger(s.trigger)
      if (!parsed.trigger) {
        rows.push({ id: s.id, declared: s.status, verified: 'unreachable', note: parsed.invalidReason ?? 'trigger 形态非法' })
        continue
      }
      const r = runOneTrigger(parsed.trigger, fixture, cliPrefix)
      rows.push({ id: s.id, declared: s.status, verified: r.verified, note: r.note })
    }
  } finally {
    rmSync(fixture, { recursive: true, force: true })
  }
  return summarize(rows)
}

function summarize(rows: DisciplineCheckRow[]): DisciplineCheckReport {
  return {
    rows,
    triggered: rows.length,
    pass: rows.filter((r) => r.verified === 'pass').length,
    fail: rows.filter((r) => r.verified === 'fail').length,
    unreachable: rows.filter((r) => r.verified === 'unreachable').length,
  }
}

/** 双列呈现（declared 纸面 vs verified 真实 · 可区分 · declared≠verified 直呈不粉饰） */
export function formatDisciplineCheck(report: DisciplineCheckReport, sourceText: string): string {
  const lines = [
    sourceText,
    'discipline check · 真实触发源实跑（v1 收窄面 = 登记 trigger 的 ' + report.triggered + ' 条 · 全量触发源化归后续波次）',
    '',
    '| statement | declared（纸面） | verified（实跑） | 说明 |',
    '|-----------|------------------|------------------|------|',
    ...report.rows.map((r) => '| ' + r.id + ' | ' + r.declared + ' | ' + r.verified + ' | ' + r.note + ' |'),
    '',
    'declared = yaml 纸面 status · verified = 真实触发源实跑（pass/fail/unreachable · F-W6-05 unreachable 不误报 fail）',
    '汇总: pass ' + report.pass + ' · fail ' + report.fail + ' · unreachable ' + report.unreachable,
  ]
  return lines.join('\n')
}
