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
