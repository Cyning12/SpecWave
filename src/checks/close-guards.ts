import { spawnSync } from 'node:child_process'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { defaultAuditFile, readAuditEvents } from '../audit/log.ts'
import { extractSection, extractTaskSlug, normalizeSlug, parseHarnessMeta, resolveLayoutFile, STATUS_RE } from '../cli-shared.ts'
import { WIKI_DELTA_LITERALS, WIKI_DELTA_PATHISH_RE } from '../cli-task-extra.ts'
import { missingInvokeHats, resolveRequiredInvokeHats } from './invoke-hats.ts'
import { evalReviewConclusion, findLatestReview } from './review-gates.ts'
import { PLACEHOLDER_RE } from './lint.ts'

// ==== DEF-003 阶段二 T6：task close 守卫（lifecycle.yaml close 登记 · cmdTaskClose 与 dry-run 同一实现源） ====

export type CloseGuardOutcome = { status: 'pass' | 'fail' | 'warn'; detail: string }

export const UNCHECKED_RE = /^\s*- \[ \]/
export const CLOSE_STATUSES = new Set(['done', 'completed'])

// task 文件路径推导仓根（task close 无仓根参数 · 与 findReview 的 target 口径对齐）：
// <root>/docs/(harness/)tasks/(active|done)/<file> → <root>；非常规布局回退 task 所在目录。
export function taskTargetRoot(absTask: string): string {
  const norm = absTask.split(path.sep).join('/')
  const m = norm.match(/^(.*)\/docs\/(?:harness\/)?tasks\/(?:active|done)\/[^/]+$/)
  if (m && m[1]) return m[1]
  return path.dirname(absTask)
}

export function evalCloseSlug(absTask: string, content: string): CloseGuardOutcome {
  const meta = parseHarnessMeta(content)
  const fileSlug = extractTaskSlug(absTask)
  if (!meta.task_slug) return { status: 'fail', detail: 'Harness 元信息表缺 task_slug' }
  if (normalizeSlug(meta.task_slug) !== normalizeSlug(fileSlug)) {
    return {
      status: 'fail',
      detail: `slug 不一致: 文件名 ${fileSlug} ≠ 元信息 task_slug ${meta.task_slug}`,
    }
  }
  return { status: 'pass', detail: `slug 一致（${meta.task_slug}）` }
}

export function evalCloseSelfCheck(content: string): CloseGuardOutcome {
  const selfCheck = extractSection(content, '### 自检结论', '\n##')
  if (!selfCheck) return { status: 'fail', detail: '缺 ### 自检结论 节' }
  const substantive = selfCheck
    .split('\n')
    .slice(1)
    .map((l) => l.trim())
    .filter(Boolean)
    .filter((l) => !PLACEHOLDER_RE.test(l))
  if (substantive.length === 0) return { status: 'fail', detail: '自检结论未回填（空或纯占位符）' }
  return { status: 'pass', detail: '自检结论已回填' }
}

export function evalCloseAcceptance(content: string): CloseGuardOutcome {
  const acceptance = extractSection(content, '## 验收标准', '\n##')
  if (!acceptance) return { status: 'fail', detail: '缺 ## 验收标准 节' }
  const unchecked = acceptance.split('\n').filter((l) => UNCHECKED_RE.test(l))
  if (unchecked.length > 0) {
    return {
      status: 'fail',
      detail: `验收标准 ${unchecked.length} 项未勾选（或 --allow-unchecked 显式豁免）`,
    }
  }
  return { status: 'pass', detail: '验收标准全部勾选' }
}

export function evalCloseStatus(content: string): CloseGuardOutcome {
  const statusLine = content.split('\n').find((l) => STATUS_RE.test(l))
  const status = statusLine ? statusLine.match(STATUS_RE)?.[1]?.toLowerCase() : null
  if (!status) return { status: 'fail', detail: '未找到 > **状态** 行' }
  if (!CLOSE_STATUSES.has(status)) {
    return { status: 'fail', detail: `状态非 done/completed（当前: ${status}）` }
  }
  return { status: 'pass', detail: `状态 ${status}` }
}

