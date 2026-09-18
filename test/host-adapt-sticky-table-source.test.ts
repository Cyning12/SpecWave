import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { copyFile, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { describe, it } from 'node:test'
import { fileURLToPath } from 'node:url'
import { runCore } from './_helpers/core-harness.ts'
import { parseHostToolsSticky, type HostToolsSticky } from '../src/cli-host.ts'

const KIT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const V1_FIXTURE = path.join(KIT, 'test', 'fixtures', 'host-adapt', 'mvp-hosts_2_4_2.yaml')
const STICKY_REL = path.join('.coding-kit', 'host-tools.json')

/**
 * 3.0.1 W1 · 粘性 table_source + verify 取表优先级（P1-1）。
 * A1 主回归 / A2 对照锁 / A3 --file 优先 / A4 builtin 零回归 /
 * A5 旧形态 / A6 双向兼容 / A7 version·可选·无 schema。
 */

async function withTemp(fn: (dir: string) => Promise<void>): Promise<void> {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'w1-sticky-table-source-'))
  try {
    await fn(dir)
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
}

function sha256Hex(buf: Buffer | string): string {
  return createHash('sha256').update(buf).digest('hex')
}

/** 模拟 3.0.0 解析：只取当时已知字段，未知键（含 table_source）一律忽略、不报错 */
function parseStickyLike300(raw: string): {
  version: number
  host_ids: string[]
  profile: string
  updated_at: string
  kit_semver?: string
} {
  const data = JSON.parse(raw) as Record<string, unknown>
  assert.equal(data.version, 1)
  assert.ok(Array.isArray(data.host_ids))
  assert.equal(typeof data.profile, 'string')
  assert.equal(typeof data.updated_at, 'string')
  const out: {
    version: number
    host_ids: string[]
    profile: string
    updated_at: string
    kit_semver?: string
  } = {
    version: 1,
    host_ids: data.host_ids as string[],
    profile: data.profile as string,
    updated_at: data.updated_at as string,
  }
  if (typeof data.kit_semver === 'string') out.kit_semver = data.kit_semver
  return out
}

