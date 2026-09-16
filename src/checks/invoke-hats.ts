import { existsSync, readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { extractTaskSlug, normalizeSlug, parseHarnessMeta } from '../cli-shared.ts'

// DEF-003 阶段二 T5/T6：invoke hats 检查单一实现源（verify pre-30 硬闸与 task close 帽集合覆盖共用）。
const INVOKE_DIR_CANDIDATES = ['docs/harness/invokes/by-task', 'invokes/by-task']
const INVOKE_HAT_TOKENS = new Set(['10', '20', '22', '30', '40', '50', '00', 'close'])
// pre-30 帽词表（FRAGMENT_30_gate_verify_v1_zh.md：required ∩ {10,20,00}）
export const PRE30_HATS = ['10', '20', '00']

// 文件名口径 invoke_YYYYMMDD_<hat>[_<hat>...]_<slug>.md：hat token 仅在日期后连续段（TEMPLATE_invoke.md），
// 合并文件（如 30_40）双计。
export function extractHatsFromInvokeName(name: string): string[] {
  const base = path.basename(name, '.md')
  const parts = base.split('_')
  if (parts.length < 4 || parts[0] !== 'invoke') return []
  if (!/^\d{8}$/.test(parts[1]!)) return [] // parts.length >= 4 已判（E5 收窄）
  const hats: string[] = []
  for (let i = 2; i < parts.length; i += 1) {
    const tok = parts[i]!.toLowerCase() // i < parts.length 循环界内（E5 收窄）
    if (!INVOKE_HAT_TOKENS.has(tok)) break
    hats.push(tok)
  }
  return hats
}

// required 集合解析：显式 required_invoke_hats 优先于 invoke_retention_profile；
// 缺省 default=10,30,40 · minimal=30 · full=10,20,30,40,00,CLOSE（与旧包 2.24.0 口径已核对一致：
// lib/task-meta.js INVOKE_RETENTION_PROFILES · 不含 22/50 · 1.6.0 修正前曾多列 22/50）；
// 未知 profile 按 default 计并留痕于 source。
export function resolveRequiredInvokeHats(meta: Record<string, string>): {
  required: string[]
  source: string
} {
  const explicit = (meta.required_invoke_hats ?? '').trim()
  if (explicit) {
    const required = explicit
      .split(/[,，\s]+/)
      .map((s) => s.trim())
      .filter(Boolean)
    return { required, source: `required_invoke_hats=${explicit}` }
  }
  const profile = (meta.invoke_retention_profile ?? '').trim() || 'default'
  if (profile === 'minimal') return { required: ['30'], source: 'invoke_retention_profile=minimal' }
  if (profile === 'full') {
    return {
      required: ['10', '20', '30', '40', '00', 'CLOSE'],
      source: 'invoke_retention_profile=full',
    }
  }
  const source =
    profile === 'default'
      ? 'invoke_retention_profile=default（缺省）'
      : `invoke_retention_profile=${profile}（未知值 · 按 default 计）`
  return { required: ['10', '30', '40'], source }
}

// 汇聚 docs/harness/invokes/by-task/<slug>/（及 invokes/by-task/ 备选）下全部 invoke 文件的帽 token。
export function collectInvokeHats(target: string, slug: string): Set<string> {
  const found = new Set<string>()
  const dirNames = new Set([slug, normalizeSlug(slug)])
  for (const rel of INVOKE_DIR_CANDIDATES) {
    for (const dirName of dirNames) {
      const dir = path.join(target, rel, dirName)
      if (!existsSync(dir)) continue
      let names: string[] = []
      try {
        names = readdirSync(dir)
      } catch {
        continue
      }
      for (const name of names) {
        if (!name.endsWith('.md')) continue
        for (const hat of extractHatsFromInvokeName(name)) found.add(hat)
      }
    }
  }
  return found
}

export function missingInvokeHats(target: string, slug: string, hats: string[]): string[] {
  if (hats.length === 0) return []
  const found = collectInvokeHats(target, slug)
  return hats.filter((h) => !found.has(h.toLowerCase()))
}

// DEF-003 阶段二 T5（verify pre-30 硬闸真值源）：required ∩ {10,20,00} 文件存在性。
// 缺 40 不挡 30（40 ∉ PRE30_HATS）；minimal / 显式 required 无 pre-30 帽 → preRequired=∅ → 不挡。
export function checkPre30InvokeHats(
  target: string,
  absTask: string,
): { ok: boolean; missing: string[]; preRequired: string[]; source: string } {
  const content = readFileSync(absTask, 'utf8')
  const meta = parseHarnessMeta(content)
  const { required, source } = resolveRequiredInvokeHats(meta)
  const preRequired = required.filter((h) => PRE30_HATS.includes(h))
  const slug = meta.task_slug ?? extractTaskSlug(absTask)
  const missing = missingInvokeHats(target, slug, preRequired)
  return { ok: missing.length === 0, missing, preRequired, source }
}
