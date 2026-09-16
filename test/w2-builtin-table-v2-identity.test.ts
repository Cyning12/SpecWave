import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { describe, it } from 'node:test'
import { fileURLToPath } from 'node:url'
import { planApply } from '../src/host/materialize.ts'
import { builtinCommandSets, V1_DEFAULT_HOOKS } from '../src/host/resolve.ts'
import { probeHostAdaptSchemaVersion, validateHostAdaptDocDispatch } from '../src/host/schema.ts'
import { commandSetsOf, resolvedHostRows, type HostRow } from '../src/host/table.ts'
import { yamlLoad } from '../src/yaml.ts'

const KIT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const LIVE_TABLE = path.join(KIT, 'assets', 'ide', 'host-adapt', 'examples', 'mvp-hosts.yaml')
const PRE_V2_FIXTURE = path.join(KIT, 'test', 'fixtures', 'host-adapt', 'mvp-hosts_pre-v2_v1.yaml')

/**
 * 3.0 W2 阶段一 · 内置表 v2 化恒等锁（验收 #8 · S3.2 · F-W2-12/F-W2-13）。
 * fixture = v2 化前内置表逐字拷贝（2026-09-16 本棒实拷 · 与 2.4.2 compat fixture 同源同 sha）；
 * live = v2 化后内置表。锁：resolved rows ≡（host_id 序 + surfaces 全键 + verify 值 +
 * command_sets 解析 + hooks 缺省等价）· planned writes 逐字一致（hooks 仅声明不物化 ⇒ 零漂移）。
 * hooks 键有意差异逐点登记：claude/cursor/gemini = config-hook 声明（S3.1 定稿）·
 * 其余 10 宿主 = 显式 none ≡ v1 未声明缺省注入（V1_DEFAULT_HOOKS）。
 */
const PRE_V2_SHA256 = 'b80f9a15e7da9051689b957daf737b4799f4a2392d6a9130dcaee770f2203894'

/** S3.1 机制族定稿：config-hook 三宿主（其余 10 宿主显式 none 降级锚点） */
const CONFIG_HOOK_HOSTS = ['claude', 'cursor', 'gemini'] as const
const NONE_HOSTS = [
  'dsh',
  'agents',
  'copilot',
  'codex',
  'windsurf',
  'opencode',
  'roo',
  'zed',
  'cline',
  'aider',
] as const
const EXPECTED_HOST_ORDER = [
  'dsh',
  'cursor',
  'claude',
  'agents',
  'copilot',
  'codex',
  'windsurf',
  'gemini',
  'opencode',
  'roo',
  'zed',
  'cline',
  'aider',
] as const
const EXPECTED_CONFIG_HOOK = {
  mechanism: 'config-hook',
  triggers: ['pre-commit', 'pre-archive'],
  command: 'npx spec-wave verify --target .',
} as const

function loadDoc(abs: string): unknown {
  return yamlLoad(readFileSync(abs, 'utf8'))
}

/** v1 resolved 行补 hooks 缺省注入（v1=未声明注入 none · 评审文 §3.2 行④ · 与 v2 显式 none 等价口径） */
function v1RowsWithDefaultHooks(doc: unknown): HostRow[] {
  return resolvedHostRows(doc).map((row) => ({
    ...row,
    surfaces: { ...row.surfaces, hooks: { ...V1_DEFAULT_HOOKS } },
  }))
}

type PlannedDigest = { hostId: string; kind: string; destRel: string; sourceRel: string; op: string; sha256: string }

