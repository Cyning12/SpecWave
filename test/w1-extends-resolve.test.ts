import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { describe, it } from 'node:test'
import { fileURLToPath } from 'node:url'
import { planApply } from '../src/host/materialize.ts'
import { MAX_EXTENDS_DEPTH, mergeSurfaces, resolveV2Model } from '../src/host/resolve.ts'
import { validateHostAdaptDocDispatch, validateHostAdaptDocV2 } from '../src/host/schema.ts'
import { resolvedHostRows } from '../src/host/table.ts'
import { yamlLoad } from '../src/yaml.ts'

const KIT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const CLI_TS = path.join(KIT, 'src', 'cli.ts')
const EX_DIR = path.join(KIT, 'test', 'fixtures', 'host-adapt', 'extends')

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

function docOf(name: string): unknown {
  return yamlLoad(readFileSync(path.join(EX_DIR, name), 'utf8'))
}

function resolvedRowsOf(name: string) {
  const r = resolveV2Model(docOf(name))
  assert.ok(r.ok, `${name} 应解析成功`)
  return r.model.rows
}

function rowOf(rows: ReturnType<typeof resolvedRowsOf>, id: string) {
  const row = rows.find((r) => r.host_id === id)
  assert.ok(row, `缺 resolved 行 ${id}`)
  return row
}

function assertGreen(name: string): void {
  const r = runCli(['host', 'validate', '--file', path.join(EX_DIR, name)])
  assert.equal(r.status, 0, `${name}: ${r.combined}`)
  assert.match(r.combined, /HOST VALIDATE:\s*PASS/i)
}

function assertRed(name: string, ...patterns: RegExp[]): void {
  const r = runCli(['host', 'validate', '--file', path.join(EX_DIR, name)])
  assert.equal(r.status, 2, `${name}: ${r.combined}`)
  for (const re of patterns) assert.match(r.combined, re, `${name} 缺 ${re}`)
}

describe('3.0 W1 阶段二 · OQ-2 九条目 fixture（S2.4 合并语义 · 验收 #2）', { concurrency: 1 }, () => {
  it('① 标量覆盖：子 verify.bin 覆盖父 · kind/failClosed 继承（绿）', () => {
    assertGreen('01_scalar_override.yaml')
    const rows = resolvedRowsOf('01_scalar_override.yaml')
    assert.deepEqual(rowOf(rows, 'child').surfaces.verify, { kind: 'cli', bin: 'child-bin', failClosed: true })
    assert.equal(rowOf(rows, 'base').surfaces.verify?.bin, 'spec-wave') // 父不被子污染
  })

  it('② 对象逐键深合并：子只写 failClosed · 继承父 kind/bin（绿）', () => {
    assertGreen('02_object_deep_merge.yaml')
    const rows = resolvedRowsOf('02_object_deep_merge.yaml')
    assert.deepEqual(rowOf(rows, 'child').surfaces.verify, { kind: 'cli', bin: 'spec-wave', failClosed: false })
  })

  it('③ 数组整体替换：子声明 skills 即以子数组为准（OQ-2 replace · 不逐元素合并）（绿）', () => {
    assertGreen('03_array_replace.yaml')
    const rows = resolvedRowsOf('03_array_replace.yaml')
    assert.deepEqual(rowOf(rows, 'child').surfaces.skills, [
      { target_dir: '.child/skills', from: 'assets/skills/*' },
    ])
  })

  it('④ 数组未声明则继承：子只写 always_on · skills/commands 继承父（绿）', () => {
    assertGreen('04_array_inherit.yaml')
    const rows = resolvedRowsOf('04_array_inherit.yaml')
    const child = rowOf(rows, 'child')
    assert.deepEqual(child.surfaces.always_on, [])
    assert.deepEqual(child.surfaces.skills, [{ target_dir: '.agents/skills', from: 'assets/skills/*' }])
    assert.deepEqual(child.surfaces.commands, [])
  })

  it('⑤ 循环继承拒绝并报循环链 a→b→a（红）', () => {
    assertRed('05_cycle_reject.yaml', /循环继承/, /a → b → a/)
  })

  it('⑥ 自继承拒绝 a→a（红 · 循环特例）', () => {
    assertRed('06_self_extends_reject.yaml', /循环继承/, /a → a/)
  })

  it('⑦ 未知 extend 目标拒绝并点名 ghost（红）', () => {
    assertRed('07_unknown_target_reject.yaml', /未知目标/, /ghost/)
  })

  it('⑧ 链深边界双条：8 跳合法（绿）· 9 跳报红「9 > 8」', () => {
    assert.equal(MAX_EXTENDS_DEPTH, 8) // 上限裁定值钉死
    assertGreen('08a_depth8_ok.yaml')
    const rows = resolvedRowsOf('08a_depth8_ok.yaml')
    assert.equal(rows.length, 8)
    assert.deepEqual(rowOf(rows, 'h1').surfaces.always_on, []) // 经 8 跳继承 defaults 面
    assertRed('08b_depth9_reject.yaml', /链深超限/, /9 > 8/)
  })

  it('⑨ extends: defaults 合法（绿）· defaults 自身 extends 报红', () => {
    assertGreen('09a_extends_defaults_ok.yaml')
    const rows = resolvedRowsOf('09a_extends_defaults_ok.yaml')
    assert.equal(rows.length, 1) // defaults 伪节点不泄漏为行
    const child = rowOf(rows, 'child')
    assert.deepEqual(child.surfaces.skills, [{ target_dir: '.agents/skills', from: 'assets/skills/*' }])
    assert.deepEqual(child.surfaces.verify, { kind: 'cli', bin: 'spec-wave', failClosed: true })
    assertRed('09b_defaults_extends_reject.yaml', /defaults 自身不得 extends/)
  })
})

