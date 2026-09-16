import { fail, printJson } from '../cli-shared.ts'
import type { HostContractResult } from '../host-contract.ts'
import { isPlainObject, type HostValidateIssue } from './schema.ts'

export type HostWriteReport = {
  command: 'host apply' | 'host update'
  mode: 'dry-run' | 'apply' | 'update'
  hosts: string[]
  planned: string[]
  written: string[]
  skipped: string[]
  conflict: string[]
  /** 旧 Claude 扁平 kit-*.md 将删/已删（备份后清除，禁新旧双份） */
  removed: string[]
  backup: string | null
  contract?: HostContractResult
  ok: boolean
  verdict: 'PASS' | 'FAIL'
}

export function hostBanner(command: HostWriteReport['command']): string {
  return command === 'host update' ? 'HOST UPDATE' : 'HOST APPLY'
}

export function printHostHuman(report: HostWriteReport): void {
  const banner = hostBanner(report.command)
  console.log(`${banner}: ${report.mode}`)
  console.log(`hosts: ${report.hosts.join(', ')}`)
  const sections: Array<
    ['planned' | 'written' | 'skipped' | 'conflict' | 'removed', string[]]
  > = [
    ['planned', report.planned],
    ['written', report.written],
    ['skipped', report.skipped],
    ['conflict', report.conflict],
    ['removed', report.removed],
  ]
  for (const [label, items] of sections) {
    console.log(`${label} (${items.length}):`)
    if (items.length === 0) console.log('  (无)')
    else for (const p of items) console.log(`  ${p}`)
  }
  if (report.backup) console.log(`backup: ${report.backup}`)
  console.log(`${banner}: ${report.verdict}`)
}

export function emitHostFail(
  json: boolean,
  command: HostWriteReport['command'],
  base: string,
  payload: Omit<HostWriteReport, 'ok' | 'verdict'> & { errors?: HostValidateIssue[]; message?: string },
  extraLines: string[],
): never {
  if (json) {
    // 2.4.1 NEW-2：基参取命令 target（调用方透传 · realpath 双侧归一由统一出口兜底）
    printJson(base, {
      ...payload,
      ok: false,
      verdict: 'FAIL',
    })
  } else {
    for (const line of extraLines) console.error(line)
    console.log(`${hostBanner(command)}: FAIL`)
  }
  fail('', 2)
}

export function tableVersionOf(data: unknown): string {
  if (isPlainObject(data) && typeof data.version === 'string') return data.version
  return ''
}

export function emitU01Degraded(
  json: boolean,
  command: HostWriteReport['command'],
  base: string,
  payloadBase: Omit<HostWriteReport, 'ok' | 'verdict' | 'contract'>,
  contract: HostContractResult,
): never {
  const extraLines = [
    'U-01: 宿主契约不匹配（degraded），拒绝写盘',
    ...contract.reasons.map((r) => `  - ${r}`),
  ]
  emitHostFail(
    json,
    command,
    base,
    {
      ...payloadBase,
      planned: [],
      written: [],
      skipped: [],
      conflict: [],
      removed: [],
      backup: null,
      contract,
    },
    extraLines,
  )
}