// close_invoke：帽集合覆盖（required_invoke_hats 显式优先 · profile 缺省 default=10,30,40 · 合并文件名双计）
export function evalCloseInvokeHats(absTask: string, content: string): CloseGuardOutcome {
  const meta = parseHarnessMeta(content)
  const { required, source } = resolveRequiredInvokeHats(meta)
  const slug = meta.task_slug ?? extractTaskSlug(absTask)
  const missing = missingInvokeHats(taskTargetRoot(absTask), slug, required)
  if (missing.length > 0) {
    return {
      status: 'fail',
      detail: `missing invoke hats: ${missing.join(',')}（${source} · 或 --allow-invoke-gap 豁免）`,
    }
  }
  return { status: 'pass', detail: `invoke hats 齐（${source}）` }
}

// close_review（2.3-W4 G2 结论级升级 · 评审文 §2.1）：R<n> 审查文存在 + 最高 R 轮结论可机读通过
// （findLatestReview / evalReviewConclusion 单一实现源 · close 天然只闸新关账不追溯存量 · D-23-W4-TRANSITION）。
// 3.0-W4 U1（评审文 §6.2 定稿）：close 不消费 legacy-gate-exempt 是**设计性不对称**而非缺陷 ——
// 豁免清单全部条目语义 = 「闸接线前合法存量」，新关账无「接线前合法」可言；请勿顺手补消费
//（U2 弃选：豁免机制反噬 · U3 弃选：存量 34 条瞬间全红违反不追溯 · 弃选理由评审文 §6.2 在案）。
export function evalCloseReview(absTask: string): CloseGuardOutcome {
  const latest = findLatestReview(taskTargetRoot(absTask), absTask)
  if (!latest) {
    return {
      status: 'fail',
      detail: 'missing R<n> review（docs/harness/reviews 与 reviews/ 均无 · 或 --allow-no-review 豁免）',
    }
  }
  const verdict = evalReviewConclusion(readFileSync(latest.path, 'utf8'))
  if (!verdict.pass) {
    return {
      status: 'fail',
      detail: '审查文结论不可机读通过（' + latest.name + ' · ' + verdict.detail + ' · 或 --allow-no-review 豁免）',
    }
  }
  return { status: 'pass', detail: 'R' + latest.round + ' 审查文存在且结论可机读通过（' + latest.name + '）' }
}

// 3.0-W6 S6.6 G7 执行证据对照（warn-only · 00 裁定诚实口径 · 不虚标 closed · SPEC ⑦ 字面偏差登记在案）：
// 自检结论声称跑过 verify（节文本含 verify 字样）而审计轨无对应 task 的 verify PASS 事件
//（C6 audit.jsonl · exit_code 0 吻合）→ warn 点名**不挡 close**（D-23-W4-G4-EXIT 同式 ·
// 升 failClosed 归后续 SPEC 明文裁决）。故意不入 CLOSE_GUARD_ORDER：dry-run/lifecycle.yaml 面零扰动。
// 诚实边界：只对照「声称面」（未声称 verify 的自检结论不查 · 防误报）；声称真假终局靠 S2 留痕 + 人审。
export function evalCloseExecEvidence(absTask: string, content: string): CloseGuardOutcome | null {
  const selfCheck = extractSection(content, '### 自检结论', '\n##')
  if (!selfCheck || !/verify/i.test(selfCheck)) return null
  const slug = parseHarnessMeta(content).task_slug ?? extractTaskSlug(absTask)
  const { events } = readAuditEvents(defaultAuditFile(taskTargetRoot(absTask)))
  const hit = events.some(
    (e) =>
      e.event === 'verify' &&
      e.verdict === 'PASS' &&
      e.exit_code === 0 &&
      typeof e.task === 'string' &&
      (e.task === slug || normalizeSlug(extractTaskSlug(e.task)) === normalizeSlug(slug)),
  )
  if (hit) return null
  return {
    status: 'warn',
    detail: '自检结论声称 verify 而审计轨无对应 verify PASS 事件（G7 warn-only · 不挡 close · 升 failClosed 归后续 SPEC 明文裁决）',
  }
}