function plannedDigest(
  rows: HostRow[],
  profile: string,
  commandSets: ReturnType<typeof builtinCommandSets>,
): { items: PlannedDigest[]; s2: string[] } {
  const target = mkdtempSync(path.join(os.tmpdir(), 'w2-identity-lock-'))
  try {
    const { items, s2 } = planApply({
      target,
      rows,
      toolIds: rows.map((r) => r.host_id),
      profile,
      pkgRoot: KIT,
      commandSets,
    })
    return {
      // 3.0 W2 阶段二（hooks 物化落地）处置登记（00 放行裁定）：恒等锁保持「声明面恒等」语义 ——
      // 比对剔除 kind='hook' 物化条目（v1 无 hooks 声明 vs v2 有声明的物化面差异为规格内新增），
      // 物化面差异由本文件「hooks 物化面差异登记」测试独立钉死（三宿主增 hooks 落点 · 十宿主不变）。
      items: items
        .filter((i) => i.kind !== 'hook')
        .map((i) => ({
          hostId: i.hostId,
          kind: i.kind,
          destRel: i.destRel,
          sourceRel: i.sourceRel,
          op: i.op,
          sha256: createHash('sha256').update(i.nextText).digest('hex'),
        })),
      s2,
    }
  } finally {
    rmSync(target, { recursive: true, force: true })
  }
}

