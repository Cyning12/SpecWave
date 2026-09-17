import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { normalizeSlug } from '../cli-shared.ts'
import { yamlLoad } from '../yaml.ts'

// ==== 2.3-W4 过渡豁免数据（D-23-W4-EXEMPT-FORMAT · F-W4-04 留痕四字段强制） ====
// 落点 docs/harness/legacy-gate-exempt.yaml（非 S2 · 手写数据 · 非 host 物化 target）；
// 条目缺 slug/reason/date/authorized_by 任一字段 → 无效（不豁免）并入 invalid 留痕 warn。
export const LEGACY_GATE_EXEMPT_REL = 'docs/harness/legacy-gate-exempt.yaml'

export type LegacyGateExemptEntry = { slug: string; reason: string; date: string; authorized_by: string }
export type LegacyGateExempt = {
  reviews: Map<string, LegacyGateExemptEntry>
  invoke_hats: Map<string, LegacyGateExemptEntry>
  invalid: string[]
}

// 3.0-W4 NEW-10 A1（评审文 w4_semantic_criteria_review_20260917 §6.1 定稿 · OQ-2 A1 强制 + A2 可选采纳）：
// authorized_by 形态三元判 —— ① 全角括号前身份段非空 ∧ ② 全角括号内 ISO 日期（YYYY-MM-DD）∧
// ③ 括号内授权出处关键词（授权/批准/会话/答复 任一）；不合 → 入 invalid 留痕 warn · 不豁免（与缺四字段同处置面）。
// 存量 34/34 同构「00（2026-09-12 维护者会话授权）」合规零误伤（评审文 §6.1 实测 · 回归锁）。
// 诚实边界（R-③ · 评审文 §6.1 末行）：A1 锁「授权陈述的可稽核形态」· 不能机检「维护者是否真的说过」——
// 真实性终局靠 S2 留痕 + 人审；A2（链 tracked 授权记录）登记为可选强形态（强制则与不追溯冲突 · 实测 0/34）。
const A1_AUTHORIZED_BY_RE = /^([^（]+)（([^）]*)）/
const A1_ISO_DATE_RE = /\d{4}-\d{2}-\d{2}/
const A1_SOURCE_RE = /授权|批准|会话|答复/
function passA1(authorizedBy: string): boolean {
  const m = A1_AUTHORIZED_BY_RE.exec(authorizedBy)
  return m !== null && m[1]!.trim().length > 0 && A1_ISO_DATE_RE.test(m[2]!) && A1_SOURCE_RE.test(m[2]!)
}

// U1（3.0-W4 · 评审文 §6.2 定稿）：slug → exempt 条目解析单一实现源（normalizeSlug 归一内收）——
// 裸 verify（reviews 面 · cli/verify.ts）/ lint-done（invoke_hats 面 · cli-task-extra.ts）/
// verify --task done 面三方同构消费；src 内不得出现第二份 .reviews.get()/.invoke_hats.get() 拷贝
//（grep 单源断言 · 验收 #10）；invalid 留痕回显由各消费面打印 exempt.invalid（warn 通道既有）。
export function resolveExemptEntry(
  exempt: LegacyGateExempt,
  section: 'reviews' | 'invoke_hats',
  slug: string,
): LegacyGateExemptEntry | null {
  return exempt[section].get(normalizeSlug(slug)) ?? null
}

export function loadLegacyGateExempt(target: string): LegacyGateExempt {
  const out: LegacyGateExempt = { reviews: new Map(), invoke_hats: new Map(), invalid: [] }
  const abs = path.join(target, LEGACY_GATE_EXEMPT_REL)
  if (!existsSync(abs)) return out
  let data: unknown
  try {
    data = yamlLoad(readFileSync(abs, 'utf8'))
  } catch (e) {
    out.invalid.push('YAML 解析失败: ' + (e as Error).message)
    return out
  }
  for (const section of ['reviews', 'invoke_hats'] as const) {
    const list = (data as Record<string, unknown> | null)?.[section]
    if (list === undefined || list === null) continue
    if (!Array.isArray(list)) {
      out.invalid.push(section + ' 节非列表')
      continue
    }
    for (const ent of list) {
      const e = ent as Partial<LegacyGateExemptEntry> | null
      // 2.3.1 N13 [P2]（验收报告 §3.N）：显式类型判 · 防 YAML 未加引号标量（00 → 整型 0）falsy 静默失效；
      // 同时拒收非字符串标量（旧 falsy 判会把 123/true 静默 String() 收编为有效授权人）。
      const nonEmpty = (x: unknown): x is string => typeof x === 'string' && x.length > 0
      if (!e || !nonEmpty(e.slug) || !nonEmpty(e.reason) || !nonEmpty(e.date) || !nonEmpty(e.authorized_by)) {
        out.invalid.push(section + ' 条目缺四字段（slug/reason/date/authorized_by · 须非空字符串 · 数字形态如 00 须加引号）: ' + JSON.stringify(ent))
        continue
      }
      // NEW-10 A1 形态三元判（四字段非空之上 · 随手填名/裸号形态逐出合规面）
      if (!passA1(e.authorized_by)) {
        out.invalid.push(section + ' 条目 authorized_by 形态不过 A1 三元判（须「身份（YYYY-MM-DD …授权出处词…）」 · 3.0-W4 NEW-10 · 不豁免）: ' + JSON.stringify(ent))
        continue
      }
      out[section].set(normalizeSlug(String(e.slug)), {
        slug: String(e.slug),
        reason: String(e.reason),
        date: String(e.date),
        authorized_by: String(e.authorized_by),
      })
    }
  }
  return out
}
