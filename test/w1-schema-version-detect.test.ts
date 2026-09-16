import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, it } from 'node:test'
import { fileURLToPath } from 'node:url'
import {
  BUILTIN_CORE_COMMANDS,
  BUILTIN_EXPANDED_COMMANDS,
  BUILTIN_FORBIDDEN_COMMANDS,
  builtinCommandSets,
  resolveV1CompatModel,
  V1_DEFAULT_HOOKS,
} from '../src/host/resolve.ts'
import {
  probeHostAdaptSchemaVersion,
  validateHostAdaptDoc,
  validateHostAdaptDocDispatch,
} from '../src/host/schema.ts'
import { yamlLoad } from '../src/yaml.ts'

const KIT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const CLI_TS = path.join(KIT, 'src', 'cli.ts')
const SV_DIR = path.join(KIT, 'test', 'fixtures', 'host-adapt', 'schema-version')
const COMPAT_FIXTURE = path.join(KIT, 'test', 'fixtures', 'host-adapt', 'mvp-hosts_2_4_2.yaml')
const LIVE_EXAMPLE = path.join(KIT, 'assets', 'ide', 'host-adapt', 'examples', 'mvp-hosts.yaml')

function runCli(args: string[]): { status: number | null; combined: string } {
  const env = { ...process.env }
  delete env.DSH_CK_DSH_TOOLS_VERSION
  const r = spawnSync(process.execPath, ['--experimental-strip-types', CLI_TS, ...args], {
    encoding: 'utf8',
    cwd: KIT,
    env,
  })
  return { status: r.status, combined: `${r.stdout ?? ''}\n${r.stderr ?? ''}` }
}

function loadFixtureDoc(rel: string): unknown {
  return yamlLoad(readFileSync(path.join(KIT, rel), 'utf8'))
}

describe('3.0 W1 阶段一 · schema_version 探测树（S2.1 · 评审文 §3.1 · F-W1-03）', { concurrency: 1 }, () => {
  it('无 schema_version 键 → v1 路径：合法表零 issue · 非法表与 validateHostAdaptDoc 逐字一致（语义原样）', () => {
    const valid = { version: '1', hosts: [{ host_id: 'cursor', surfaces: { always_on: [], skills: [], commands: [] } }] }
    assert.equal(probeHostAdaptSchemaVersion(valid).kind, 'v1')
    assert.deepEqual(validateHostAdaptDocDispatch(valid), [])
    const invalid = { version: '1', bogus: true, hosts: [{ host_id: 'cursor', surfaces: {} }] }
    const legacy = validateHostAdaptDoc(invalid)
    assert.ok(legacy.length > 0)
    assert.deepEqual(validateHostAdaptDocDispatch(invalid), legacy) // v1 校验语义逐字不变
    assert.equal(probeHostAdaptSchemaVersion('not-an-object').kind, 'v1') // 根非对象仍走 v1 报「根须为对象」
  })

  it('整数 2 → v2 解析路径（阶段二填实）：合法 v2 零 issue · 非法（extends 未知目标）点名报红', () => {
    const valid = {
      version: '1',
      schema_version: 2,
      command_sets: { core: ['verify'], expanded: ['graph-check'] },
      hosts: [{ host_id: 'cursor', surfaces: { always_on: [], skills: [], commands: [] } }],
    }
    assert.equal(probeHostAdaptSchemaVersion(valid).kind, 'v2')
    assert.deepEqual(validateHostAdaptDocDispatch(valid), [])
    const invalid = {
      version: '1',
      schema_version: 2,
      command_sets: { core: ['verify'], expanded: ['graph-check'] },
      hosts: [{ host_id: 'a', extends: 'ghost' }],
    }
    const issues = validateHostAdaptDocDispatch(invalid)
    assert.equal(issues.length, 1)
    assert.equal(issues[0]!.path, '$.hosts[0].extends')
    assert.match(issues[0]!.message, /未知目标/)
    assert.match(issues[0]!.message, /ghost/)
  })

  it('整数 >2（3）→ fail-closed「未知 schema_version」点名 · 整数 1 同口径（保守 · 不得静默按旧格式解析）', () => {
    for (const v of [3, 99, 1, 0, -2]) {
      const probe = probeHostAdaptSchemaVersion({ version: '1', schema_version: v, hosts: [] })
      assert.equal(probe.kind, 'invalid')
      if (probe.kind !== 'invalid') continue
      assert.equal(probe.issues.length, 1)
      assert.equal(probe.issues[0]!.code, 'schema')
      assert.match(probe.issues[0]!.message, /未知 schema_version/)
      assert.match(probe.issues[0]!.message, new RegExp(String(v).replace('-', '\\-')))
    }
  })

  it('非整数（串 "2" / 浮点 2.5 / null / boolean）→ schema 校验报红「须为整数」', () => {
    for (const v of ['2', 2.5, null, true]) {
      const probe = probeHostAdaptSchemaVersion({ version: '1', schema_version: v, hosts: [] })
      assert.equal(probe.kind, 'invalid')
      if (probe.kind !== 'invalid') continue
      assert.match(probe.issues[0]!.message, /须为整数/)
    }
  })

  it('F-W1-03 fixture：schema_version: 3 → host validate exit 2 点名「未知 schema_version: 3」', () => {
    const r = runCli(['host', 'validate', '--file', path.join(SV_DIR, 'schema_version_3.yaml')])
    assert.equal(r.status, 2, r.combined)
    assert.match(r.combined, /未知 schema_version: 3/)
  })

  it('F-W1-03 fixture：schema_version: "2"（串）→ host validate exit 2 报「须为整数」', () => {
    const r = runCli(['host', 'validate', '--file', path.join(SV_DIR, 'schema_version_string.yaml')])
    assert.equal(r.status, 2, r.combined)
    assert.match(r.combined, /须为整数/)
  })

  it('探测树 fixture：schema_version: 2 → host validate exit 0（v2 路径已填实 · 合法文档通过 · 阶段一入口桩语义转正登记）', () => {
    const r = runCli(['host', 'validate', '--file', path.join(SV_DIR, 'schema_version_2_valid.yaml')])
    assert.equal(r.status, 0, r.combined)
    assert.match(r.combined, /HOST VALIDATE:\s*PASS/i)
  })

  it('现行包内表仍为 v1（无 schema_version 键）· 探测分派零 issue（表内容本阶段不动）', () => {
    const doc = loadFixtureDoc('assets/ide/host-adapt/examples/mvp-hosts.yaml')
    assert.equal(probeHostAdaptSchemaVersion(doc).kind, 'v1')
    assert.deepEqual(validateHostAdaptDocDispatch(doc), [])
    assert.ok(LIVE_EXAMPLE.endsWith('mvp-hosts.yaml'))
  })
})