const GRAPH_DELTA_LITERALS = new Set(['none'])

// close_graph_delta（lifecycle.yaml 口径：缺字段 WARN 不挡；none 无 note / 路径不存在 BLOCK）
export function evalCloseGraphDelta(absTask: string, content: string): CloseGuardOutcome {
  const meta = parseHarnessMeta(content)
  const raw = (meta.graph_delta ?? '').trim()
  if (!raw) {
    return { status: 'warn', detail: '缺 graph_delta 字段（warn · 不挡 close · 建议补 path|none）' }
  }
  if (GRAPH_DELTA_LITERALS.has(raw)) {
    if (!(meta.graph_delta_note ?? '').trim()) {
      return { status: 'fail', detail: `graph_delta=${raw} 缺 graph_delta_note 理由` }
    }
    return { status: 'pass', detail: `graph_delta=${raw}（note 在）` }
  }
  if (!existsSync(path.resolve(taskTargetRoot(absTask), raw))) {
    return { status: 'fail', detail: `graph_delta 指向不存在的图谱路径（相对仓根）: ${raw}` }
  }
  return { status: 'pass', detail: `graph_delta 路径存在（${raw}）` }
}

const KPI_TASK_SCORE_RE = /Task_KPI%:\s*\d+(?:\.\d+)?/
const KPI_D_TABLE_RE = /^\|\s*D[1-5]\s*\|/m
const KPI_FOUR_DIM_CELL_RE = /\|\s*[1-5]\s*\|/g

// close_kpi：kpi_aggregator=CLOSE（缺省同 · TASK_TEMPLATE 默认 CLOSE）时 ### KPI 节须含可解析分数
// （Task_KPI%: N / D1–D5 表 / 四维 1–5 四格评分）。
export function evalCloseKpi(content: string): CloseGuardOutcome {
  const meta = parseHarnessMeta(content)
  const agg = (meta.kpi_aggregator ?? '').trim() || 'CLOSE'
  if (agg !== 'CLOSE') return { status: 'pass', detail: `kpi_aggregator=${agg}（非 CLOSE · 不闸）` }
  const section = extractSection(content, '### KPI', '\n##')
  if (!section) {
    return { status: 'fail', detail: 'kpi_aggregator=CLOSE 但缺 ### KPI 节（或 --allow-kpi-gap 豁免）' }
  }
  const body = section.split('\n').slice(1).join('\n')
  if (KPI_TASK_SCORE_RE.test(body)) return { status: 'pass', detail: 'KPI 可解析分数（Task_KPI%）' }
  if (KPI_D_TABLE_RE.test(body)) return { status: 'pass', detail: 'KPI 可解析分数（D1–D5 表）' }
  if (/四维/.test(body) && (body.match(KPI_FOUR_DIM_CELL_RE) ?? []).length >= 4) {
    return { status: 'pass', detail: 'KPI 可解析分数（四维 1–5）' }
  }
  return {
    status: 'fail',
    detail:
      'kpi_aggregator=CLOSE 但 ### KPI 节无可解析分数' +
      '（Task_KPI%: N / D1–D5 表 / 四维 1–5 · 或 --allow-kpi-gap 豁免）',
  }
}

// close_experience：experience_capture=required 硬闸（### 经验总结 须 ≥80 字或 ≥3 条列表；
// 整行圆括号占位/说明行不计入）。
export function evalCloseExperience(content: string): CloseGuardOutcome {
  const meta = parseHarnessMeta(content)
  const mode = (meta.experience_capture ?? '').trim()
  if (mode !== 'required') {
    return { status: 'pass', detail: `experience_capture=${mode || 'unset'}（非 required · 不闸）` }
  }
  const section = extractSection(content, '### 经验总结', '\n##')
  if (!section) {
    return {
      status: 'fail',
      detail: 'experience_capture=required 但缺 ### 经验总结 节（或 --allow-experience-gap 豁免）',
    }
  }
  const substantive = section
    .split('\n')
    .slice(1)
    .map((l) => l.trim())
    .filter(Boolean)
    .filter((l) => !/^（.*）$/.test(l))
  const items = substantive.filter((l) => /^[-*]\s+/.test(l))
  const textLen = substantive.join('').length
  if (textLen >= 80 || items.length >= 3) {
    return { status: 'pass', detail: `经验总结已回填（${textLen} 字 / ${items.length} 条）` }
  }
  return {
    status: 'fail',
    detail: 'experience_capture=required 但经验总结未达标（须 ≥80 字或 ≥3 条列表 · 或 --allow-experience-gap 豁免）',
  }
}

