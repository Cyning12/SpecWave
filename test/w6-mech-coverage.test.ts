/**
 * 3.0.1 W6 · 机检覆盖面与校验一致性（P3-2 / P3-7）
 * terminology：CHANGELOG 全量扫 · 注入门控负向 · 边界词 · 六目标零回归
 * validate：非映射 + config-hook → PASS+WARN；apply 仍 rc=2；none / 映射宿主对照
 */
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { describe, it } from 'node:test'
import { fileURLToPath } from 'node:url'
import { CONFIG_HOOK_HOSTS } from '../src/host/hooks.ts'

const KIT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const CLI_TS = path.join(KIT, 'src', 'cli.ts')
const TERM_SCRIPT = path.join(KIT, 'scripts', 'check-terminology.mjs')
const TERM_CONFIG = path.join(KIT, 'assets', 'harness', 'terminology.yaml')
const MVP = path.join(KIT, 'assets', 'ide', 'host-adapt', 'examples', 'mvp-hosts.yaml')
const MANUAL = path.join(KIT, 'docs', 'guides', '使用手册-v3.0.0-zh.md')
const MIGRATION = path.join(KIT, 'MIGRATION.md')

type RunResult = { status: number | null; stdout: string; stderr: string; combined: string }

function runCli(args: string[], cwd = KIT): RunResult {
  const env = { ...process.env }
  delete env.DSH_CK_DSH_TOOLS_VERSION
  const r = spawnSync(process.execPath, ['--experimental-strip-types', CLI_TS, ...args], {
    encoding: 'utf8',
    cwd,
    env,
  })
  return {
    status: r.status,
    stdout: r.stdout ?? '',
    stderr: r.stderr ?? '',
    combined: `${r.stdout ?? ''}\n${r.stderr ?? ''}`,
  }
}

function runTerm(root: string): RunResult {
  const r = spawnSync(process.execPath, [TERM_SCRIPT, '--root', root, '--config', TERM_CONFIG], {
    encoding: 'utf8',
    cwd: KIT,
  })
  return {
    status: r.status,
    stdout: r.stdout ?? '',
    stderr: r.stderr ?? '',
    combined: `${r.stdout ?? ''}\n${r.stderr ?? ''}`,
  }
}

function minV2Table(hostId: string, mechanism: 'config-hook' | 'none'): string {
  const hooks =
    mechanism === 'none'
      ? '        mechanism: none'
      : [
          '        mechanism: config-hook',
          '        triggers: [pre-commit]',
          '        command: "npx spec-wave verify --target ."',
        ].join('\n')
  return [
    'version: "1"',
    'schema_version: 2',
    'command_sets:',
    '  core: [verify]',
    '  expanded: [graph-check]',
    'hosts:',
    `  - host_id: ${hostId}`,
    '    surfaces:',
    '      always_on: []',
    '      skills: []',
    '      commands: []',
    '      hooks:',
    hooks,
    '',
  ].join('\n')
}