describe('3.0.1 W1 · sticky table_source（P1-1）', { concurrency: 1 }, () => {
  it('A1 主回归：--file 旧表 apply → 默认 verify（无 --file）rc=0 · 粘性含 table_source', async () => {
    await withTemp(async (dir) => {
      const tableRel = 'legacy-hosts.yaml'
      const tableAbs = path.join(dir, tableRel)
      await copyFile(V1_FIXTURE, tableAbs)

      const apply = await runCore([
        'host',
        'apply',
        '--tools',
        'cursor,claude',
        '--profile',
        'core',
        '--file',
        tableAbs,
        '--target',
        dir,
        '--yes',
      ])
      assert.equal(apply.status, 0, apply.combined)

      const stickyRaw = await readFile(path.join(dir, STICKY_REL), 'utf8')
      const sticky = parseHostToolsSticky(stickyRaw)
      assert.equal(sticky.version, 1)
      assert.ok(sticky.table_source, '须写入可选 table_source')
      assert.equal(sticky.table_source!.kind, 'file')
      if (sticky.table_source!.kind === 'file') {
        assert.equal(path.normalize(sticky.table_source.path), path.normalize(tableRel))
        assert.equal(sticky.table_source.sha256, sha256Hex(await readFile(tableAbs)))
      }

      const verify = await runCore(['host', 'verify', '--target', dir])
      assert.equal(verify.status, 0, verify.combined)
      assert.match(verify.combined, /HOST VERIFY:\s*PASS/)
    })
  })

  it('A2 对照锁：粘性表移走 → 默认 verify rc=2 · 点名路径 + 可操作提示 · 不静默内置', async () => {
    await withTemp(async (dir) => {
      const tableRel = 'legacy-hosts.yaml'
      const tableAbs = path.join(dir, tableRel)
      await copyFile(V1_FIXTURE, tableAbs)

      const apply = await runCore([
        'host',
        'apply',
        '--tools',
        'cursor,claude',
        '--profile',
        'core',
        '--file',
        tableAbs,
        '--target',
        dir,
        '--yes',
      ])
      assert.equal(apply.status, 0, apply.combined)

      await rm(tableAbs)

      const verify = await runCore(['host', 'verify', '--target', dir])
      assert.equal(verify.status, 2, verify.combined)
      assert.match(verify.combined, /legacy-hosts\.yaml|table_source|表源|适配表/)
      assert.match(verify.combined, /--file|host apply|重新/)
      // 不得静默走内置后出现 hooks 类假红（点名表源不可用即可）
      assert.ok(
        !/HOST VERIFY:\s*PASS/.test(verify.combined),
        '表不可用不得假绿',
      )
    })
  })

  it('A3 --file 最高优先：显式 --file 与粘性表源不一致时以 --file 为准', async () => {
    await withTemp(async (dir) => {
      const stickyTable = path.join(dir, 'sticky-table.yaml')
      const otherTable = path.join(dir, 'other-table.yaml')
      await copyFile(V1_FIXTURE, stickyTable)
      await copyFile(V1_FIXTURE, otherTable)

      const apply = await runCore([
        'host',
        'apply',
        '--tools',
        'cursor,claude',
        '--file',
        stickyTable,
        '--target',
        dir,
        '--yes',
      ])
      assert.equal(apply.status, 0, apply.combined)

      // 移走粘性表 → 默认 verify 会硬红；显式 --file 指向仍在的 other 须绿
      await rm(stickyTable)
      const withFile = await runCore([
        'host',
        'verify',
        '--file',
        otherTable,
        '--target',
        dir,
      ])
      assert.equal(withFile.status, 0, withFile.combined)

      const without = await runCore(['host', 'verify', '--target', dir])
      assert.equal(without.status, 2, without.combined)
    })
  })

  it('A4 builtin 零回归：内置 apply → 默认 verify PASS · table_source.kind=builtin', async () => {
    await withTemp(async (dir) => {
      const apply = await runCore([
        'host',
        'apply',
        '--tools',
        'cursor,claude',
        '--profile',
        'core',
        '--target',
        dir,
        '--yes',
      ])
      assert.equal(apply.status, 0, apply.combined)

      const sticky = parseHostToolsSticky(await readFile(path.join(dir, STICKY_REL), 'utf8'))
      assert.equal(sticky.version, 1)
      assert.deepEqual(sticky.table_source, { kind: 'builtin' })

      const verify = await runCore(['host', 'verify', '--target', dir])
      assert.equal(verify.status, 0, verify.combined)
      assert.match(verify.combined, /HOST VERIFY:\s*PASS/)
    })
  })

  it('A5 旧形态：无 table_source 的 3.0.0 粘性可读 · 默认 verify 走内置 · 不因缺字段报错', async () => {
    await withTemp(async (dir) => {
      const apply = await runCore([
        'host',
        'apply',
        '--tools',
        'cursor,claude',
        '--target',
        dir,
        '--yes',
      ])
      assert.equal(apply.status, 0, apply.combined)

      // 手工改回 3.0.0 形态（无 table_source）
      const stickyPath = path.join(dir, STICKY_REL)
      const body = JSON.parse(await readFile(stickyPath, 'utf8')) as Record<string, unknown>
      delete body.table_source
      await writeFile(stickyPath, `${JSON.stringify(body, null, 2)}\n`)

      const parsed = parseHostToolsSticky(await readFile(stickyPath, 'utf8'))
      assert.equal(parsed.table_source, undefined)
      assert.equal(parsed.version, 1)

      const verify = await runCore(['host', 'verify', '--target', dir])
      assert.equal(verify.status, 0, verify.combined)
    })
  })

  it('A6 双向兼容：含 table_source 的粘性经 3.0.0 读路径语义不报错', async () => {
    await withTemp(async (dir) => {
      const tableAbs = path.join(dir, 'legacy-hosts.yaml')
      await copyFile(V1_FIXTURE, tableAbs)
      const apply = await runCore([
        'host',
        'apply',
        '--tools',
        'cursor',
        '--file',
        tableAbs,
        '--target',
        dir,
        '--yes',
      ])
      assert.equal(apply.status, 0, apply.combined)
      const raw = await readFile(path.join(dir, STICKY_REL), 'utf8')
      assert.match(raw, /"table_source"/)
      // 等价留证：3.0.0 解析只认已知字段、不拒未知键（本机无旧 tarball 时的 task residual 兜底）
      const legacy = parseStickyLike300(raw)
      assert.equal(legacy.version, 1)
      assert.deepEqual(legacy.host_ids, ['cursor'])
      assert.equal('table_source' in legacy, false)
    })
  })

  it('A7 硬约束：version===1 · table_source 可选 · sha256 不符仅 WARN 不硬红', async () => {
    await withTemp(async (dir) => {
      const tableRel = 'legacy-hosts.yaml'
      const tableAbs = path.join(dir, tableRel)
      await copyFile(V1_FIXTURE, tableAbs)
      const apply = await runCore([
        'host',
        'apply',
        '--tools',
        'cursor,claude',
        '--file',
        tableAbs,
        '--target',
        dir,
        '--yes',
      ])
      assert.equal(apply.status, 0, apply.combined)

      const stickyPath = path.join(dir, STICKY_REL)
      const sticky = JSON.parse(await readFile(stickyPath, 'utf8')) as HostToolsSticky & {
        table_source?: { kind: string; path?: string; sha256?: string }
      }
      assert.equal(sticky.version, 1)
      assert.equal(sticky.table_source?.kind, 'file')

      // 改表内容使 sha256 漂移，但路径仍可用且 YAML 仍合法
      await writeFile(tableAbs, `${await readFile(tableAbs, 'utf8')}\n# drift\n`)
      const verify = await runCore(['host', 'verify', '--target', dir])
      assert.equal(verify.status, 0, verify.combined)
      assert.match(verify.combined, /WARN|sha256|哈希|不符/i)
      assert.match(verify.combined, /HOST VERIFY:\s*PASS/)
    })
  })

  it('update --yes 亦写入 table_source（与 apply 同源）', async () => {
    await withTemp(async (dir) => {
      const tableAbs = path.join(dir, 'legacy-hosts.yaml')
      await copyFile(V1_FIXTURE, tableAbs)
      const apply = await runCore([
        'host',
        'apply',
        '--tools',
        'cursor',
        '--file',
        tableAbs,
        '--target',
        dir,
        '--yes',
      ])
      assert.equal(apply.status, 0, apply.combined)

      const upd = await runCore([
        'host',
        'update',
        '--tools',
        'cursor,claude',
        '--file',
        tableAbs,
        '--target',
        dir,
        '--yes',
      ])
      assert.equal(upd.status, 0, upd.combined)
      const sticky = parseHostToolsSticky(await readFile(path.join(dir, STICKY_REL), 'utf8'))
      assert.equal(sticky.table_source?.kind, 'file')
      assert.deepEqual(sticky.host_ids, ['cursor', 'claude'])
    })
  })
})