describe('3.0 W1 阶段一 · OQ-6 内建 command_sets 目录逐字锁（验收 #11 · F-W1-08）', { concurrency: 1 }, () => {
  it('内建目录 = 现 5+7 项逐字值 + forbidden 两项（commands.ts:17-19 注释纪律机检化）', () => {
    assert.deepEqual(builtinCommandSets(), {
      core: ['verify', 'gate-status', 'init-guide', 'apply-standards', 'hat-reanchor'],
      expanded: [
        'hat-00-delegate',
        'hat-10-spec',
        'hat-10-task',
        'hat-20-spec-audit',
        'hat-20-task-audit',
        'graph-check',
        'sync-prompts-guide',
      ],
      forbidden: ['kit-30', 'kit-publish'],
    })
  })

  it('内建目录为唯一真值锚（commands.ts 常量已删除 · OQ-6 单锚 · F-W1-08）：导出字面量 = 逐字值', () => {
    assert.deepEqual([...BUILTIN_CORE_COMMANDS], ['verify', 'gate-status', 'init-guide', 'apply-standards', 'hat-reanchor'])
    assert.deepEqual([...BUILTIN_EXPANDED_COMMANDS], [
      'hat-00-delegate',
      'hat-10-spec',
      'hat-10-task',
      'hat-20-spec-audit',
      'hat-20-task-audit',
      'graph-check',
      'sync-prompts-guide',
    ])
    assert.deepEqual([...BUILTIN_FORBIDDEN_COMMANDS], ['kit-30', 'kit-publish'])
    assert.deepEqual(builtinCommandSets(), {
      core: [...BUILTIN_CORE_COMMANDS],
      expanded: [...BUILTIN_EXPANDED_COMMANDS],
      forbidden: [...BUILTIN_FORBIDDEN_COMMANDS],
    })
  })
})

describe('3.0 W1 阶段一 · v1 兼容桥 resolved 模型（S2.5 · 评审文 §3.2 六行恒等映射）', { concurrency: 1 }, () => {
  it('v1 表注入内建 command_sets + hooks 缺省 {mechanism:none} · version/host_ids 恒等 · 入参不 mutate', () => {
    const doc = loadFixtureDoc('test/fixtures/host-adapt/mvp-hosts_2_4_2.yaml') as {
      version: string
      hosts: { host_id: string; surfaces: Record<string, unknown> }[]
    }
    const model = resolveV1CompatModel(doc)
    assert.equal(model.schemaVersion, 1)
    assert.equal(model.version, doc.version) // version 串原样保留（评审文 §3.2 行①）
    assert.deepEqual(model.commandSets, builtinCommandSets()) // 行⑤：注入内建目录
    assert.equal(model.rows.length, doc.hosts.length)
    assert.deepEqual(
      model.rows.map((r) => r.host_id),
      doc.hosts.map((r) => r.host_id),
    ) // 行②：resolved rows = 原行恒等展开（host_id 序不变）
    for (const row of model.rows) {
      assert.deepEqual(row.surfaces.hooks, { mechanism: 'none' }) // 行④：未声明缺省
      assert.deepEqual(V1_DEFAULT_HOOKS, { mechanism: 'none' })
    }
    for (const row of doc.hosts) {
      assert.ok(!('hooks' in row.surfaces)) // 不 mutate 入参（v1 表面行为逐字不变）
    }
  })
})
