import { isPlainObject } from './schema.ts'

/**
 * 3.0 W2 阶段二 · hooks 物化器（S3.3 · config-hook 族 · 只声明与物化 · 运行时归宿主）。
 * 族抽象数据驱动：落点/事件键/条目形态为宿主描述符常量，不为单宿主开特判分支（F-W2-06）。
 * 30 定稿登记：
 *  ① 物化条目 command = hook-guard 分发入口（S3.3 语义规格 · hook-guard CLI 归后续棒③ · 本棒物化声明面）；
 *    命令串收窄（git commit / task close 匹配）与 exit 2 阻断语义由 hook-guard 兑现，不采用宿主编排语法
 *    （claude if 条件语法未实测校准 · F-W2-06 登记 · cursor 非 2 退出码 fail-open 口径随 hook-guard 文档化）。
 *  ② cursor hooks.json 根骨架 version: 1（官方格式）· 既有文件用户 version 键保留不动（深合并保用户键）。
 *  ③ 冲突判定 = 结构性冲突（根非对象 / hooks 非对象 / 事件键非数组 / JSON 解析失败）→ conflict 点名不覆写；
 *    内容差异一律深合并（用户条目保留 · 本包条目按 hook-guard 命令串识别原位更新 · F-W2-10）。
 *  ④ shell-hook 族本棒零落点（物化归 ⑦ 阶段棒 · 内置表无此声明 · 零行为面）。
 */

export type ConfigHookTrigger = 'pre-commit' | 'pre-archive'

/** hook-guard 分发入口命令串（本包管理条目的识别 marker） */
export function hookGuardCommand(trigger: ConfigHookTrigger): string {
  return `npx spec-wave hook-guard --trigger ${trigger}`
}

type ConfigHookHostSpec = {
  /** 物化落点（相对 target · 全部非 S2） */
  destRel: string
  /** 事件数组路径（root 起 · 末段为数组键） */
  eventPath: string[]
  /** 单 trigger 的产品条目形态（语义规格 S3.3 · 字面 30 定稿） */
  entryFor: (trigger: ConfigHookTrigger) => Record<string, unknown>
  /** 新文件根骨架（既有文件深合并保用户键 · 不强制） */
  skeleton: () => Record<string, unknown>
}

const matcherEntry =
  (matcher: string) =>
  (trigger: ConfigHookTrigger): Record<string, unknown> => ({
    matcher,
    hooks: [{ type: 'command', command: hookGuardCommand(trigger) }],
  })

/** config-hook 族宿主落点映射（S3.3 表 · 族内数据驱动） */
export const CONFIG_HOOK_HOSTS: Record<string, ConfigHookHostSpec> = {
  claude: {
    destRel: '.claude/settings.json',
    eventPath: ['hooks', 'PreToolUse'],
    entryFor: matcherEntry('Bash'),
    skeleton: () => ({}),
  },
  cursor: {
    destRel: '.cursor/hooks.json',
    eventPath: ['hooks', 'beforeShellExecution'],
    entryFor: (trigger) => ({ command: hookGuardCommand(trigger) }),
    skeleton: () => ({ version: 1 }),
  },
  gemini: {
    destRel: '.gemini/settings.json',
    eventPath: ['hooks', 'BeforeTool'],
    entryFor: matcherEntry('run_shell_command'),
    skeleton: () => ({}),
  },
}

/** JSON 值深等（物化条目逐字比对 · 键序无关） */
export function jsonDeepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true
  if (Array.isArray(a) && Array.isArray(b)) {
    return a.length === b.length && a.every((v, i) => jsonDeepEqual(v, b[i]))
  }
  if (isPlainObject(a) && isPlainObject(b)) {
    const ka = Object.keys(a)
    const kb = Object.keys(b)
    return ka.length === kb.length && ka.every((k) => k in b && jsonDeepEqual(a[k], b[k]))
  }
  return false
}

/** 本包管理条目识别（hook-guard 命令串 marker · F-W2-10「可识别标记」口径） */
export function isPackageManagedHookEntry(entry: unknown, trigger: ConfigHookTrigger): boolean {
  return (
    entry !== null &&
    typeof entry === 'object' &&
    JSON.stringify(entry).includes(hookGuardCommand(trigger))
  )
}

/** 宿主 config-hook 落点描述符（无映射 → undefined · 调用方 fail-closed） */
export function configHookSpecOf(hostId: string): ConfigHookHostSpec | undefined {
  return CONFIG_HOOK_HOSTS[hostId]
}