// close_wiki_delta（lifecycle.yaml 口径：缺字段 BLOCK；none|n/a 无 note / 路径不存在 BLOCK；
// 词表与 task lint-wiki-delta 同源 · WIKI_DELTA_LITERALS / WIKI_DELTA_PATHISH_RE）
export function evalCloseWikiDelta(absTask: string, content: string): CloseGuardOutcome {
  const meta = parseHarnessMeta(content)
  const raw = (meta.wiki_delta ?? '').trim()
  if (!raw) {
    return { status: 'fail', detail: '缺 wiki_delta 字段（须 path|none|n/a · 或 --allow-wiki-gap 豁免）' }
  }
  if (WIKI_DELTA_LITERALS.has(raw)) {
    if (!(meta.wiki_delta_note ?? '').trim()) {
      return {
        status: 'fail',
        detail: `wiki_delta=${raw} 缺 wiki_delta_note 理由（或 --allow-wiki-gap 豁免）`,
      }
    }
    return { status: 'pass', detail: `wiki_delta=${raw}（note 在）` }
  }
  if (!WIKI_DELTA_PATHISH_RE.test(raw)) {
    return { status: 'fail', detail: `wiki_delta 值非法: ${raw}（须 path|none|n/a）` }
  }
  if (!existsSync(path.resolve(taskTargetRoot(absTask), raw))) {
    return {
      status: 'fail',
      detail: `wiki_delta 指向不存在的 wiki 路径（相对仓根）: ${raw}（或 --allow-wiki-gap 豁免）`,
    }
  }
  return { status: 'pass', detail: `wiki_delta 路径存在（${raw}）` }
}

// close_wiki_promotion（PRD_DEF-003 后续棒 · 语义映射旧包 @cyning/harness@2.24.0
// lib/close-loop-gates.js evaluateWikiPromotionPointer）：仅 experience_capture=required 且
// wiki_delta=path 时闸 —— ### 经验总结 节须含晋升指针（coding_wiki / wiki_promoted: / Wiki: /
// 与 wiki_delta 相同子串）。跳过口径（pass · 与旧包逐字对齐）：未声明 experience_capture /
// ≠required / 无 wiki_delta（缺字段由 close_wiki_delta 挡）/ wiki_delta=none|n/a。
// 豁免旗标与 wiki_delta 共用 --allow-wiki-gap（lifecycle.yaml 登记 · 旧包同口径降旗面）。
// 与旧包差异：经验节标题沿用本包既有约定 ### 经验总结（同 evalCloseExperience 单一抽取口径；
// 旧包额外兼容 Experience/经验/lessons 标题）。
const WIKI_PROMO_LITERAL_RE = /^(none|n\/a)$/i
export function evalCloseWikiPromotion(absTask: string, content: string): CloseGuardOutcome {
  const meta = parseHarnessMeta(content)
  const expMode = (meta.experience_capture ?? '').trim()
  if (!expMode) {
    return { status: 'pass', detail: '未声明 experience_capture · 跳过 wiki 晋升指针' }
  }
  if (expMode.toLowerCase() !== 'required') {
    return {
      status: 'pass',
      detail: `experience_capture=${expMode}（非 required · 跳过 wiki 晋升指针）`,
    }
  }
  const wikiRaw = (meta.wiki_delta ?? '').trim()
  if (!wikiRaw) {
    return { status: 'pass', detail: '无 wiki_delta · 晋升指针由 close_wiki_delta 处理' }
  }
  if (WIKI_PROMO_LITERAL_RE.test(wikiRaw)) {
    return { status: 'pass', detail: `wiki_delta=${wikiRaw} · 不要求经验节 wiki 指针` }
  }
  const section = extractSection(content, '### 经验总结', '\n##')
  if (!section) {
    return {
      status: 'fail',
      detail:
        'experience_capture=required 且 wiki_delta=path 时须有经验节并含 wiki 指针' +
        '（或 --allow-wiki-gap 豁免）',
    }
  }
  const rel = wikiRaw.replace(/^\.\/+/, '').replace(/\\/g, '/')
  const ok =
    /coding_wiki/i.test(section) ||
    /wiki_promoted\s*[:：]/i.test(section) ||
    /(?:^|\n)\s*Wiki\s*[:：]/im.test(section) ||
    (rel !== '' && section.includes(rel))
  if (!ok) {
    return {
      status: 'fail',
      detail:
        '经验节缺 wiki 晋升指针（须含 coding_wiki 路径 / wiki_promoted: / Wiki: /' +
        ' 或与 wiki_delta 相同子串 · 或 --allow-wiki-gap 豁免）',
    }
  }
  return { status: 'pass', detail: '经验节含 wiki 晋升指针' }
}

