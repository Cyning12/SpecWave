import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fail, kitLayoutJoin, packageRoot } from '../cli-shared.ts'
import { yamlLoad } from '../yaml.ts'
import { validateHostAdaptDocDispatch } from './schema.ts'

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