/** 产品条目列表（声明 triggers → 条目 · 顺序 = triggers 声明序） */
export function productHookEntries(
  hostId: string,
  triggers: ConfigHookTrigger[],
): Record<string, unknown>[] {
  const spec = CONFIG_HOOK_HOSTS[hostId]
  if (!spec) return []
  return triggers.map((t) => spec.entryFor(t))
}

export type HookMergeResult =
  | { ok: true; next: Record<string, unknown> }
  | { ok: false; reason: string }

/**
 * hooks JSON 深合并（F-W2-10）：保用户键 · 本包条目按 trigger marker 原位更新 · 缺失追加。
 * 结构性冲突（根非对象 / 中间键非对象 / 事件键非数组 / JSON 坏）→ ok:false 点名原因（不覆写）。
 */
export function mergeHookConfig(
  existingText: string | null,
  hostId: string,
  triggers: ConfigHookTrigger[],
): HookMergeResult {
  const spec = CONFIG_HOOK_HOSTS[hostId]
  if (!spec) return { ok: false, reason: `config-hook 宿主无物化落点映射: ${hostId}` }
  let root: unknown
  if (existingText === null) {
    root = spec.skeleton()
  } else {
    try {
      root = JSON.parse(existingText) as unknown
    } catch {
      return { ok: false, reason: 'JSON 解析失败（不覆写用户配置）' }
    }
  }
  if (!isPlainObject(root)) return { ok: false, reason: '根须为对象（不覆写用户配置）' }
  const nextRoot: Record<string, unknown> = { ...root }
  let parent = nextRoot
  const midKeys = spec.eventPath.slice(0, -1)
  const eventKey = spec.eventPath[spec.eventPath.length - 1]!
  for (const key of midKeys) {
    const cur = parent[key]
    if (cur === undefined) {
      const created: Record<string, unknown> = {}
      parent[key] = created
      parent = created
    } else if (!isPlainObject(cur)) {
      return { ok: false, reason: `${key} 须为对象（结构性冲突 · 不覆写用户配置）` }
    } else {
      const copy = { ...cur }
      parent[key] = copy
      parent = copy
    }
  }
  const curArr = parent[eventKey]
  let arr: unknown[]
  if (curArr === undefined) {
    arr = []
  } else if (!Array.isArray(curArr)) {
    return { ok: false, reason: `${eventKey} 须为数组（结构性冲突 · 不覆写用户配置）` }
  } else {
    arr = [...curArr]
  }
  for (const trigger of triggers) {
    const entry = spec.entryFor(trigger)
    const managedIdx = arr.findIndex(
      (e) => jsonDeepEqual(e, entry) || isPackageManagedHookEntry(e, trigger),
    )
    if (managedIdx >= 0) {
      if (!jsonDeepEqual(arr[managedIdx], entry)) arr[managedIdx] = entry // 本包条目原位修复/更新
    } else {
      arr.push(entry)
    }
  }
  parent[eventKey] = arr
  return { ok: true, next: nextRoot }
}

export type HookContainResult = { ok: true } | { ok: false; missing: ConfigHookTrigger[]; reason?: string }

/**
 * host verify 包含性比对（S3.4 形态③）：声明的产品 hook 条目须逐字存在于宿主配置相应位置
 * （用户其他键/条目不计）· 条目被删/被改/结构坏/JSON 坏 → 点名缺失 trigger。
 */
export function hookConfigContains(
  existingText: string,
  hostId: string,
  triggers: ConfigHookTrigger[],
): HookContainResult {
  const spec = CONFIG_HOOK_HOSTS[hostId]
  if (!spec) return { ok: false, missing: [...triggers], reason: `config-hook 宿主无落点映射: ${hostId}` }
  let root: unknown
  try {
    root = JSON.parse(existingText) as unknown
  } catch {
    return { ok: false, missing: [...triggers], reason: 'JSON 解析失败' }
  }
  if (!isPlainObject(root)) return { ok: false, missing: [...triggers], reason: '根非对象' }
  let node: unknown = root
  for (const key of spec.eventPath.slice(0, -1)) {
    if (!isPlainObject(node) || !(key in node)) {
      return { ok: false, missing: [...triggers], reason: `缺 ${key} 节` }
    }
    node = (node as Record<string, unknown>)[key]
  }
  const eventKey = spec.eventPath[spec.eventPath.length - 1]!
  const arr = isPlainObject(node) ? (node as Record<string, unknown>)[eventKey] : undefined
  if (!Array.isArray(arr)) {
    return { ok: false, missing: [...triggers], reason: `缺 ${eventKey} 数组` }
  }
  const missing = triggers.filter(
    (t) => !arr.some((e) => jsonDeepEqual(e, spec.entryFor(t))),
  )
  return missing.length > 0 ? { ok: false, missing } : { ok: true }
}