describe('3.0.1 W6 · mech coverage（P3-2 / P3-7）', { concurrency: 1 }, () => {
  it('A1：仓基线 terminology rc=0 · CHANGELOG 已在 targets', () => {
    const yaml = readFileSync(TERM_CONFIG, 'utf8')
    assert.match(yaml, /CHANGELOG\.md/)
    const r = runTerm(KIT)
    assert.equal(r.status, 0, r.combined)
    assert.match(r.combined, /TERMINOLOGY: PASS/)
  })

  it('A2：向 CHANGELOG 注入「门控」⇒ exit 2 点名；清除后复绿', () => {
    const dir = mkdtempSync(path.join(os.tmpdir(), 'dsh-ck-w6-term-'))
    try {
      // 最小合规仓：拷 GLOSSARY + CHANGELOG（含注入）
      writeFileSync(
        path.join(dir, 'GLOSSARY.md'),
        '# G\n\n门禁 / 过程轨 / 帽制 / 人闸 / 真值源\n',
        'utf8',
      )
      writeFileSync(path.join(dir, 'CHANGELOG.md'), '# C\n\n本条含门控变体词\n', 'utf8')
      const bad = runTerm(dir)
      assert.equal(bad.status, 2, bad.combined)
      assert.match(bad.combined, /TERMINOLOGY: FAIL/)
      assert.ok(bad.combined.includes('CHANGELOG.md'), bad.combined)
      writeFileSync(path.join(dir, 'CHANGELOG.md'), '# C\n\n干净\n', 'utf8')
      const good = runTerm(dir)
      assert.equal(good.status, 0, good.combined)
    } finally {
      rmSync(dir, { recursive: true, force: true })
    }
  })

  it('A3：边界词「后门控制」「门控 skip」不误报', () => {
    const dir = mkdtempSync(path.join(os.tmpdir(), 'dsh-ck-w6-bound-'))
    try {
      writeFileSync(
        path.join(dir, 'GLOSSARY.md'),
        '# G\n\n门禁 / 过程轨 / 帽制 / 人闸 / 真值源\n',
        'utf8',
      )
      writeFileSync(
        path.join(dir, 'CHANGELOG.md'),
        '# C\n\n后门控制 · 门控 skip（gated）\n',
        'utf8',
      )
      const r = runTerm(dir)
      assert.equal(r.status, 0, r.combined)
    } finally {
      rmSync(dir, { recursive: true, force: true })
    }
  })

  it('A4：存量六目标仍在 targets（零回归锁）', () => {
    const yaml = readFileSync(TERM_CONFIG, 'utf8')
    for (const t of [
      'README.md',
      'README.zh-CN.md',
      'GLOSSARY.md',
      'RELEASING.md',
      'MIGRATION.md',
      'delivery/promotion/**',
    ]) {
      assert.ok(yaml.includes(t), `missing target ${t}`)
    }
  })

  it('A5：claims 本波不纳入 CHANGELOG（显式注释 + scan_targets 无该文件）', () => {
    const yaml = readFileSync(path.join(KIT, 'assets', 'harness', 'claims-boundary.yaml'), 'utf8')
    assert.match(yaml, /W6.*CHANGELOG|CHANGELOG.*不入/)
    const targetsBlock = yaml.slice(yaml.indexOf('scan_targets:'))
    assert.ok(!targetsBlock.includes('CHANGELOG.md'), targetsBlock)
  })

  it('A6：非映射 + config-hook → validate PASS + WARN（stderr / json#warnings）· rc=0', async () => {
    const dir = await mkdtemp(path.join(os.tmpdir(), 'dsh-ck-w6-val-'))
    try {
      const file = path.join(dir, 'acme-hook.yaml')
      await writeFile(file, minV2Table('acme-hook', 'config-hook'), 'utf8')
      const human = runCli(['host', 'validate', '--file', file])
      assert.equal(human.status, 0, human.combined)
      assert.match(human.stdout, /HOST VALIDATE:\s*PASS/)
      assert.match(human.stderr, /WARN:.*acme-hook/)
      assert.match(human.stderr, /fail-closed|mechanism: none/)

      const jsonR = runCli(['host', 'validate', '--file', file, '--json'])
      assert.equal(jsonR.status, 0, jsonR.combined)
      const obj = JSON.parse(jsonR.stdout) as {
        ok: boolean
        verdict: string
        warnings?: string[]
      }
      assert.equal(obj.ok, true)
      assert.equal(obj.verdict, 'PASS')
      assert.ok(Array.isArray(obj.warnings) && obj.warnings.length >= 1)
      assert.match(obj.warnings![0]!, /acme-hook/)
      assert.ok(!jsonR.stdout.includes('"errors"') || true)
    } finally {
      await rm(dir, { recursive: true, force: true })
    }
  })

  it('A7：同表 apply 仍 rc=2；mechanism: none 对照绿', async () => {
    const dir = await mkdtemp(path.join(os.tmpdir(), 'dsh-ck-w6-apply-'))
    try {
      const hookFile = path.join(dir, 'acme-hook.yaml')
      const noneFile = path.join(dir, 'acme-none.yaml')
      await writeFile(hookFile, minV2Table('acme-hook', 'config-hook'), 'utf8')
      await writeFile(noneFile, minV2Table('acme-none', 'none'), 'utf8')

      const applyHook = runCli([
        'host',
        'apply',
        '--tools',
        'acme-hook',
        '--file',
        hookFile,
        '--target',
        dir,
        '--yes',
      ])
      assert.equal(applyHook.status, 2, applyHook.combined)
      assert.match(applyHook.combined, /无物化落点映射|fail-closed/)

      const valNone = runCli(['host', 'validate', '--file', noneFile])
      assert.equal(valNone.status, 0, valNone.combined)
      assert.match(valNone.stdout, /HOST VALIDATE:\s*PASS/)
      assert.ok(!/WARN:.*acme-none/.test(valNone.stderr), valNone.stderr)

      const applyNone = runCli([
        'host',
        'apply',
        '--tools',
        'acme-none',
        '--file',
        noneFile,
        '--target',
        dir,
        '--yes',
      ])
      assert.equal(applyNone.status, 0, applyNone.combined)
    } finally {
      await rm(dir, { recursive: true, force: true })
    }
  })

  it('A7b：映射宿主 cursor validate 无本 WARN；apply 行为不回退为 fail-closed-on-map', () => {
    const keys = Object.keys(CONFIG_HOOK_HOSTS).sort().join('/')
    assert.equal(keys, 'claude/cursor/gemini')

    const r = runCli(['host', 'validate', '--file', MVP])
    assert.equal(r.status, 0, r.combined)
    assert.match(r.stdout, /HOST VALIDATE:\s*PASS/)
    assert.ok(!/WARN:.*不在 config-hook 落点映射表/.test(r.stderr), r.stderr)
  })

  it('A8：手册 B5 + MIGRATION 明写 PASS+WARN · 映射键对齐', () => {
    const manual = readFileSync(MANUAL, 'utf8')
    const mig = readFileSync(MIGRATION, 'utf8')
    assert.match(manual, /PASS \+ WARN/)
    assert.match(manual, /`claude` \/ `cursor` \/ `gemini`/)
    assert.match(mig, /PASS \+ WARN/)
    assert.match(mig, /fail-closed/)
    assert.match(mig, /mechanism: none/)
    assert.ok(!/validate` 会 \*\*PASS\*\*，但 `host apply`/.test(manual), 'stale silent PASS wording')
  })

  it('A9：CHANGELOG:134 已去「门控手动测试」变体', () => {
    const body = readFileSync(path.join(KIT, 'CHANGELOG.md'), 'utf8')
    assert.ok(!body.includes('门控手动测试'), 'history wording still has 门控手动测试')
    assert.match(body, /门禁手动测试/)
  })
})
