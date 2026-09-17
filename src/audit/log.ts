import { appendFileSync, existsSync, mkdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { assertNotS2Abs, fail, toRel } from '../cli-shared.ts'

/**
 * 3.0 W6 阶段一 · S6.1 C6 结构化审计日志落盘（SPEC 07 范围① · 验收 #1/#2 · F-W6-01/02/06/07）。
 *
 * 单一实现源纪律：cmdAudit（cli/gates.ts）· cmdVerify --task（cli/verify.ts）·
 * cmdTaskClose（cli/task-cmd.ts）· hook_guard（host/hookguard.ts）四产出点全部经
 * appendAuditEvent 追加 —— 禁止各命令本地再造落盘逻辑。
 *
 * 落点定稿：<target>/docs/harness/audit/audit.jsonl（append-only JSONL · 每行一事件 ·
 * 只新增不覆写）。该路径不在 S2_TRUTH_PREFIXES 三域（机械断言见 test/w6-audit-log.test.ts 验收 #10）。
 *
 * 字段集 v1（schema_version 恒 "1" · 快照断言钉死）：
 *   必填：schema_version / event / ts / verdict / exit_code
 *   可选：task / gates[] / detail / duration_ms / degraded / degrade_reason
 * 路径值一律相对化（G3 纪律 · toRel 口径 · 绝不绝对路径）；detail 为自由文本摘要（截断 300 字符）。
 *
 * 失败路径：
 *   F-W6-01 落盘失败（EACCES/ENOSPC/目录不可建）→ stderr warn 降级 · 不抛 · verdict/exit code 零变更；
 *   F-W6-02 --audit-file 命中 S2 三域 → assertNotS2Abs 机械拒写（exit 2 · 无豁免参数 · 不降级）；
 *   F-W6-06 坏行混入 → 消费端 readAuditEvents 逐行容错（坏行 skip + 计数）· 写端单行原子追加；
 *   F-W6-07 --audit-file 指向仓外 → 拒（exit 1 用法档 · C1-b/F-W2-02 同式跨仓禁止）。
 * 默认开 + 无 opt-out（硬约束 2 精神 · 观测面不仿 --allow-* 面 · 留 20 复核）。
 */

export const AUDIT_SCHEMA_VERSION = '1' as const

export const AUDIT_EVENT_KINDS = ['verify', 'gate_check', 'task_close', 'audit', 'hook_guard'] as const
export type AuditEventKind = (typeof AUDIT_EVENT_KINDS)[number]

export type AuditVerdict = 'PASS' | 'BLOCKED' | 'FAIL'

/** 闸态快照（有 --task 时填 · parseHumanGates 投影） */
export type AuditGateSnapshot = { id: string; status: string }

export type AuditEvent = {
  schema_version: typeof AUDIT_SCHEMA_VERSION
  event: AuditEventKind
  /** ISO-8601 UTC */
  ts: string
  verdict: AuditVerdict
  exit_code: number
  /** task slug 或 --task 传入值（缺省省略） */
  task?: string
  gates?: AuditGateSnapshot[]
  /** 点名摘要（截断 300 · 路径相对化口径） */
  detail?: string
  duration_ms?: number
  /** F-W6-01/F-W6-05 分档留痕 */
  degraded?: boolean
  degrade_reason?: string
}

/** 默认落点（仓内相对 · 验收 #10 机械断言面） */
export const AUDIT_DEFAULT_REL = 'docs/harness/audit/audit.jsonl' as const

export function defaultAuditFile(target: string): string {
  return path.join(target, 'docs', 'harness', 'audit', 'audit.jsonl')
}

/**
 * 解析审计落点：缺省 = 默认落点；--audit-file 覆盖必经双兜底 ——
 * 仓外拒（F-W6-07 · exit 1 用法档）+ S2 拒写（F-W6-02 · assertNotS2Abs 单一真值源 · exit 2 · 无豁免参数）。
 * 安全拒绝走 fail() 硬失败（CliError），**不**入 F-W6-01 降级面。
 */
export function resolveAuditFile(target: string, auditFile?: string): string {
  if (!auditFile) return defaultAuditFile(target)
  const abs = path.resolve(target, auditFile)
  const rel = path.relative(target, abs)
  if (rel === '' || rel.startsWith('..') || path.isAbsolute(rel)) {
    fail(
      'audit: --audit-file 须落 target 仓内（拒仓外路径 · F-W6-07）: ' + toRel(process.cwd(), abs),
      1,
    )
  }
  assertNotS2Abs(
    abs,
    '拒写：--audit-file 命中 S2 过程域（F-W6-02 · 无豁免参数）: ' + toRel(process.cwd(), abs),
  )
  return abs
}

/** 必填键 stamping 单点（schema_version/ts 禁止各产出点手填漂移） */
export function stampAuditEvent(
  event: Omit<AuditEvent, 'schema_version' | 'ts'> & { ts?: string },
): AuditEvent {
  const { ts, ...rest } = event
  return { schema_version: AUDIT_SCHEMA_VERSION, ts: ts ?? new Date().toISOString(), ...rest }
}

/**
 * 追加一事件（append-only · 单行 JSON + 换行）。默认开 · 无 opt-out。
 * F-W6-01：落盘 IO 失败 → stderr warn 降级不抛（观测面不阻断主流程）；
 * F-W6-02/F-W6-07 拒写（CliError）在 resolveAuditFile 阶段已硬失败，不入本降级面。
 */
export function appendAuditEvent(
  target: string,
  event: AuditEvent,
  opts?: { auditFile?: string },
): void {
  const file = resolveAuditFile(target, opts?.auditFile)
  try {
    mkdirSync(path.dirname(file), { recursive: true })
    appendFileSync(file, JSON.stringify(event) + '\n', 'utf8')
  } catch (err) {
    console.error(
      'warn: audit 落盘失败（降级 · 门禁主流程不受影响）: ' + (err as Error).message,
    )
  }
}

/**
 * F-W6-06 消费端逐行容错读：坏行 skip + 计数（不因坏行拒读后续事件）。
 * 文件不存在 → 空（audit 轨未产生过事件是合法态）。
 */
export function readAuditEvents(file: string): { events: AuditEvent[]; badLines: number } {
  if (!existsSync(file)) return { events: [], badLines: 0 }
  const events: AuditEvent[] = []
  let badLines = 0
  for (const line of readFileSync(file, 'utf8').split('\n')) {
    if (!line.trim()) continue
    try {
      events.push(JSON.parse(line) as AuditEvent)
    } catch {
      badLines += 1
    }
  }
  return { events, badLines }
}