describe('3.0 W1 阶段二 · resolved rows 一次性展开 · 下游零感知（F-W1-11）', { concurrency: 1 }, () => {
  it('resolved 行零残留：无 extends/defaults 键 · 行序 = 声明序 · hooks 缺省注入', () => {
    for (const name of ['01_scalar_override.yaml', '09a_extends_defaults_ok.yaml']) {
      const rows = resolvedRowsOf(name)
      for (const row of rows) {
        assert.ok(!('extends' in row), `${name} 残留 extends`)
        assert.ok(!('defaults' in row), `${name} 残留 defaults`)
        assert.deepEqual(row.surfaces.hooks, { mechanism: 'none' })
      }
    }
    const rows = resolvedRowsOf('01_scalar_override.yaml')
    assert.deepEqual(rows.map((r) => r.host_id), ['base', 'child']) // 行序 = 表声明序
  })

  it('下游等价证明：extends 展开行 vs 逐字全量行 → planApply planned items 逐字一致（materialize 零感知）', () => {
    const viaExtends = resolvedHostRows(docOf('09a_extends_defaults_ok.yaml'))
    const literal = resolvedHostRows({
      version: '1',
      schema_version: 2,
      hosts: [
        {
          host_id: 'child',
          surfaces: {
            always_on: [],
            skills: [{ target_dir: '.agents/skills', from: 'assets/skills/*' }],
            commands: [],
            verify: { kind: 'cli', bin: 'spec-wave', failClosed: true },
          },
        },
      ],
    })
    const fingerprint = (rows: typeof viaExtends) => {
      const target = mkdtempSync(path.join(os.tmpdir(), 'w1-extends-equiv-'))
      try {
        const { items, s2 } = planApply({ target, rows, toolIds: ['child'], profile: 'core', pkgRoot: KIT })
        assert.deepEqual(s2, [])
        return items.map((i) => ({
          hostId: i.hostId,
          kind: i.kind,
          destRel: i.destRel,
          sourceRel: i.sourceRel,
          op: i.op,
          sha256: createHash('sha256').update(i.nextText).digest('hex'),
        }))
      } finally {
        rmSync(target, { recursive: true, force: true })
      }
    }
    const a = fingerprint(viaExtends)
    assert.ok(a.length > 0)
    assert.deepEqual(a, fingerprint(literal))
  })
})

