import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { extractSection, extractTaskSlug, fail, findWikiDeltaOutsideMetaSection, HARNESS_META_HEADING, normalizeSlug, parseHarnessMeta, STATUS_RE } from '../cli-shared.ts'

export type LintIssue = { rule: string; message: string; line?: number }

const CHECKBOX_RE = /^\s*- \[[ xX]\]/m
const ABS_PATH_RE = /(\/(?:Users|home|root)\/[^\s/`\\]|[A-Za-z]:\\Users\\[^\s`\\])/
const KNOWN_STATUS_TOKENS = new Set([
  'draft',
  'pending',
  'in_progress',
  'active',
  'deferred',
  'done',
  'completed',
])
// 自检结论占位符（draft 期合法 · close 前须回填）；cmdTaskClose 亦用
export const PLACEHOLDER_RE = /^（[^）]*(回填|待填)[^）]*）$/

export function lintTaskFile(filePath: string, cwd: string): {
  ok: boolean
  errors: LintIssue[]
  warnings: LintIssue[]
  file: string
  slug: string
} {
  const abs = path.resolve(cwd, filePath)
  if (!existsSync(abs)) fail(`task 文件不存在: ${filePath}`)
  const content = readFileSync(abs, 'utf8')
  const lines = content.split('\n')
  const errors: LintIssue[] = []
  const warnings: LintIssue[] = []
  const meta = parseHarnessMeta(content)
  if (!content.includes(HARNESS_META_HEADING)) {
    errors.push({ rule: 'E1', message: `缺 ${HARNESS_META_HEADING} 节` })
  } else if (!meta.task_slug) {
    errors.push({ rule: 'E1', message: 'Harness 元信息表缺 task_slug' })
  }
  const statusIdx = lines.findIndex((l) => STATUS_RE.test(l))
  if (statusIdx === -1) {
    errors.push({ rule: 'E2', message: '缺 > **状态** 行' })
  } else {
    const token = lines[statusIdx]!.match(STATUS_RE)?.[1]?.toLowerCase() // statusIdx !== -1 已判（E5 收窄）
    if (token && !KNOWN_STATUS_TOKENS.has(token)) {
      warnings.push({ rule: 'W1', message: `状态 token 不在已知词表: ${token}`, line: statusIdx + 1 })
    }
  }
  const acceptance = extractSection(content, '## 验收标准', '\n##')
  if (!acceptance) {
    errors.push({ rule: 'E3', message: '缺 ## 验收标准 节' })
  } else if (!CHECKBOX_RE.test(acceptance)) {
    errors.push({ rule: 'E3', message: '## 验收标准 节内无任何勾选项（- [ ] / - [x]）' })
  }
  if (!lines.some((l) => /^#{2,4}\s.*(失败路径|failure_paths)/i.test(l))) {
    errors.push({ rule: 'E4', message: '缺失败路径节（## 失败路径 或 failure_paths）' })
  }
  const selfCheck = extractSection(content, '### 自检结论', '\n##')
  if (!selfCheck) {
    errors.push({ rule: 'E5', message: '缺 ### 自检结论 节' })
  } else {
    const substantive = selfCheck
      .split('\n')
      .slice(1)
      .map((l) => l.trim())
      .filter(Boolean)
      .filter((l) => !PLACEHOLDER_RE.test(l))
    if (substantive.length === 0) {
      warnings.push({ rule: 'W3', message: '自检结论为占位符（draft 期合法 · close 前须回填）' })
    }
  }
  lines.forEach((l, i) => {
    if (ABS_PATH_RE.test(l)) {
      errors.push({ rule: 'E6', message: `绝对本机路径: ${l.trim().slice(0, 100)}`, line: i + 1 })
    }
  })
  if (meta.task_slug) {
    const fileSlug = extractTaskSlug(abs)
    if (normalizeSlug(meta.task_slug) !== normalizeSlug(fileSlug)) {
      errors.push({
        rule: 'E7',
        message: `slug 不一致: 文件名 ${fileSlug} ≠ 元信息 task_slug ${meta.task_slug}`,
      })
    }
  }
  // E8（K2 · 与 close_wiki_delta 对齐 · 20 审裁定直接 error 不灰度 · 无 draft 豁免）：
  // 仅查存在性——词表（path|none|n/a）与路径存在性仍归 close 闸与 lint-wiki-delta --strict；
  // 错节场景（字段写在其他节）文案指向正确节名并带行号（与 wiki_delta_wrong_section 同源 helper）。
  if (content.includes(HARNESS_META_HEADING) && !(meta.wiki_delta ?? '').trim()) {
    const wrong = findWikiDeltaOutsideMetaSection(content)
    errors.push({
      rule: 'E8',
      message: wrong
        ? `缺 wiki_delta 行：字段写在「${wrong.section}」节 L${wrong.line} · 须在 ${HARNESS_META_HEADING} 表格内（path|none|n/a）`
        : `缺 wiki_delta 行（${HARNESS_META_HEADING} 表格内须含 wiki_delta: path|none|n/a · 与 close_wiki_delta 对齐）`,
      ...(wrong ? { line: wrong.line } : {}),
    })
  }
  if (!content.includes('### 人工闸')) {
    warnings.push({ rule: 'W2', message: '缺 ### 人工闸 节（轻量 task 可忽略本提醒）' })
  }
  const hasThinkSection = /^###\s+R0(\b|[^\d]|$)/m.test(content) || /^#{2,3}\s+.*思考轮/m.test(content)
  if (!hasThinkSection) {
    warnings.push({
      rule: 'W4',
      message: '无思考轮节（SPEC 承载 / bugfix 轨合法豁免 · 有节则查 R0–R5 与控制表）',
    })
  } else {
    // 2.3-W4 G4 思考轮结构接线（warn-only 过渡 · D-23-W4-G4-EXIT：升 failClosed 唯一路径=后续 SPEC 明文裁决）：
    // W5 槽位 / W6 控制表 / W7 early_stop=yes 须 reason——均不挡 LINT: PASS（exit 码不变）。
    const missingSlots = ['R0', 'R1', 'R2', 'R3', 'R4', 'R5'].filter(
      (r) => !new RegExp('^###\\s+' + r + '(\\b|[^\\d]|$)', 'm').test(content),
    )
    if (missingSlots.length > 0) {
      warnings.push({
        rule: 'W5',
        message: '思考轮槽位不全（缺 ' + missingSlots.join('/') + ' · warn-only 过渡 · D-23-W4-G4-EXIT）',
      })
    }
    if (!/^\|\s*轮\s*\|\s*结论\s*\|\s*early_stop\s*\|/m.test(content)) {
      warnings.push({
        rule: 'W6',
        message: '缺思考轮控制表（| 轮 | 结论 | early_stop | 表头 · warn-only 过渡 · D-23-W4-G4-EXIT）',
      })
    }
    if (/\|\s*\*{0,2}yes/i.test(content) && !/reason（early_stop）/.test(content)) {
      warnings.push({
        rule: 'W7',
        message: '控制表含 early_stop=yes 但缺 reason（early_stop）回填（warn-only 过渡 · D-23-W4-G4-EXIT）',
      })
    }
  }
  return {
    ok: errors.length === 0,
    errors,
    warnings,
    file: abs,
    slug: meta.task_slug ?? extractTaskSlug(abs),
  }
}
