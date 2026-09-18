import { readFileSync } from 'node:fs'
import {
  hookConfigContains,
  isShellHookManaged,
  shellHookMatchesProduct,
  type ConfigHookTrigger,
} from './hooks.ts'
import {
  isMarkdownMergeTarget,
  verifyMarkdownProductBlock,
  type PlannedItem,
} from './materialize.ts'

/**
 * 3.0 W2 阶段二 · host verify 物化校验（S3.4 · 验收 #2/#9 · F-W2-04 fail-closed）。
 * 比对三分形态（读取宿主侧已物化内容 ↔ resolved 声明逐项比对）：
 *  ① 全文件管理落点（skills/commands 物化文件）→ 逐字比对；
 *  ② marker-merge 落点（CLAUDE.md/AGENTS.md/GEMINI.md）→ 产品块比对
 *    （local 块与块外用户内容不计篡改 · verifyMarkdownProductBlock）；
 *  ③ JSON 合并落点（.claude/settings.json / .cursor/hooks.json / .gemini/settings.json）→
 *    包含性比对（产品 hook 条目 ⊆ 实况 · 用户其他键不计）。
 * fail-closed（F-W2-04）：落点无法读取 → unreadable 按红处理（不静默跳过）。
 */

export type HostVerifyStatus = 'ok' | 'missing' | 'mismatch' | 'unreadable' | 'degraded-none'

export type HostVerifyCheck = {
  host_id: string
  target: string
  kind: string
  status: HostVerifyStatus
  detail?: string
}

/** 红态集合（degraded-none 不计红绿 · S3.4 mechanism none 无落点可比非缺陷） */
export function isVerifyRed(status: HostVerifyStatus): boolean {
  return status === 'missing' || status === 'mismatch' || status === 'unreadable'
}

function readForVerify(abs: string): { text: string } | { err: 'missing' | 'unreadable' } {
  let text: string
  try {
    text = readFileSync(abs, 'utf8')
  } catch (err) {
    const code = (err as NodeJS.ErrnoException).code
    if (code === 'ENOENT' || code === 'ENOTDIR') return { err: 'missing' }
    return { err: 'unreadable' } // F-W2-04：权限/IO 错一律按红（fail-closed）
  }
  return { text }
}

/**
 * 单 planned item 比对（物化计划 = resolved 声明的落点展开 · 与 apply/update 同一 planApply 管线）。
 * conflict op 条目（声明内容从未物化）按形态照常比对 —— 实况 ≠ 声明即 mismatch 报红（不静默）。
 */
export function checkPlannedItem(item: PlannedItem): HostVerifyCheck {
  const base = { host_id: item.hostId, target: item.destRel, kind: item.kind as string }
  const got = readForVerify(item.destAbs)
  if ('err' in got) {
    return {
      ...base,
      status: got.err,
      detail:
        got.err === 'missing'
          ? '落点文件缺失（删除或未物化）'
          : '落点无法读取（F-W2-04 fail-closed 按红处理）',
    }
  }
  // shell-hook 落点（独立 hook 脚本）→ 全文件管理逐字比对（S3.4 形态① · 验收 #10）
  // 3.0.1 W5：亦认可选 `@semver` 钉版形态（与未钉版产品声明等价 · 防 verify 假红）
  if (item.kind === 'hook' && item.hookMechanism === 'shell-hook') {
    if (got.text === item.nextText) {
      return { ...base, status: 'ok', detail: 'shell-hook 脚本逐字一致' }
    }
    const triggers = (item.hooksTriggers ?? []) as ConfigHookTrigger[]
    if (isShellHookManaged(got.text) && shellHookMatchesProduct(got.text, triggers)) {
      return { ...base, status: 'ok', detail: 'shell-hook 脚本与产品声明一致（含可选钉版）' }
    }
    return { ...base, status: 'mismatch', detail: 'shell-hook 脚本内容与声明不符（篡改或未物化）' }
  }
  // 形态③：JSON 合并落点（hooks 声明）→ 包含性比对
  if (item.kind === 'hook') {
    const triggers = item.hooksTriggers ?? []
    const res = hookConfigContains(got.text, item.hostId, triggers)
    if (res.ok) {
      return { ...base, status: 'ok', detail: `hooks 包含性比对一致（${triggers.length} 条目 · 用户键不计）` }
    }
    return {
      ...base,
      status: 'mismatch',
      detail: `产品 hook 条目缺失或被篡改: ${res.missing.join(', ')}${res.reason ? `（${res.reason}）` : ''}`,
    }
  }
  // 形态②：marker-merge 落点 → 产品块比对（local 块/块外用户内容不计）
  if (item.kind === 'always_on' && isMarkdownMergeTarget(item.destRel)) {
    const sourceBody = readFileSync(item.sourceAbs, 'utf8')
    if (verifyMarkdownProductBlock(got.text, sourceBody)) {
      return { ...base, status: 'ok', detail: 'marker 产品块一致（local 块/块外定制不计）' }
    }
    return { ...base, status: 'mismatch', detail: '产品块缺失或被篡改' }
  }
  // 形态①：全文件管理落点 → 逐字比对
  if (got.text === item.nextText) {
    return { ...base, status: 'ok', detail: '逐字一致' }
  }
  return { ...base, status: 'mismatch', detail: '内容与声明不符（篡改或未物化）' }
}
