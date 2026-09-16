import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { describe, it } from 'node:test'
import { fileURLToPath } from 'node:url'
import { planApply } from '../src/host/materialize.ts'
import { builtinCommandSets, resolveV2Model } from '../src/host/resolve.ts'
import { asHostRows, commandSetsOf, resolvedHostRows, type HostRow } from '../src/host/table.ts'
import { yamlLoad } from '../src/yaml.ts'

const KIT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const CLI_TS = path.join(KIT, 'src', 'cli.ts')
const HOOKS_DIR = path.join(KIT, 'test', 'fixtures', 'host-adapt', 'hooks')
const CS_DIR = path.join(KIT, 'test', 'fixtures', 'host-adapt', 'command-sets')
const V1_FIXTURE = path.join(KIT, 'test', 'fixtures', 'host-adapt', 'mvp-hosts_2_4_2.yaml')

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

function docAt(dir: string, name: string): unknown {
  return yamlLoad(readFileSync(path.join(dir, name), 'utf8'))
}

function assertGreen(dir: string, name: string): void {
  const r = runCli(['host', 'validate', '--file', path.join(dir, name)])
  assert.equal(r.status, 0, `${name}: ${r.combined}`)
  assert.match(r.combined, /HOST VALIDATE:\s*PASS/i)
}

function assertRed(dir: string, name: string, ...patterns: RegExp[]): void {
  const r = runCli(['host', 'validate', '--file', path.join(dir, name)])
  assert.equal(r.status, 2, `${name}: ${r.combined}`)
  for (const re of patterns) assert.match(r.combined, re, `${name} 缺 ${re}`)
}

function v2HooksOf(dir: string, name: string, hostId: string) {
  const r = resolveV2Model(docAt(dir, name))
  assert.ok(r.ok, `${name} 应解析成功`)
  const row = r.model.rows.find((x) => x.host_id === hostId)
  assert.ok(row)
  return row.surfaces.hooks
}

function fingerprint(rows: HostRow[], profile: string, commandSets: ReturnType<typeof builtinCommandSets>) {
  const target = mkdtempSync(path.join(os.tmpdir(), 'w1-cs-e2e-'))
  try {
    const { items, s2 } = planApply({ target, rows, toolIds: ['cursor'], profile, pkgRoot: KIT, commandSets })
    assert.deepEqual(s2, [])
    return items.map((i) => ({
      kind: i.kind,
      destRel: i.destRel,
      op: i.op,
      sha256: createHash('sha256').update(i.nextText).digest('hex'),
    }))
  } finally {
    rmSync(target, { recursive: true, force: true })
  }
}

describe('3.0 W1 阶段三 · hooks 节红绿（验收 #3 · S2.2 · OQ-1 enum · F-W1-10）', { concurrency: 1 }, () => {
  it('绿 ×4：shell-hook / config-hook / none 显式 / defaults 深合并 → host validate exit 0', () => {
    assertGreen(HOOKS_DIR, 'green_shell_hook.yaml')
    assertGreen(HOOKS_DIR, 'green_config_hook.yaml')
    assertGreen(HOOKS_DIR, 'green_none_explicit.yaml')
    assertGreen(HOOKS_DIR, 'green_deep_merge.yaml')
  })

  it('resolved hooks 值断言：全声明保留 · none 显式保留 · defaults 深合并补全', () => {
    assert.deepEqual(v2HooksOf(HOOKS_DIR, 'green_shell_hook.yaml', 'a'), {
      mechanism: 'shell-hook',
      triggers: ['pre-commit', 'pre-archive'],
      command: 'npx spec-wave verify --target .',
    })
    assert.deepEqual(v2HooksOf(HOOKS_DIR, 'green_none_explicit.yaml', 'a'), { mechanism: 'none' })
    assert.deepEqual(v2HooksOf(HOOKS_DIR, 'green_deep_merge.yaml', 'a'), {
      mechanism: 'shell-hook',
      triggers: ['pre-commit'],
      command: 'npx spec-wave verify --target .',
    })
  })

  it('红：未知 mechanism / 未知 trigger → enum fail-closed 点名', () => {
    assertRed(HOOKS_DIR, 'red_unknown_mechanism.yaml', /mechanism 须为 shell-hook\|config-hook\|none/, /git-hook/)
    assertRed(HOOKS_DIR, 'red_unknown_trigger.yaml', /未知 trigger/, /pre-push/)
  })

  it('红（F-W1-10 矛盾声明）：none 带 triggers/command · 非 none 缺 command/triggers · triggers 空数组', () => {
    assertRed(HOOKS_DIR, 'red_none_with_triggers.yaml', /禁声明 triggers\/command/)
    assertRed(HOOKS_DIR, 'red_none_with_command.yaml', /禁声明 triggers\/command/)
    assertRed(HOOKS_DIR, 'red_missing_command.yaml', /command 必填/)
    assertRed(HOOKS_DIR, 'red_missing_triggers.yaml', /triggers 必填/)
    assertRed(HOOKS_DIR, 'red_empty_triggers.yaml', /triggers 必填且非空/)
  })

  it('红（F-W1-10 跨层矛盾）：defaults none + 行补 command → 合并后报红', () => {
    assertRed(HOOKS_DIR, 'red_merged_none_contradiction.yaml', /禁声明 triggers\/command/)
  })
})