// ==== doc-health · close_pr_merged / close_hub_index（SPEC docs/spec/doc-health） ====

const HUB_CANDIDATES = [
  'docs/tasks/done/README.md',
  'docs/harness/tasks/done/README.md',
]

/** 仓级 Hub 闸：`.coding-kit/local.json`（legacy `.cyning-harness/local.json`）的 `close_hub_gate`；缺省 true（默认开）。 */
export function isCloseHubGateEnabled(root: string): boolean {
  const localPath = resolveLayoutFile(root, 'local.json').abs
  if (!existsSync(localPath)) return true
  try {
    const raw = JSON.parse(readFileSync(localPath, 'utf8')) as { close_hub_gate?: unknown }
    if (raw.close_hub_gate === false) return false
    return true
  } catch {
    return true
  }
}

export function findHubFile(root: string): string | null {
  for (const rel of HUB_CANDIDATES) {
    const abs = path.join(root, rel)
    if (existsSync(abs)) return abs
  }
  return null
}

/** 探测 PR 合入态。测试可设 `DSH_CLOSE_PR_STATE=MERGED|OPEN|NONE` 旁路 gh。 */
export function resolvePrMergedState(
  root: string,
  relatedPr?: string,
): { ok: boolean; state: string; detail: string } {
  const envState = (process.env.DSH_CLOSE_PR_STATE ?? '').trim().toUpperCase()
  if (envState) {
    if (envState === 'MERGED') return { ok: true, state: 'MERGED', detail: `DSH_CLOSE_PR_STATE=MERGED` }
    if (envState === 'OPEN' || envState === 'CLOSED' || envState === 'NONE') {
      return { ok: false, state: envState, detail: `DSH_CLOSE_PR_STATE=${envState}` }
    }
    return { ok: false, state: envState, detail: `DSH_CLOSE_PR_STATE 非法: ${envState}` }
  }
  const args = relatedPr
    ? ['pr', 'view', relatedPr.replace(/^#/, ''), '--json', 'state,url']
    : ['pr', 'view', '--json', 'state,url']
  const r = spawnSync('gh', args, { cwd: root, encoding: 'utf8' })
  if (r.error || r.status !== 0) {
    const err = (r.stderr || r.stdout || r.error?.message || 'gh failed').trim()
    return {
      ok: false,
      state: 'NONE',
      detail: `无法解析关联 PR（gh 失败或无 PR）: ${err.slice(0, 200)}`,
    }
  }
  try {
    const parsed = JSON.parse(r.stdout || '{}') as { state?: string; url?: string }
    const state = (parsed.state ?? '').toUpperCase()
    if (state === 'MERGED') {
      return { ok: true, state, detail: `PR MERGED${parsed.url ? ` · ${parsed.url}` : ''}` }
    }
    return {
      ok: false,
      state: state || 'UNKNOWN',
      detail: `PR 状态非 MERGED（当前: ${state || 'unknown'}）`,
    }
  } catch {
    return { ok: false, state: 'NONE', detail: 'gh 输出无法解析 JSON' }
  }
}

export function evalClosePrMerged(absTask: string, content: string): CloseGuardOutcome {
  const meta = parseHarnessMeta(content)
  const policy = (meta.close_pr_policy ?? '').trim().toLowerCase()
  if (policy === 'exempt') {
    if (!(meta.close_pr_exempt_note ?? '').trim()) {
      return {
        status: 'fail',
        detail: 'close_pr_policy=exempt 但缺 close_pr_exempt_note（或 --allow-no-pr-merge 豁免）',
      }
    }
    return { status: 'pass', detail: `close_pr_policy=exempt（${meta.close_pr_exempt_note}）` }
  }
  const root = taskTargetRoot(absTask)
  const related = (meta.related_pr ?? '').trim() || undefined
  const resolved = resolvePrMergedState(root, related)
  if (resolved.ok) return { status: 'pass', detail: resolved.detail }
  return {
    status: 'fail',
    detail: `${resolved.detail}（或 --allow-no-pr-merge / close_pr_policy=exempt）`,
  }
}

export function evalCloseHubIndex(absTask: string, _content: string): CloseGuardOutcome {
  const root = taskTargetRoot(absTask)
  if (!isCloseHubGateEnabled(root)) {
    return { status: 'pass', detail: 'close_hub_gate=false（仓级关闭 · skip）' }
  }
  const hub = findHubFile(root)
  if (!hub) return { status: 'pass', detail: '无 Hub 文件 · skip close_hub_index' }
  const base = path.basename(absTask)
  const body = readFileSync(hub, 'utf8')
  // 索引行：markdown 链接目标或纯文本含归档文件名
  const linked =
    body.includes(base) ||
    new RegExp(`\\]\\([^)]*${escapeRegExp(base)}\\)`).test(body) ||
    new RegExp(`\\]\\(\\./[^)]*${escapeRegExp(base)}\\)`).test(body)
  if (!linked) {
    return {
      status: 'fail',
      detail: `Hub 缺本 task 索引行（须含 ${base} · Hub=${path.relative(root, hub)} · 或 --allow-no-hub）`,
    }
  }
  return { status: 'pass', detail: `Hub 含索引（${base}）` }
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^$${}()|[\]\\]/g, '\\$&')
}

