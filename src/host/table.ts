import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fail, kitLayoutJoin, packageRoot } from '../cli-shared.ts'
import { yamlLoad } from '../yaml.ts'
import { probeHostAdaptSchemaVersion, validateHostAdaptDocDispatch } from './schema.ts'
import { resolveV2Model } from './resolve.ts'

const DEFAULT_EXAMPLE_REL = path.join('assets', 'ide', 'host-adapt', 'examples', 'mvp-hosts.yaml')

/** 粘性文件（相对 `.coding-kit/`） */
const HOST_TOOLS_STICKY_REL = 'host-tools.json'

export type AlwaysOnEntry = { target: string; source: string }
export type DirFromEntry = { target_dir: string; from: string }
export type CommandsEntry = { target_dir: string; from: string; profile?: string }
export type HostRow = {
  host_id: string
  surfaces: {
    always_on: AlwaysOnEntry[]
    skills: DirFromEntry[]
    commands: CommandsEntry[]
  }
}

export function hostToolsStickyAbs(target: string): string {
  return kitLayoutJoin(target, HOST_TOOLS_STICKY_REL)
}

export function kitPackageSemver(): string | undefined {
  try {
    const raw = readFileSync(path.join(packageRoot(), 'package.json'), 'utf8')
    const pkg = JSON.parse(raw) as { version?: unknown }
    return typeof pkg.version === 'string' && pkg.version.trim().length > 0
      ? pkg.version.trim()
      : undefined
  } catch {
    return undefined
  }
}

export function asHostRows(data: unknown): HostRow[] {
  const root = data as { hosts: HostRow[] }
  return root.hosts
}

/**
 * 消费面行提取（F-W1-11 · resolved rows 一次性展开）：v1 → asHostRows 恒等（评审文 §3.2 行② ·
 * v1 行为逐字不变）；v2 → defaults/extends 全量展开后的行（materialize/report 只消费展开后行 ·
 * 零感知 extends/defaults）。前置：调用方已经 validateHostAdaptDocDispatch 校验零 issue。
 */
export function resolvedHostRows(data: unknown): HostRow[] {
  if (probeHostAdaptSchemaVersion(data).kind !== 'v2') return asHostRows(data)
  const resolved = resolveV2Model(data)
  // 防御不可达：装载路径先经 dispatch 校验（同口径）· 校验零 issue 则解析必 ok
  if (!resolved.ok) {
    fail(
      `host 适配表 v2 解析失败（内部不一致 · 应先经 host validate 拦截）:\n${resolved.issues.map((e) => `  - [${e.code}] ${e.path}: ${e.message}`).join('\n')}`,
    )
  }
  return resolved.model.rows
}

export function resolveValidateFile(fileArg: string | undefined): string {
  if (fileArg) return path.resolve(process.cwd(), fileArg)
  return path.join(packageRoot(), DEFAULT_EXAMPLE_REL)
}

/** 适配表 host_id 列表（表顺序）；供 init 询问 / `--tools` 校验复用 */
export function listKnownHostIds(fileArg?: string): string[] {
  const fileAbs = resolveValidateFile(fileArg)
  if (!existsSync(fileAbs)) {
    fail(`host 适配表不存在: ${fileAbs}`)
  }
  let data: unknown
  try {
    data = yamlLoad(readFileSync(fileAbs, 'utf8'))
  } catch (err) {
    fail(`host 适配表 YAML 解析失败: ${(err as Error).message}`)
  }
  const issues = validateHostAdaptDocDispatch(data)
  if (issues.length > 0) {
    fail(
      `host 适配表无效:\n${issues.map((e) => `  - [${e.code}] ${e.path}: ${e.message}`).join('\n')}`,
    )
  }
  return asHostRows(data).map((r) => r.host_id)
}