describe('3.0 W1 阶段二 · verify 承接（S2.3）与 resolved 完备性', { concurrency: 1 }, () => {
  it('verify 可入 defaults 深合并消重复（09a 绿）· resolved verify 不完整报红（缺 bin）', () => {
    const bad = {
      version: '1',
      schema_version: 2,
      defaults: { surfaces: { verify: { kind: 'cli' } } } // 缺 bin · partial 级合法
      ,hosts: [{ host_id: 'a', extends: 'defaults', surfaces: { always_on: [], skills: [], commands: [] } }],
    }
    const issues = validateHostAdaptDocV2(bad)
    assert.ok(issues.some((e) => e.path === '$.hosts[0].surfaces.verify.bin'), JSON.stringify(issues))
  })

  it('无 extends 的行 verify 只写 failClosed → resolved 完备性报红（kind 非 cli/缺 · bin 缺）', () => {
    const bad = {
      version: '1',
      schema_version: 2,
      hosts: [{ host_id: 'a', surfaces: { always_on: [], skills: [], commands: [], verify: { failClosed: true } } }],
    }
    const issues = validateHostAdaptDocV2(bad)
    assert.ok(issues.some((e) => e.path === '$.hosts[0].surfaces.verify.kind'), JSON.stringify(issues))
    assert.ok(issues.some((e) => e.path === '$.hosts[0].surfaces.verify.bin'), JSON.stringify(issues))
  })

  it('无 extends 的行缺 commands → resolved 完备性报红「必填（defaults/extends 展开后仍缺失）」', () => {
    const bad = {
      version: '1',
      schema_version: 2,
      hosts: [{ host_id: 'a', surfaces: { always_on: [], skills: [] } }],
    }
    const issues = validateHostAdaptDocV2(bad)
    assert.ok(
      issues.some((e) => e.path === '$.hosts[0].surfaces.commands' && /必填/.test(e.message)),
      JSON.stringify(issues),
    )
  })

  it('v2 host_id 重复拒（extends 目标歧义 fail-closed · v2 only 登记项）', () => {
    const bad = {
      version: '1',
      schema_version: 2,
      hosts: [
        { host_id: 'a', surfaces: { always_on: [], skills: [], commands: [] } },
        { host_id: 'a', surfaces: { always_on: [], skills: [], commands: [] } },
      ],
    }
    const issues = validateHostAdaptDocV2(bad)
    assert.ok(issues.some((e) => /host_id 重复/.test(e.message)), JSON.stringify(issues))
  })

  it('v1 行为不变：v1 表行级 extends 键 / 根 defaults 键仍按 未知字段 报红（v1 白名单原样）', () => {
    const v1Row = {
      version: '1',
      hosts: [{ host_id: 'a', extends: 'b', surfaces: { always_on: [], skills: [], commands: [] } }],
    }
    const v1Root = { version: '1', defaults: {}, hosts: [{ host_id: 'a', surfaces: { always_on: [], skills: [], commands: [] } }] }
    assert.ok(validateHostAdaptDocDispatch(v1Row).some((e) => /未知字段/.test(e.message) && /extends/.test(e.message)))
    assert.ok(validateHostAdaptDocDispatch(v1Root).some((e) => /未知字段/.test(e.message) && /defaults/.test(e.message)))
  })

  it('mergeSurfaces 不 mutate 入参（合并语义纯函数面）', () => {
    const parent = { verify: { kind: 'cli', bin: 'a' }, skills: [1] }
    const child = { verify: { failClosed: true } }
    const merged = mergeSurfaces(parent, child)
    assert.deepEqual(merged, { verify: { kind: 'cli', bin: 'a', failClosed: true }, skills: [1] })
    assert.deepEqual(parent, { verify: { kind: 'cli', bin: 'a' }, skills: [1] })
    assert.deepEqual(child, { verify: { failClosed: true } })
  })
})