/** docs/spec 根级裸 SPEC-*.md（warn · 不 BLOCK）。 */
export function listBareSpecFiles(root: string): string[] {
  const dir = path.join(root, 'docs', 'spec')
  if (!existsSync(dir)) return []
  return readdirSync(dir)
    .filter((f) => /^SPEC-.+\.md$/i.test(f))
    .sort()
}

// close 守卫注册表（lifecycle.yaml close 转移登记顺序）：未登记 id → null（= 未接线 · 调用方明示，
// R-TRUTH-1 禁止第三态；登记守卫全部已接线 —— close_wiki_promotion 于 PRD_DEF-003 后续棒接线，
// to_00 spec_reviews_retention 实现见本文件 evalSpecReviewsRetention（verify --spec 同一实现源）；
// doc-health：close_pr_merged / close_hub_index）。
export function evalCloseGuard(
  guardId: string,
  absTask: string,
  content: string,
): CloseGuardOutcome | null {
  switch (guardId) {
    case 'close_invoke':
      return evalCloseInvokeHats(absTask, content)
    case 'close_self_check':
      return evalCloseSelfCheck(content)
    case 'close_acceptance':
      return evalCloseAcceptance(content)
    case 'close_slug':
      return evalCloseSlug(absTask, content)
    case 'close_status':
      return evalCloseStatus(content)
    case 'close_review':
      return evalCloseReview(absTask)
    case 'close_graph_delta':
      return evalCloseGraphDelta(absTask, content)
    case 'close_kpi':
      return evalCloseKpi(content)
    case 'close_experience':
      return evalCloseExperience(content)
    case 'close_wiki_delta':
      return evalCloseWikiDelta(absTask, content)
    case 'close_wiki_promotion':
      return evalCloseWikiPromotion(absTask, content)
    case 'close_pr_merged':
      return evalClosePrMerged(absTask, content)
    case 'close_hub_index':
      return evalCloseHubIndex(absTask, content)
    default:
      return null
  }
}