describe('3.0 W1 阶段三 · command_sets 校验（S2.5 · F-W1-07）', { concurrency: 1 }, () => {
  it('绿：合法 command_sets + 自定义 forbidden → exit 0 · resolved 模型读表数据（forbidden 并集）', () => {
    assertGreen(CS_DIR, 'green_valid.yaml')
    const r = resolveV2Model(docAt(CS_DIR, 'green_valid.yaml'))
    assert.ok(r.ok)
    assert.deepEqual(r.model.commandSets, {
      core: ['verify', 'gate-status'],
      expanded: ['graph-check'],
      forbidden: ['kit-30', 'kit-publish', 'acme-legacy'], // 内建禁词永续 ∪ 表声明
    })
  })

  it('红（F-W1-07）：v2 缺 command_sets → fail-closed 点名 · 不回退硬编码默认', () => {
    assertRed(CS_DIR, 'red_missing_command_sets.yaml', /缺 command_sets/, /F-W1-07/, /不回退硬编码默认/)
  })

  it('红（forbidden 机检）：内建禁词入 core/expanded 点名 · 自定义禁词并集 · 内建永禁不被声明白名单覆盖', () => {
    assertRed(CS_DIR, 'red_forbidden_in_core.yaml', /forbidden/, /kit-30/)
    assertRed(CS_DIR, 'red_forbidden_in_expanded.yaml', /forbidden/, /kit-publish/)
    assertRed(CS_DIR, 'red_custom_forbidden_union.yaml', /forbidden/, /acme-cmd/)
    assertRed(CS_DIR, 'red_builtin_forbidden_union.yaml', /forbidden/, /kit-30/)
  })

  it('红（形状）：core 空数组 / 非字符串项 → 报红', () => {
    assertRed(CS_DIR, 'red_empty_core.yaml', /非空数组/)
    assertRed(CS_DIR, 'red_non_string_item.yaml', /非空字符串/)
  })
})

describe('3.0 W1 阶段三 · command_sets 消费切换（materialize 读表数据 · v1 内建目录）', { concurrency: 1 }, () => {
  it('commandSetsOf：v1 → 内建目录 · v2 → 表数据 + forbidden 并集', () => {
    const v1 = yamlLoad(readFileSync(V1_FIXTURE, 'utf8'))
    assert.deepEqual(commandSetsOf(v1), builtinCommandSets())
    assert.deepEqual(commandSetsOf(docAt(CS_DIR, 'green_valid.yaml')), {
      core: ['verify', 'gate-status'],
      expanded: ['graph-check'],
      forbidden: ['kit-30', 'kit-publish', 'acme-legacy'],
    })
  })

  it('e2e 全量表：v2 cursor 行 planned items 与 v1 2.4.2 表 cursor 子集逐字一致（core+expanded 双 profile）', () => {
    assertGreen(CS_DIR, 'v2_cursor_full.yaml')
    const target = mkdtempSync(path.join(os.tmpdir(), 'w1-cs-apply-'))
    try {
      const r = runCli(['host', 'apply', '--tools', 'cursor', '--profile', 'expanded', '--dry-run', '--file', path.join(CS_DIR, 'v2_cursor_full.yaml'), '--target', target])
      assert.equal(r.status, 0, r.combined)
    } finally {
      rmSync(target, { recursive: true, force: true })
    }
    const v2doc = docAt(CS_DIR, 'v2_cursor_full.yaml')
    const v1doc = yamlLoad(readFileSync(V1_FIXTURE, 'utf8'))
    for (const profile of ['core', 'expanded']) {
      const viaTable = fingerprint(resolvedHostRows(v2doc), profile, commandSetsOf(v2doc))
      const viaV1 = fingerprint(asHostRows(v1doc), profile, builtinCommandSets())
      assert.deepEqual(viaTable, viaV1, `profile=${profile} v2 表驱动与 v1 内建目录输出分叉`)
    }
  })

  it('e2e 子集表（表数据驱动正证）：core 缺 verify → planned core 恰 4 件无 kit-verify.md · 内建目录则 5 件', () => {
    assertGreen(CS_DIR, 'v2_cursor_subset.yaml')
    const doc = docAt(CS_DIR, 'v2_cursor_subset.yaml')
    const rows = resolvedHostRows(doc)
    const viaTable = fingerprint(rows, 'core', commandSetsOf(doc)).filter((i) => i.kind === 'command')
    assert.equal(viaTable.length, 4)
    assert.ok(!viaTable.some((i) => i.destRel.endsWith('kit-verify.md')))
    const viaBuiltin = fingerprint(rows, 'core', builtinCommandSets()).filter((i) => i.kind === 'command')
    assert.equal(viaBuiltin.length, 5)
    assert.ok(viaBuiltin.some((i) => i.destRel.endsWith('kit-verify.md')))
  })
})