describe('3.0 W2 阶段一 · 内置表 v2 化恒等锁（验收 #8 · S3.2 · F-W2-12）', { concurrency: 1 }, () => {
  it('fixture 内容锁：pre-v2 逐字拷贝 sha256 钉死（防 fixture 漂移）', () => {
    const sha = createHash('sha256').update(readFileSync(PRE_V2_FIXTURE)).digest('hex')
    assert.equal(sha, PRE_V2_SHA256)
  })

  it('探测分派：fixture = v1（无 schema_version 键）· live = v2（schema_version: 2）· 两表校验零 issue', () => {
    const fixtureDoc = loadDoc(PRE_V2_FIXTURE) as Record<string, unknown>
    const liveDoc = loadDoc(LIVE_TABLE) as Record<string, unknown>
    assert.ok(!('schema_version' in fixtureDoc))
    assert.equal(probeHostAdaptSchemaVersion(fixtureDoc).kind, 'v1')
    assert.equal(liveDoc.schema_version, 2)
    assert.equal(probeHostAdaptSchemaVersion(liveDoc).kind, 'v2')
    assert.deepEqual(validateHostAdaptDocDispatch(fixtureDoc), [])
    assert.deepEqual(validateHostAdaptDocDispatch(liveDoc), [])
  })

  it('resolved rows 恒等：host_id 序逐字一致 + 每行 always_on/skills/commands/verify 逐字 deepEqual', () => {
    const v1Rows = v1RowsWithDefaultHooks(loadDoc(PRE_V2_FIXTURE))
    const v2Rows = resolvedHostRows(loadDoc(LIVE_TABLE))
    assert.deepEqual(
      v2Rows.map((r) => r.host_id),
      [...EXPECTED_HOST_ORDER],
    )
    assert.deepEqual(
      v1Rows.map((r) => r.host_id),
      v2Rows.map((r) => r.host_id),
    )
    assert.equal(v1Rows.length, 13)
    for (let i = 0; i < v1Rows.length; i += 1) {
      const a = v1Rows[i]!
      const b = v2Rows[i]!
      assert.deepEqual(b.surfaces.always_on, a.surfaces.always_on, `${b.host_id} always_on 漂移`)
      assert.deepEqual(b.surfaces.skills, a.surfaces.skills, `${b.host_id} skills 漂移`)
      assert.deepEqual(b.surfaces.commands, a.surfaces.commands, `${b.host_id} commands 漂移`)
      assert.deepEqual(b.surfaces.verify, a.surfaces.verify, `${b.host_id} verify 漂移`)
      assert.deepEqual(b.surfaces.verify, { kind: 'cli', bin: 'spec-wave', failClosed: true })
    }
  })

  it('hooks 逐点登记：10 宿主显式 none ≡ v1 缺省注入 · 3 宿主 config-hook 声明 = S3.1 定稿逐字（有意新增）', () => {
    const v1Rows = v1RowsWithDefaultHooks(loadDoc(PRE_V2_FIXTURE))
    const v2Rows = resolvedHostRows(loadDoc(LIVE_TABLE))
    const v1ById = new Map(v1Rows.map((r) => [r.host_id, r]))
    for (const row of v2Rows) {
      const hooks = row.surfaces.hooks as Record<string, unknown>
      if ((NONE_HOSTS as readonly string[]).includes(row.host_id)) {
        // 显式降级锚点：v2 显式 {mechanism:none} ≡ v1 未声明缺省注入（F-W1-10 · 禁带 triggers/command）
        assert.deepEqual(hooks, { mechanism: 'none' }, `${row.host_id} 显式 none 漂移`)
        assert.deepEqual(v1ById.get(row.host_id)!.surfaces.hooks, { mechanism: 'none' })
      } else {
        // 有意差异登记（验收 #8）：config-hook 三宿主 = S3.1 定稿声明 · v1 侧为缺省 none
        assert.ok((CONFIG_HOOK_HOSTS as readonly string[]).includes(row.host_id), `未登记宿主: ${row.host_id}`)
        assert.deepEqual(hooks, EXPECTED_CONFIG_HOOK, `${row.host_id} config-hook 声明漂移`)
        assert.deepEqual(v1ById.get(row.host_id)!.surfaces.hooks, { mechanism: 'none' })
      }
    }
  })

  it('command_sets 解析恒等：v2 表声明值 ≡ 内建目录逐字 ≡ v1 兼容桥注入值', () => {
    const liveSets = commandSetsOf(loadDoc(LIVE_TABLE))
    const fixtureSets = commandSetsOf(loadDoc(PRE_V2_FIXTURE))
    assert.deepEqual(liveSets, builtinCommandSets())
    assert.deepEqual(liveSets, fixtureSets)
  })

  it('planned writes 恒等（声明面）：core + expanded 全 13 宿主非 hook 落点逐字 deepEqual', () => {
    const v1Rows = resolvedHostRows(loadDoc(PRE_V2_FIXTURE))
    const v2Rows = resolvedHostRows(loadDoc(LIVE_TABLE))
    for (const profile of ['core', 'expanded'] as const) {
      const fromV1 = plannedDigest(v1Rows, profile, builtinCommandSets())
      const fromV2 = plannedDigest(v2Rows, profile, commandSetsOf(loadDoc(LIVE_TABLE)))
      assert.deepEqual(fromV2, fromV1, `profile=${profile} planned writes 漂移（物化面被误触）`)
      assert.ok(fromV2.items.length > 0)
    }
  })

  it('hooks 物化面差异登记（阶段二新增断言）：v2 三宿主各增 1 个 hook 落点 · 十宿主零 hook 落点 · v1 全表零 hook 落点', () => {
    const v1Rows = resolvedHostRows(loadDoc(PRE_V2_FIXTURE))
    const v2Rows = resolvedHostRows(loadDoc(LIVE_TABLE))
    const hookItemsOf = (rows: ReturnType<typeof resolvedHostRows>, profile: string) => {
      const target = mkdtempSync(path.join(os.tmpdir(), 'w2-identity-hook-delta-'))
      try {
        const { items } = planApply({
          target,
          rows,
          toolIds: rows.map((r) => r.host_id),
          profile,
          pkgRoot: KIT,
          commandSets: commandSetsOf(loadDoc(LIVE_TABLE)),
        })
        return items.filter((i) => i.kind === 'hook')
      } finally {
        rmSync(target, { recursive: true, force: true })
      }
    }
    for (const profile of ['core', 'expanded'] as const) {
      assert.deepEqual(hookItemsOf(v1Rows, profile), [], `profile=${profile} v1 不得有 hook 落点`)
      const v2Hooks = hookItemsOf(v2Rows, profile)
      assert.deepEqual(
        v2Hooks.map((i) => ({ hostId: i.hostId, destRel: i.destRel, op: i.op })),
        [
          { hostId: 'cursor', destRel: '.cursor/hooks.json', op: 'write' },
          { hostId: 'claude', destRel: '.claude/settings.json', op: 'write' },
          { hostId: 'gemini', destRel: '.gemini/settings.json', op: 'write' },
        ],
        `profile=${profile} hooks 物化面差异须恰为三宿主落点`,
      )
      // hook 落点 host 集 ⊆ config-hook 三宿主（十 none 宿主零落点）
      const hookHosts = new Set(v2Hooks.map((i) => i.hostId))
      for (const id of NONE_HOSTS) assert.ok(!hookHosts.has(id), `${id} 不得有 hook 落点`)
    }
  })
})
