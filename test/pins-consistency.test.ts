import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { describe, it } from 'node:test'
import { fileURLToPath } from 'node:url'
import { load as yamlLoad } from 'js-yaml'

const KIT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const CLI_TS = path.join(KIT, 'src', 'cli.ts')
const PINS_YAML = path.join(KIT, 'assets', 'release-pins.yaml')

/**
 * 2.2.0 W1 · A1 · 版本/身份钉（release pins）一致性闸测。
 * A 组：真实仓钉面全绿（钉面失配 → 本组真失败 · 破坏性自证锚点）。
 * B 组：fixture 仓行为（exit 码 / --json 四字段 / fix dry-run / 备份 / 幂等 / S2 拒写 / failClosed）。
 * C 组：assets/release-pins.yaml 数据形态（SPEC 01 §5 十行 · D-PINS-SCOPE-8 语义入数据）。
 */

type RunResult = { status: number | null; stdout: string; stderr: string; combined: string }

function runCli(args: string[], cwd: string): RunResult {
  const r = spawnSync(process.execPath, ['--experimental-strip-types', CLI_TS, ...args], {
    encoding: 'utf8',
    cwd,
    env: { ...process.env },
  })
  const stdout = r.stdout ?? ''
  const stderr = r.stderr ?? ''
  return { status: r.status, stdout, stderr, combined: stdout + '\n' + stderr }
}

async function withTemp(fn: (dir: string) => Promise<void>): Promise<void> {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'specwave-pins-'))
  try {
    await fn(dir)
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
}

const FIXTURE_VERSION = '3.1.4'
const BROKEN_ONTOLOGY = 'product_semver: "9.9.9"' + '\n'
const GOOD_ONTOLOGY = 'product_semver: "' + FIXTURE_VERSION + '"' + '\n'

const FIXTURE_PINS_YAML = [
  'version: "1"',
  'truth_source: package.json#version',
  'pins:',
  '  - id: pin-01',
  '    path: package.json',
  '    extract: { kind: json-field, field: version }',
  '    expected: { kind: self }',
  '    required: true',
  '    fixable: false',
  '  - id: pin-02',
  '    path: package.json',
  '    extract: { kind: json-field, field: name }',
  '    expected: { kind: const, value: spec-wave }',
  '    required: true',
  '    fixable: false',
  '  - id: pin-03',
  '    path: assets/ontology.yaml',
  '    extract: { kind: regex, pattern: \'^product_semver:\\s*"([^"]+)"\', flags: m }',
  '    expected: { kind: package-version }',
  '    required: true',
  '    fixable: true',
  '  - id: pin-05',
  '    path: README.md',
  '    extract: { kind: regex-all, pattern: \'spec-wave@(\\d+\\.\\d+\\.\\d+)\', flags: g }',
  '    expected: { kind: package-version }',
  '    required: true',
  '    fixable: true',
  '  - id: pin-08',
  '    path: docs/spec/README.md',
  '    extract: { kind: spec-index-row, semantics: "索引表存在当前 minor 对应行或标注行" }',
  '    expected: { kind: package-version }',
  '    required: true',
  '    fixable: false',
  '  - id: pin-09',
  '    path: package.json',
  '    extract: { kind: json-bin }',
  '    expected: { kind: const-map, value: { spec-wave: bin/specgate.js } }',
  '    required: true',
  '    fixable: false',
  '',
].join('\n')


const DUAL_PINS_YAML = FIXTURE_PINS_YAML + [
  '  - id: pin-11',
  '    path: assets/ide/host-adapt/README.md',
  "    extract: { kind: regex-all, pattern: 'spec-wave@(\\d+\\.\\d+\\.\\d+)', flags: g }",
  '    expected: { kind: package-version }',
  '    required: true',
  '    fixable: true',
  '  - id: pin-12',
  '    path: assets/ide/host-adapt/README.md',
  "    extract: { kind: regex, pattern: '落点矩阵与 CLI（(\\d+\\.\\d+\\.\\d+)）', flags: m }",
  '    expected: { kind: package-version }',
  '    required: true',
  '    fixable: true',
  '',
].join('\n')

const DUAL_GOOD = '# 落点矩阵与 CLI（' + FIXTURE_VERSION + '）\n\nsync: spec-wave@' + FIXTURE_VERSION + ' · update: spec-wave@' + FIXTURE_VERSION + '\n'
const DUAL_BROKEN = DUAL_GOOD.split(FIXTURE_VERSION).join('9.9.9')

// ==== 2.3-W1 pins hardening 扩展 fixture（[A]#8 三面入钉 + [A]#14 失配覆盖补全 · D-23-PIN-3FACES） ====
const EXT_PINS_YAML = FIXTURE_PINS_YAML + [
  '  - id: pin-04',
  '    path: assets/harness/discipline-coverage.yaml',
  '    extract: { kind: regex, pattern: \'^as_of_package_version:\\s*"([^"]+)"\', flags: m }',
  '    expected: { kind: package-version }',
  '    required: true',
  '    fixable: true',
  '  - id: pin-06',
  '    path: README.zh-CN.md',
  "    extract: { kind: regex-all, pattern: 'spec-wave@(\\d+\\.\\d+\\.\\d+)', flags: g }",
  '    expected: { kind: package-version }',
  '    required: true',
  '    fixable: true',
  '  - id: pin-07',
  '    path: RELEASING.md',
  "    extract: { kind: regex, pattern: 'registry `latest`\\*\\* \\| \\*\\*`spec-wave@(\\d+\\.\\d+\\.\\d+)`', flags: m }",
  '    expected: { kind: package-version }',
  '    required: true',
  '    fixable: true',
  '  - id: pin-13',
  '    path: CHANGELOG.md',
  "    extract: { kind: regex, pattern: '^## \\[(\\d+\\.\\d+\\.\\d+)\\]', flags: m }",
  '    expected: { kind: package-version }',
  '    required: true',
  '    fixable: true',
  '  - id: pin-14',
  '    path: MIGRATION.md',
  "    extract: { kind: regex-all, pattern: 'spec-wave@(\\d+\\.\\d+\\.\\d+)', flags: g }",
  '    expected: { kind: package-version }',
  '    required: true',
  '    fixable: true',
  '  - id: pin-15',
  '    path: AGENTS.md',
  "    extract: { kind: regex-all, pattern: 'npx spec-wave@(\\d+\\.\\d+\\.\\d+)', flags: g }",
  '    expected: { kind: package-version }',
  '    required: true',
  '    fixable: true',
  '',
].join('\n')

const GOOD_DISCIPLINE = 'as_of_package_version: "' + FIXTURE_VERSION + '"' + '\n'
const GOOD_README_ZH = '中文钉 spec-wave@' + FIXTURE_VERSION + ' 处' + '\n'
const GOOD_RELEASING =
  '| **工作树 / registry `latest`** | **`spec-wave@' + FIXTURE_VERSION + '`**（已 published） |' + '\n'
const GOOD_CHANGELOG =
  '# Changelog\n\n## [Unreleased]\n\n（空）\n\n## [' + FIXTURE_VERSION + '] - 2026-09-12\n\n- x\n'
const GOOD_MIGRATION = '> 请钉 spec-wave@' + FIXTURE_VERSION + '\n'
const GOOD_AGENTS =
  '<!-- cyning-harness:begin -->\n产品块（host apply 维护 · 勿改 begin/end 内文）\n<!-- cyning-harness:end -->\n\n' +
  '<!-- cyning-harness-local:begin -->\n刷新（钉版本）：`npx spec-wave@' + FIXTURE_VERSION +
  ' host update --yes`\n<!-- cyning-harness-local:end -->\n'

/** 扩展 fixture 仓：pin-01..09 基线 + pin-04/06/07/13/14/15 落点文件（全对齐 FIXTURE_VERSION）。 */
async function makeExtFixture(dir: string): Promise<void> {
  await makeFixture(dir)
  await writeRel(dir, 'assets/release-pins.yaml', EXT_PINS_YAML)
  await writeRel(dir, 'assets/harness/discipline-coverage.yaml', GOOD_DISCIPLINE)
  await writeRel(dir, 'README.zh-CN.md', GOOD_README_ZH)
  await writeRel(dir, 'RELEASING.md', GOOD_RELEASING)
  await writeRel(dir, 'CHANGELOG.md', GOOD_CHANGELOG)
  await writeRel(dir, 'MIGRATION.md', GOOD_MIGRATION)
  await writeRel(dir, 'AGENTS.md', GOOD_AGENTS)
}

// ==== 2.3-W2 钉面维度扩展 fixture（D-23-W2-CHECK-FORM · pin-16 files-whitelist-link / pin-17 readme-host-row） ====
const W2_PINS_YAML = [
  'version: "1"',
  'truth_source: package.json#version',
  'pins:',
  '  - id: pin-16',
  '    path: package.json',
  "    extract: { kind: files-whitelist-link }",
  "    expected: { kind: const, value: 0-miss }",
  '    required: true',
  '    fixable: false',
  '  - id: pin-17',
  '    path: assets/hosts.yaml',
  '    extract:',
  '      kind: readme-host-row',
  '      readmes: [README.md, README.zh-CN.md]',
  '      host_hits:',
  "        alpha: ['\\|\\s*\\*\\*Alpha\\*\\*']",
  "    expected: { kind: const, value: 0-miss }",
  '    required: true',
  '    fixable: false',
  '',
].join('\n')

/** pin-17 全量映射版：host_hits 含 alpha/beta/delta（gamma 故意无映射 · F-W2-06 用例）+ known_gaps delta@W7。 */
const W2_PINS_YAML_HOSTS = [
  'version: "1"',
  'truth_source: package.json#version',
  'pins:',
  '  - id: pin-16',
  '    path: package.json',
  "    extract: { kind: files-whitelist-link }",
  "    expected: { kind: const, value: 0-miss }",
  '    required: true',
  '    fixable: false',
  '  - id: pin-17',
  '    path: assets/hosts.yaml',
  '    extract:',
  '      kind: readme-host-row',
  '      readmes: [README.md, README.zh-CN.md]',
  '      host_hits:',
  "        alpha: ['\\|\\s*\\*\\*Alpha\\*\\*']",
  "        beta: ['Beta']",
  "        delta: ['Delta']",
  '      known_gaps:',
  "        - { host_id: delta, until_wave: W7, note: '过渡豁免测试条目' }",
  "    expected: { kind: const, value: 0-miss }",
  '    required: true',
  '    fixable: false',
  '',
].join('\n')

const W2_HOSTS_ALPHA = 'version: "1"\nhosts:\n  - host_id: alpha\n'
const W2_README_EN =
  '# T\n\n| Host | X |\n| --- | --- |\n| **Alpha** | .a/ |\n\nsee [G](GLOSSARY.md)\n'
const W2_README_ZH = '# T\n\n| 宿主 | X |\n| --- | --- |\n| **Alpha** | .a/ |\n'

/** W2 fixture 仓：pin-16（files 白名单链接）+ pin-17（宿主↔双语 README）双绿基线。 */
async function makeW2Fixture(dir: string): Promise<void> {
  await writeRel(
    dir,
    'package.json',
    JSON.stringify(
      {
        name: 'spec-wave',
        version: FIXTURE_VERSION,
        files: ['README.md', 'README.zh-CN.md', 'GLOSSARY.md'],
      },
      null,
      2,
    ) + '\n',
  )
  await writeRel(dir, 'assets/release-pins.yaml', W2_PINS_YAML)
  await writeRel(dir, 'assets/hosts.yaml', W2_HOSTS_ALPHA)
  await writeRel(dir, 'README.md', W2_README_EN)
  await writeRel(dir, 'README.zh-CN.md', W2_README_ZH)
  await writeRel(dir, 'GLOSSARY.md', '# G\n')
}

async function writeRel(dir: string, rel: string, body: string): Promise<void> {
  const abs = path.join(dir, rel)
  await mkdir(path.dirname(abs), { recursive: true })
  await writeFile(abs, body)
}

/** 干净 fixture 仓（version 全对齐 FIXTURE_VERSION）。 */
async function makeFixture(dir: string): Promise<void> {
  await writeRel(
    dir,
    'package.json',
    JSON.stringify(
      { name: 'spec-wave', version: FIXTURE_VERSION, bin: { 'spec-wave': 'bin/specgate.js' } },
      null,
      2,
    ) + '\n',
  )
  await writeRel(dir, 'assets/release-pins.yaml', FIXTURE_PINS_YAML)
  await writeRel(dir, 'assets/ontology.yaml', GOOD_ONTOLOGY)
  await writeRel(dir, 'README.md', 'pin spec-wave@' + FIXTURE_VERSION + ' here' + '\n')
  await writeRel(
    dir,
    'docs/spec/README.md',
    '| slug | 路径 | 状态 | 一句话 |' + '\n' +
      '| --- | --- | --- | --- |' + '\n' +
      // pin-08 语义格位口径（D-24-PIN08-SEMCELL）：patch 收尾行形态（状态列含点式版本串 + slug 列行身份）
      '| `' + FIXTURE_VERSION + '`（patch 收尾行） | — | **`' + FIXTURE_VERSION + '` published** | z |' + '\n',
  )
}

describe('W1-A1 release pins · A组 真实仓钉面一致（失配真失败锚点）', { concurrency: 1 }, () => {
  it('pins check 在真实仓 exit 0 且打印 PINS: PASS', () => {
    const r = runCli(['pins', 'check'], KIT)
    assert.equal(r.status, 0, r.combined)
    assert.match(r.combined, /PINS: PASS/)
  })
})

describe('W1-A1 release pins · B组 fixture 仓行为', { concurrency: 1 }, () => {
  it('B1 干净 fixture：check exit 0；--json 每落点含 path/expected/actual/status 且全 ok', async () => {
    await withTemp(async (dir) => {
      await makeFixture(dir)
      const r = runCli(['pins', 'check', '--json'], dir)
      assert.equal(r.status, 0, r.combined)
      const doc = JSON.parse(r.stdout) as {
        truth_version: string
        status: string
        pins: Array<{ path: string; expected: string; actual: string | null; status: string }>
      }
      assert.equal(doc.truth_version, FIXTURE_VERSION)
      assert.equal(doc.status, 'pass')
      assert.ok(doc.pins.length >= 6)
      for (const p of doc.pins) {
        assert.equal(typeof p.path, 'string')
        assert.equal(typeof p.expected, 'string')
        assert.ok('actual' in p)
        assert.equal(p.status, 'ok', JSON.stringify(p))
      }
    })
  })

  it('B2 ontology 失配：check exit 2，输出指出文件与行；--json status=mismatch', async () => {
    await withTemp(async (dir) => {
      await makeFixture(dir)
      await writeRel(dir, 'assets/ontology.yaml', BROKEN_ONTOLOGY)
      const r = runCli(['pins', 'check'], dir)
      assert.equal(r.status, 2, r.combined)
      assert.match(r.combined, /assets\/ontology\.yaml:1/)
      assert.match(r.combined, /9\.9\.9/)
      assert.match(r.combined, /3\.1\.4/)
      const j = runCli(['pins', 'check', '--json'], dir)
      assert.equal(j.status, 2, j.combined)
      const doc = JSON.parse(j.stdout) as {
        pins: Array<{ path: string; status: string; line: number | null }>
      }
      const bad = doc.pins.find((p) => p.path === 'assets/ontology.yaml')
      assert.ok(bad)
      assert.equal(bad!.status, 'mismatch')
      assert.equal(bad!.line, 1)
    })
  })

  it('B3 fix 默认 dry-run：零写盘 · 无 .bak · 打印将改文件', async () => {
    await withTemp(async (dir) => {
      await makeFixture(dir)
      await writeRel(dir, 'assets/ontology.yaml', BROKEN_ONTOLOGY)
      const r = runCli(['pins', 'fix'], dir)
      assert.equal(r.status, 0, r.combined)
      assert.match(r.combined, /dry-run/)
      assert.match(r.combined, /assets\/ontology\.yaml/)
      const after = await readFile(path.join(dir, 'assets/ontology.yaml'), 'utf8')
      assert.equal(after, BROKEN_ONTOLOGY, 'dry-run 不得写盘')
      assert.equal(
        existsSync(path.join(dir, 'assets/ontology.yaml.bak')),
        false,
        'dry-run 不得留备份',
      )
    })
  })

  it('B4 fix --yes：写回真值 · .bak 写前备份成功后自动清理（2.3.1 N1-d）· 复跑幂等（0 修改 · 不再产备份）', async () => {
    await withTemp(async (dir) => {
      await makeFixture(dir)
      await writeRel(dir, 'assets/ontology.yaml', BROKEN_ONTOLOGY)
      const r = runCli(['pins', 'fix', '--yes'], dir)
      assert.equal(r.status, 0, r.combined)
      const fixed = await readFile(path.join(dir, 'assets/ontology.yaml'), 'utf8')
      assert.equal(fixed, GOOD_ONTOLOGY)
      assert.equal(
        existsSync(path.join(dir, 'assets/ontology.yaml.bak')),
        false,
        'fix 成功后 .bak 须自动清理（2.3.1 N1-d · 防 .bak 随包发布）',
      )
      const check = runCli(['pins', 'check'], dir)
      assert.equal(check.status, 0, check.combined)
      const again = runCli(['pins', 'fix', '--yes'], dir)
      assert.equal(again.status, 0, again.combined)
      assert.match(again.combined, /0 处|无偏差|nothing/i)
      assert.equal(
        existsSync(path.join(dir, 'assets/ontology.yaml.bak')),
        false,
        '幂等复跑不得新产备份',
      )
    })
  })

  it('B5 S2 机械拒写：fixable 落点指 docs/tasks → fix --yes exit 2 · 零写盘 · 零备份残留', async () => {
    await withTemp(async (dir) => {
      await makeFixture(dir)
      const s2pin = [
        '  - id: pin-99',
        '    path: docs/tasks/evil.md',
        '    extract: { kind: regex, pattern: \'version: "(.+)"\', flags: m }',
        '    expected: { kind: package-version }',
        '    required: true',
        '    fixable: true',
        '',
      ].join('\n')
      await writeRel(dir, 'assets/release-pins.yaml', FIXTURE_PINS_YAML + s2pin)
      await writeRel(dir, 'docs/tasks/evil.md', 'version: "0.0.0"' + '\n')
      const r = runCli(['pins', 'fix', '--yes'], dir)
      assert.equal(r.status, 2, r.combined)
      assert.match(r.combined, /S2/)
      assert.match(r.combined, /拒写|拒绝|REFUSED/i)
      assert.match(r.combined, /无豁免/)
      const after = await readFile(path.join(dir, 'docs/tasks/evil.md'), 'utf8')
      assert.equal(after, 'version: "0.0.0"' + '\n', 'S2 落点不得被改写')
      assert.equal(
        existsSync(path.join(dir, 'docs/tasks/evil.md.bak')),
        false,
        'S2 拒写不得留备份残留',
      )
    })
  })

  it('B6 required 落点文件缺失：check exit 2 · --json status=missing（F-A1-02）', async () => {
    await withTemp(async (dir) => {
      await makeFixture(dir)
      await rm(path.join(dir, 'README.md'))
      const j = runCli(['pins', 'check', '--json'], dir)
      assert.equal(j.status, 2, j.combined)
      const doc = JSON.parse(j.stdout) as { pins: Array<{ path: string; status: string }> }
      assert.equal(doc.pins.find((p) => p.path === 'README.md')!.status, 'missing')
    })
  })

  it('B7 正则零命中：extract_error · failClosed 不静默跳过（F-A1-06）', async () => {
    await withTemp(async (dir) => {
      await makeFixture(dir)
      await writeRel(dir, 'README.md', 'no pin mention at all' + '\n')
      const j = runCli(['pins', 'check', '--json'], dir)
      assert.equal(j.status, 2, j.combined)
      const doc = JSON.parse(j.stdout) as { pins: Array<{ path: string; status: string }> }
      assert.equal(doc.pins.find((p) => p.path === 'README.md')!.status, 'extract_error')
    })
  })

  it('B8 release-pins.yaml 缺失：check 非 0 · 报错指文件（F-A1-01 failClosed）', async () => {
    await withTemp(async (dir) => {
      await makeFixture(dir)
      await rm(path.join(dir, 'assets/release-pins.yaml'))
      const r = runCli(['pins', 'check'], dir)
      assert.equal(r.status, 2, r.combined)
      assert.match(r.combined, /assets\/release-pins\.yaml/)
    })
  })

  it('B9 不可修偏差（name 常量 · fixable=false）：fix --yes 报不可修且 exit 2 · 不反向改真值源', async () => {
    await withTemp(async (dir) => {
      await makeFixture(dir)
      await writeRel(
        dir,
        'package.json',
        JSON.stringify(
          { name: 'wrong-name', version: FIXTURE_VERSION, bin: { 'spec-wave': 'bin/specgate.js' } },
          null,
          2,
        ) + '\n',
      )
      const r = runCli(['pins', 'fix', '--yes'], dir)
      assert.equal(r.status, 2, r.combined)
      assert.match(r.combined, /不可修|unfixable|仅人/)
      const pkg = JSON.parse(await readFile(path.join(dir, 'package.json'), 'utf8')) as {
        name: string
      }
      assert.equal(pkg.name, 'wrong-name', 'package.json 真值源侧永不被 fix 反向改')
    })
  })

  it('B11 同文件双钉面一次 fix 收敛（2.2.1 P1 · pin-11/12 场景 · 杜绝 exit 0 留坏值）', async () => {
    await withTemp(async (dir) => {
      await makeFixture(dir)
      await writeRel(dir, 'assets/release-pins.yaml', DUAL_PINS_YAML)
      await writeRel(dir, 'assets/ide/host-adapt/README.md', DUAL_GOOD)
      const ok = runCli(['pins', 'check'], dir)
      assert.equal(ok.status, 0, '基线双钉面应绿: ' + ok.combined)
      // 同时破坏 pin-11（regex-all 两处）与 pin-12（regex 标题行）
      await writeRel(dir, 'assets/ide/host-adapt/README.md', DUAL_BROKEN)
      const bad = runCli(['pins', 'check'], dir)
      assert.equal(bad.status, 2, bad.combined)
      assert.match(bad.combined, /pin-11/)
      assert.match(bad.combined, /pin-12/)
      // 单次 fix --yes 必须一次收敛（聚合写盘 · 后写不覆盖先写）
      const fix = runCli(['pins', 'fix', '--yes'], dir)
      assert.equal(fix.status, 0, fix.combined)
      const after = await readFile(path.join(dir, 'assets/ide/host-adapt/README.md'), 'utf8')
      assert.equal(after, DUAL_GOOD, '同文件双钉面须全部写回真值（不得静默部分修复）')
      assert.equal(
        existsSync(path.join(dir, 'assets/ide/host-adapt/README.md.bak')),
        false,
        'fix 成功后 .bak 须自动清理（2.3.1 N1-d · 同文件聚合写盘语义保持：单条 [written]）',
      )
      const check = runCli(['pins', 'check'], dir)
      assert.equal(check.status, 0, '一次 fix 后 check 须转绿（exit 0 自称全修 = 实际全修）: ' + check.combined)
      assert.match(check.combined, /PINS: PASS/)
    })
  })

  it('B10 未知子命令/未知参数：exit 1 用法错误档', async () => {
    await withTemp(async (dir) => {
      await makeFixture(dir)
      const r1 = runCli(['pins', 'wat'], dir)
      assert.equal(r1.status, 1, r1.combined)
      const r2 = runCli(['pins', 'check', '--bogus'], dir)
      assert.equal(r2.status, 1, r2.combined)
    })
  })
})

describe('2.3-W1 pins hardening · 失配 fixture 补全（[A]#14）+ 三面入钉（[A]#8 · D-23-PIN-3FACES）+ pin-08 严化（D-23-PIN08-STRICT）', { concurrency: 1 }, () => {
  it('W1-B1 扩展 fixture 基线全绿（pin-04/06/07/13/14/15 入钉后 check exit 0 · PINS: PASS）', async () => {
    await withTemp(async (dir) => {
      await makeExtFixture(dir)
      const r = runCli(['pins', 'check'], dir)
      assert.equal(r.status, 0, r.combined)
      assert.match(r.combined, /PINS: PASS · 12\/12 落点一致/)
    })
  })

  it('W1-B2 pin-04 失配：discipline-coverage 版本漂移 → exit 2 指出 assets/harness/discipline-coverage.yaml:1', async () => {
    await withTemp(async (dir) => {
      await makeExtFixture(dir)
      await writeRel(dir, 'assets/harness/discipline-coverage.yaml', 'as_of_package_version: "9.9.9"' + '\n')
      const r = runCli(['pins', 'check'], dir)
      assert.equal(r.status, 2, r.combined)
      assert.match(r.combined, /\[mismatch\] pin-04 assets\/harness\/discipline-coverage\.yaml:1/)
      assert.match(r.combined, /9\.9\.9/)
    })
  })

  it('W1-B3 pin-06 失配：README.zh-CN 版本漂移 → exit 2 指出 README.zh-CN.md:1', async () => {
    await withTemp(async (dir) => {
      await makeExtFixture(dir)
      await writeRel(dir, 'README.zh-CN.md', '中文钉 spec-wave@9.9.9 处' + '\n')
      const r = runCli(['pins', 'check'], dir)
      assert.equal(r.status, 2, r.combined)
      assert.match(r.combined, /\[mismatch\] pin-06 README\.zh-CN\.md:1/)
    })
  })

  it('W1-B4 pin-07 失配：RELEASING 现行包行漂移 → exit 2 指出 RELEASING.md:1', async () => {
    await withTemp(async (dir) => {
      await makeExtFixture(dir)
      await writeRel(
        dir,
        'RELEASING.md',
        '| **工作树 / registry `latest`** | **`spec-wave@9.9.9`**（已 published） |' + '\n',
      )
      const r = runCli(['pins', 'check'], dir)
      assert.equal(r.status, 2, r.combined)
      assert.match(r.combined, /\[mismatch\] pin-07 RELEASING\.md:1/)
    })
  })

  it('W1-B5 pin-10 失配：git 仓无该 tag → status=missing exit 2（测试内 git init 隔离 · 不真打 tag · F-A1-05）', async () => {
    await withTemp(async (dir) => {
      await makeExtFixture(dir)
      const gitPin = [
        '  - id: pin-10',
        '    path: git',
        "    extract: { kind: git-tag, pattern: 'v{version}' }",
        '    expected: { kind: package-version }',
        '    required: true',
        '    fixable: false',
        '',
      ].join('\n')
      await writeRel(dir, 'assets/release-pins.yaml', EXT_PINS_YAML + gitPin)
      const init = spawnSync('git', ['init', '-q'], { cwd: dir, encoding: 'utf8' })
      assert.equal(init.status, 0, (init.stderr ?? '') + '（测试环境须可用 git）')
      const j = runCli(['pins', 'check', '--json'], dir)
      assert.equal(j.status, 2, j.combined)
      const doc = JSON.parse(j.stdout) as { pins: Array<{ id: string; status: string; detail?: string }> }
      const p10 = doc.pins.find((p) => p.id === 'pin-10')
      assert.ok(p10)
      assert.equal(p10!.status, 'missing')
      assert.match(p10!.detail ?? '', /git 操作仅人/)
      const r = runCli(['pins', 'check'], dir)
      assert.equal(r.status, 2, r.combined)
      assert.match(r.combined, /\[missing\] pin-10 git/)
      assert.match(r.combined, /v3\.1\.4/)
    })
  })

  it('W1-B6 pin-11 单钉失配（regex-all 面独坏）：exit 2 报 pin-11 · pin-12 仍 ok', async () => {
    await withTemp(async (dir) => {
      await makeFixture(dir)
      await writeRel(dir, 'assets/release-pins.yaml', DUAL_PINS_YAML)
      await writeRel(dir, 'assets/ide/host-adapt/README.md', DUAL_GOOD)
      await writeRel(
        dir,
        'assets/ide/host-adapt/README.md',
        DUAL_GOOD.split('spec-wave@' + FIXTURE_VERSION).join('spec-wave@9.9.9'),
      )
      const r = runCli(['pins', 'check'], dir)
      assert.equal(r.status, 2, r.combined)
      assert.match(r.combined, /\[mismatch\] pin-11 assets\/ide\/host-adapt\/README\.md:3/)
      assert.match(r.combined, /\[ok\] pin-12 /)
    })
  })

  it('W1-B7 pin-12 单钉失配（regex 标题行独坏）：exit 2 报 pin-12 指 :1 · pin-11 仍 ok', async () => {
    await withTemp(async (dir) => {
      await makeFixture(dir)
      await writeRel(dir, 'assets/release-pins.yaml', DUAL_PINS_YAML)
      await writeRel(
        dir,
        'assets/ide/host-adapt/README.md',
        DUAL_GOOD.split('（' + FIXTURE_VERSION + '）').join('（9.9.9）'),
      )
      const r = runCli(['pins', 'check'], dir)
      assert.equal(r.status, 2, r.combined)
      assert.match(r.combined, /\[mismatch\] pin-12 assets\/ide\/host-adapt\/README\.md:1/)
      assert.match(r.combined, /\[ok\] pin-11 /)
    })
  })

  it('W1-B8 pin-08 严化反例：当前版本行改坏 + 别行 prose 兜底 → exit 2 mismatch 且指出兜底嫌疑行（[A]#7 验收反例）', async () => {
    await withTemp(async (dir) => {
      await makeFixture(dir)
      await writeRel(
        dir,
        'docs/spec/README.md',
        '| slug | 路径 | 状态 | 一句话 |' + '\n' +
          '| --- | --- | --- | --- |' + '\n' +
          '| `9.9.9`（patch 收尾行） | — | **`9.9.9` published** | z |' + '\n' +
          '| x-y | — | signed | 叙事顺带提及 spec-wave@' + FIXTURE_VERSION + ' |' + '\n',
      )
      const r = runCli(['pins', 'check'], dir)
      assert.equal(r.status, 2, r.combined)
      assert.match(r.combined, /\[mismatch\] pin-08 docs\/spec\/README\.md/)
      assert.match(r.combined, /兜底嫌疑行/)
      assert.match(r.combined, /L4/)
    })
  })

  it('W1-B9 pin-13 三面破坏-修复（CHANGELOG 最新发布头）：漂移 exit 2 指行 → fix --yes 收敛且日期行不动', async () => {
    await withTemp(async (dir) => {
      await makeExtFixture(dir)
      const broken = GOOD_CHANGELOG.replace('## [' + FIXTURE_VERSION + ']', '## [9.9.9]')
      await writeRel(dir, 'CHANGELOG.md', broken)
      const r = runCli(['pins', 'check'], dir)
      assert.equal(r.status, 2, r.combined)
      assert.match(r.combined, /\[mismatch\] pin-13 CHANGELOG\.md:7/)
      const fix = runCli(['pins', 'fix', '--yes'], dir)
      assert.equal(fix.status, 0, fix.combined)
      const after = await readFile(path.join(dir, 'CHANGELOG.md'), 'utf8')
      assert.equal(after, GOOD_CHANGELOG, 'fix 只回写版本号 · 日期行与其余不动')
      const check = runCli(['pins', 'check'], dir)
      assert.equal(check.status, 0, check.combined)
    })
  })

  it('W1-B10 pin-13 F-W1-02：CHANGELOG 仅 Unreleased 空节 → 零命中 extract_error exit 2（不静默跳过）', async () => {
    await withTemp(async (dir) => {
      await makeExtFixture(dir)
      await writeRel(dir, 'CHANGELOG.md', '# Changelog\n\n## [Unreleased]\n\n（空 · 无发布头）\n')
      const j = runCli(['pins', 'check', '--json'], dir)
      assert.equal(j.status, 2, j.combined)
      const doc = JSON.parse(j.stdout) as { pins: Array<{ id: string; status: string }> }
      assert.equal(doc.pins.find((p) => p.id === 'pin-13')!.status, 'extract_error')
    })
  })

  it('W1-B11 pin-14 三面破坏-修复（MIGRATION spec-wave@X）：漂移 exit 2 指行 → fix --yes 收敛', async () => {
    await withTemp(async (dir) => {
      await makeExtFixture(dir)
      await writeRel(dir, 'MIGRATION.md', '> 请钉 spec-wave@9.9.9\n')
      const r = runCli(['pins', 'check'], dir)
      assert.equal(r.status, 2, r.combined)
      assert.match(r.combined, /\[mismatch\] pin-14 MIGRATION\.md:1/)
      const fix = runCli(['pins', 'fix', '--yes'], dir)
      assert.equal(fix.status, 0, fix.combined)
      assert.equal(await readFile(path.join(dir, 'MIGRATION.md'), 'utf8'), GOOD_MIGRATION)
    })
  })

  it('W1-B12 pin-15 三面破坏-修复（AGENTS npx spec-wave@X）：漂移 exit 2 指行 → fix 收敛且 cyning-harness marker 块完整（F-W1-04）', async () => {
    await withTemp(async (dir) => {
      await makeExtFixture(dir)
      await writeRel(dir, 'AGENTS.md', GOOD_AGENTS.split('spec-wave@' + FIXTURE_VERSION).join('spec-wave@9.9.9'))
      const r = runCli(['pins', 'check'], dir)
      assert.equal(r.status, 2, r.combined)
      assert.match(r.combined, /\[mismatch\] pin-15 AGENTS\.md:6/)
      const fix = runCli(['pins', 'fix', '--yes'], dir)
      assert.equal(fix.status, 0, fix.combined)
      const after = await readFile(path.join(dir, 'AGENTS.md'), 'utf8')
      assert.equal(after, GOOD_AGENTS, 'fix 只替换版本串 capture group')
      for (const marker of [
        '<!-- cyning-harness:begin -->',
        '<!-- cyning-harness:end -->',
        '<!-- cyning-harness-local:begin -->',
        '<!-- cyning-harness-local:end -->',
      ]) {
        assert.ok(after.includes(marker), '产品块标记须完整: ' + marker)
      }
      const check = runCli(['pins', 'check'], dir)
      assert.equal(check.status, 0, check.combined)
    })
  })
})

describe('2.3-W2 钉面维度扩展 · pin-16 文档↔files / pin-17 宿主↔根 README（D-23-W2-CHECK-FORM · [A]#3/#4 机制化）', { concurrency: 1 }, () => {
  it('W2-B1 基线全绿：pin-16/17 双 ok · PINS: PASS', async () => {
    await withTemp(async (dir) => {
      await makeW2Fixture(dir)
      const r = runCli(['pins', 'check'], dir)
      assert.equal(r.status, 0, r.combined)
      assert.match(r.combined, /\[ok\] pin-16 package\.json = 扫描 3 个 markdown · 0 失配/)
      assert.match(r.combined, /\[ok\] pin-17 assets\/hosts\.yaml = 1 宿主校验 · 1 双语命中/)
      assert.match(r.combined, /PINS: PASS/)
    })
  })

  it('W2-B2 pin-16 负向：仓根 FOO.md 被链接且不入 files → exit 2 指 README.md:行号 -> FOO.md · 入 files 转绿', async () => {
    await withTemp(async (dir) => {
      await makeW2Fixture(dir)
      await writeRel(dir, 'FOO.md', '# F\n')
      await writeRel(dir, 'README.md', W2_README_EN + 'see [F](FOO.md)\n')
      const bad = runCli(['pins', 'check'], dir)
      assert.equal(bad.status, 2, bad.combined)
      assert.match(bad.combined, /\[mismatch\] pin-16 package\.json/)
      assert.match(bad.combined, /README\.md:8 -> FOO\.md/)
      assert.match(bad.combined, /files 加白 or 移除链接/)
      // 入 files 后转绿
      const pkg = JSON.parse(await readFile(path.join(dir, 'package.json'), 'utf8')) as {
        files: string[]
      }
      pkg.files.push('FOO.md')
      await writeRel(dir, 'package.json', JSON.stringify(pkg, null, 2) + '\n')
      const good = runCli(['pins', 'check'], dir)
      assert.equal(good.status, 0, good.combined)
      assert.match(good.combined, /\[ok\] pin-16 /)
    })
  })

  it('W2-B3 pin-16 反误报（D-23-W2-NPM-AUTOINCLUDE 钉死）：链接 README.zh-CN.md 未列 files 仍 PASS（npm README* 自动入包）', async () => {
    await withTemp(async (dir) => {
      await makeW2Fixture(dir)
      // files 只列 README.md + GLOSSARY.md；README.zh-CN.md 未列名但被链接
      await writeRel(
        dir,
        'package.json',
        JSON.stringify(
          { name: 'spec-wave', version: FIXTURE_VERSION, files: ['README.md', 'GLOSSARY.md'] },
          null,
          2,
        ) + '\n',
      )
      await writeRel(
        dir,
        'README.md',
        '# T\n\n[简体中文](README.zh-CN.md) | English\n\n| Host | X |\n| --- | --- |\n| **Alpha** | .a/ |\n\nsee [G](GLOSSARY.md)\n',
      )
      const r = runCli(['pins', 'check'], dir)
      assert.equal(r.status, 0, r.combined)
      assert.match(r.combined, /\[ok\] pin-16 /)
    })
  })

  it('W2-B4 pin-16 目录前缀展开（F-W2-02 仓根级口径下作用于扫描源）：files 仅 assets → 其内 markdown 被扫描 · 仓根 FOO.md 未入白名单 exit 2', async () => {
    await withTemp(async (dir) => {
      await writeRel(
        dir,
        'package.json',
        JSON.stringify({ name: 'spec-wave', version: FIXTURE_VERSION, files: ['assets'] }, null, 2) + '\n',
      )
      await writeRel(dir, 'assets/release-pins.yaml', W2_PINS_YAML)
      await writeRel(dir, 'assets/hosts.yaml', W2_HOSTS_ALPHA)
      await writeRel(dir, 'README.md', W2_README_EN)
      await writeRel(dir, 'README.zh-CN.md', W2_README_ZH)
      await writeRel(dir, 'FOO.md', '# F\n')
      await writeRel(dir, 'assets/a.md', 'link [F](../FOO.md)\n')
      const bad = runCli(['pins', 'check'], dir)
      assert.equal(bad.status, 2, bad.combined)
      assert.match(bad.combined, /assets\/a\.md:1 -> FOO\.md/)
      const pkg = JSON.parse(await readFile(path.join(dir, 'package.json'), 'utf8')) as {
        files: string[]
      }
      pkg.files.push('FOO.md')
      await writeRel(dir, 'package.json', JSON.stringify(pkg, null, 2) + '\n')
      const good = runCli(['pins', 'check'], dir)
      assert.equal(good.status, 0, good.combined)
    })
  })

  it('W2-B5 pin-16 链接变体（F-W2-01）：锚点/尖括号/图片同口径判定 · scheme 与纯锚点跳过', async () => {
    await withTemp(async (dir) => {
      await makeW2Fixture(dir)
      const pkg = JSON.parse(await readFile(path.join(dir, 'package.json'), 'utf8')) as {
        files: string[]
      }
      pkg.files.push('FOO.md', 'BAR.md', 'BAZ.md')
      await writeRel(dir, 'package.json', JSON.stringify(pkg, null, 2) + '\n')
      await writeRel(dir, 'FOO.md', '# F\n')
      await writeRel(dir, 'BAR.md', '# B\n')
      await writeRel(dir, 'BAZ.md', '# Z\n')
      await writeRel(
        dir,
        'README.md',
        W2_README_EN +
          '[a](FOO.md#sec) [b](<BAR.md>) ![i](BAZ.md) [x](https://e.com/Q.md) [y](#frag)\n',
      )
      const good = runCli(['pins', 'check'], dir)
      assert.equal(good.status, 0, good.combined)
      // 图片链接的 BAZ.md 移出 files → 同口径判失配
      pkg.files = pkg.files.filter((f) => f !== 'BAZ.md')
      await writeRel(dir, 'package.json', JSON.stringify(pkg, null, 2) + '\n')
      const bad = runCli(['pins', 'check'], dir)
      assert.equal(bad.status, 2, bad.combined)
      assert.match(bad.combined, /README\.md:8 -> BAZ\.md/)
    })
  })

  it('W2-B6 pin-16 不存在的目标不判（F-W2-07）：链接 GONE.md（不存在）→ 仍 PASS', async () => {
    await withTemp(async (dir) => {
      await makeW2Fixture(dir)
      await writeRel(dir, 'README.md', W2_README_EN + 'see [g](GONE.md)\n')
      const r = runCli(['pins', 'check'], dir)
      assert.equal(r.status, 0, r.combined)
      assert.match(r.combined, /\[ok\] pin-16 /)
    })
  })

  it('W2-B7 pin-17 负向：适配表加 beta（有映射）· 双语 README 无命中 → exit 2 指 host_id 与 EN/ZH 缺失侧分别', async () => {
    await withTemp(async (dir) => {
      await makeW2Fixture(dir)
      await writeRel(dir, 'assets/release-pins.yaml', W2_PINS_YAML_HOSTS)
      await writeRel(dir, 'assets/hosts.yaml', 'version: "1"\nhosts:\n  - host_id: alpha\n  - host_id: beta\n  - host_id: delta\n')
      const bad = runCli(['pins', 'check'], dir)
      assert.equal(bad.status, 2, bad.combined)
      assert.match(bad.combined, /\[mismatch\] pin-17 assets\/hosts\.yaml/)
      assert.match(bad.combined, /beta · 缺 README\.md（EN 侧适配表行）/)
      assert.match(bad.combined, /beta · 缺 README\.zh-CN\.md（ZH 侧适配表行）/)
      // 仅 EN 补行 → 仍 exit 2 且只剩 ZH 侧缺失
      await writeRel(dir, 'README.md', W2_README_EN + '| **Beta** | .b/ |\n')
      const half = runCli(['pins', 'check'], dir)
      assert.equal(half.status, 2, half.combined)
      assert.doesNotMatch(half.combined, /beta · 缺 README\.md（EN 侧适配表行）/)
      assert.match(half.combined, /beta · 缺 README\.zh-CN\.md（ZH 侧适配表行）/)
    })
  })

  it('W2-B8 pin-17 映射缺失（F-W2-06 failClosed）：适配表加 gamma 但无 host_hits 数据 → exit 2 报数据债', async () => {
    await withTemp(async (dir) => {
      await makeW2Fixture(dir)
      await writeRel(dir, 'assets/release-pins.yaml', W2_PINS_YAML_HOSTS)
      await writeRel(dir, 'assets/hosts.yaml', 'version: "1"\nhosts:\n  - host_id: alpha\n  - host_id: delta\n  - host_id: gamma\n')
      const r = runCli(['pins', 'check'], dir)
      assert.equal(r.status, 2, r.combined)
      assert.match(r.combined, /host gamma 无 host_hits 映射数据（F-W2-06 failClosed/)
    })
  })

  it('W2-B9 pin-17 豁免过渡（D-23-W2-W7-EXEMPTION）：delta 双语未命中但挂 known_gaps@W7 → PASS 且输出注明过渡豁免', async () => {
    await withTemp(async (dir) => {
      await makeW2Fixture(dir)
      await writeRel(dir, 'assets/release-pins.yaml', W2_PINS_YAML_HOSTS)
      await writeRel(dir, 'assets/hosts.yaml', 'version: "1"\nhosts:\n  - host_id: alpha\n  - host_id: delta\n')
      const r = runCli(['pins', 'check'], dir)
      assert.equal(r.status, 0, r.combined)
      assert.match(r.combined, /2 宿主校验 · 1 双语命中 · 过渡豁免 delta@W7/)
    })
  })

  it('W2-B10 pin-17 豁免失陈债（F-W2-05 机检自执行）：豁免宿主双双命中 → exit 2 报债 · 豁免含适配表外 host → 同判失陈', async () => {
    await withTemp(async (dir) => {
      await makeW2Fixture(dir)
      await writeRel(dir, 'assets/release-pins.yaml', W2_PINS_YAML_HOSTS)
      // (a) 豁免宿主已双双命中（W7① 落地模拟）→ 失陈债
      await writeRel(dir, 'assets/hosts.yaml', 'version: "1"\nhosts:\n  - host_id: alpha\n  - host_id: delta\n')
      await writeRel(dir, 'README.md', W2_README_EN + '| **Delta** | .d/ |\n')
      await writeRel(dir, 'README.zh-CN.md', W2_README_ZH + '| **Delta** | .d/ |\n')
      const stale = runCli(['pins', 'check'], dir)
      assert.equal(stale.status, 2, stale.combined)
      assert.match(stale.combined, /delta（双语已双双命中 · W7① 落地 · 豁免失陈债 F-W2-05 · 须移除豁免条目）/)
      // (b) 豁免含适配表外 host → 失陈债
      await writeRel(dir, 'assets/hosts.yaml', W2_HOSTS_ALPHA)
      await writeRel(dir, 'README.md', W2_README_EN)
      await writeRel(dir, 'README.zh-CN.md', W2_README_ZH)
      const ghost = runCli(['pins', 'check'], dir)
      assert.equal(ghost.status, 2, ghost.combined)
      assert.match(ghost.combined, /delta（已不在适配表 · 须移除豁免条目）/)
    })
  })
})

// ==== 2.4-W1 pins 提取修正 fixture（D-24-PIN16-REFSTYLE / D-24-PIN17-TABLEROW / D-24-PIN08-SEMCELL） ====
// V1 对抗式验证构造固化（验收报告 §3.H/§3.I/§3.J）：三负向 fixture 修复前逐一真红（旧码 exit 0 顶包）留证。
const W1_24_PINS_YAML = [
  'version: "1"',
  'truth_source: package.json#version',
  'pins:',
  '  - id: pin-16',
  '    path: package.json',
  "    extract: { kind: files-whitelist-link }",
  "    expected: { kind: const, value: 0-miss }",
  '    required: true',
  '    fixable: false',
  '  - id: pin-17',
  '    path: assets/hosts.yaml',
  '    extract:',
  '      kind: readme-host-row',
  '      readmes: [README.md, README.zh-CN.md]',
  '      host_hits:',
  "        alpha: ['\\|\\s*\\*\\*Alpha\\*\\*']",
  "        beta: ['Beta']",
  "    expected: { kind: const, value: 0-miss }",
  '    required: true',
  '    fixable: false',
  '',
].join('\n')

const W1_24_HOSTS = 'version: "1"\nhosts:\n  - host_id: alpha\n  - host_id: beta\n'
// §3.I 基线：beta 有适配表行（合规）；tagline 枚举句同时含 Beta 裸词（供 N8 删表行对照）
const W1_24_README_EN =
  '# T\n\n13 hosts (Alpha, Beta, Zed) supported\n\n| Host | X |\n| --- | --- |\n| **Alpha** | .a/ |\n| **Beta** | .b/ |\n\nsee [G](GLOSSARY.md)\n'
const W1_24_README_ZH = '# T\n\n支持 13 宿主（Alpha、Beta、Zed）\n\n| 宿主 | X |\n| --- | --- |\n| **Alpha** | .a/ |\n| **Beta** | .b/ |\n'

/** 2.4-W1 fixture 仓：pin-16 + pin-17（alpha/beta 双语表行命中）全绿基线。 */
async function make24W1Fixture(dir: string): Promise<void> {
  await writeRel(
    dir,
    'package.json',
    JSON.stringify(
      {
        name: 'spec-wave',
        version: FIXTURE_VERSION,
        files: ['README.md', 'README.zh-CN.md', 'GLOSSARY.md'],
      },
      null,
      2,
    ) + '\n',
  )
  await writeRel(dir, 'assets/release-pins.yaml', W1_24_PINS_YAML)
  await writeRel(dir, 'assets/hosts.yaml', W1_24_HOSTS)
  await writeRel(dir, 'README.md', W1_24_README_EN)
  await writeRel(dir, 'README.zh-CN.md', W1_24_README_ZH)
  await writeRel(dir, 'GLOSSARY.md', '# G\n')
}

describe('2.4-W1 pins 提取修正 · N7 refstyle / N8 表行锚定 / N9 语义格位（D-24-* · 验收报告 §3.H/§3.I/§3.J 固化）', { concurrency: 1 }, () => {
  it('24W1-N7 pin-16 refstyle 负向（D-24-PIN16-REFSTYLE · 复现 §3.H）：[r1]: FOO.md 引用白名单外仓根 .md → exit 2 指 文件:行号 · 入 files 转绿', async () => {
    await withTemp(async (dir) => {
      await make24W1Fixture(dir)
      await writeRel(dir, 'FOO.md', '# F\n')
      await writeRel(dir, 'BAR.md', '# B\n')
      await writeRel(
        dir,
        'README.md',
        W1_24_README_EN +
          '\n[r1]: FOO.md\n[r2]: <BAR.md>\n[r3]: https://e.com/Q.md\n[r4]: #frag\n',
      )
      const bad = runCli(['pins', 'check'], dir)
      assert.equal(bad.status, 2, bad.combined)
      assert.match(bad.combined, /\[mismatch\] pin-16 package\.json/)
      assert.match(bad.combined, /README\.md:\d+ -> FOO\.md/)
      assert.match(bad.combined, /README\.md:\d+ -> BAR\.md/)
      assert.doesNotMatch(bad.combined, /Q\.md/, 'scheme URL 目标须跳过（F-W1-01）')
      // 对照：FOO.md/BAR.md 入 files[] → 转绿（§3.H 对照组口径）
      const pkg = JSON.parse(await readFile(path.join(dir, 'package.json'), 'utf8')) as {
        files: string[]
      }
      pkg.files.push('FOO.md', 'BAR.md')
      await writeRel(dir, 'package.json', JSON.stringify(pkg, null, 2) + '\n')
      const good = runCli(['pins', 'check'], dir)
      assert.equal(good.status, 0, good.combined)
      assert.match(good.combined, /\[ok\] pin-16 /)
    })
  })

  it('24W1-N8 pin-17 表行锚定负向（D-24-PIN17-TABLEROW · 复现 §3.I）：删适配表行留 tagline 枚举句 → exit 2 · 连枚举词也删对照仍 exit 2 · 补表行转绿', async () => {
    await withTemp(async (dir) => {
      await make24W1Fixture(dir)
      const base = runCli(['pins', 'check'], dir)
      assert.equal(base.status, 0, '双语表行齐时基线须绿: ' + base.combined)
      // §3.I 决定性构造：删 beta 适配表行 · 保留 tagline 枚举句 → 新口径 exit 2（修复前旧码此处 exit 0 = 顶包）
      await writeRel(dir, 'README.md', W1_24_README_EN.replace('| **Beta** | .b/ |\n', ''))
      await writeRel(dir, 'README.zh-CN.md', W1_24_README_ZH.replace('| **Beta** | .b/ |\n', ''))
      const bad = runCli(['pins', 'check'], dir)
      assert.equal(bad.status, 2, bad.combined)
      assert.match(bad.combined, /\[mismatch\] pin-17 assets\/hosts\.yaml/)
      assert.match(bad.combined, /beta · 缺 README\.md（EN 侧适配表行）/)
      assert.match(bad.combined, /beta · 缺 README\.zh-CN\.md（ZH 侧适配表行）/)
      // 对照（§3.I 对照组）：连枚举句里 Beta 也删 → 仍 exit 2
      await writeRel(dir, 'README.md', W1_24_README_EN.replace('| **Beta** | .b/ |\n', '').replace('Alpha, Beta, Zed', 'Alpha, Zed'))
      await writeRel(dir, 'README.zh-CN.md', W1_24_README_ZH.replace('| **Beta** | .b/ |\n', '').replace('Alpha、Beta、Zed', 'Alpha、Zed'))
      const stripped = runCli(['pins', 'check'], dir)
      assert.equal(stripped.status, 2, stripped.combined)
      assert.match(stripped.combined, /beta · 缺 README\.md（EN 侧适配表行）/)
      // 正向：表行恢复 → 转绿
      await writeRel(dir, 'README.md', W1_24_README_EN)
      await writeRel(dir, 'README.zh-CN.md', W1_24_README_ZH)
      const good = runCli(['pins', 'check'], dir)
      assert.equal(good.status, 0, good.combined)
      assert.match(good.combined, /\[ok\] pin-17 /)
    })
  })

  it('24W1-N9 pin-08 语义格位锁定负向（D-24-PIN08-SEMCELL · 复现 §3.J lead）：状态格改坏 · 同行归档链接保留 X_Y_Z 形态 → exit 2 · 改回转绿 · 下划线式状态格不计入', async () => {
    await withTemp(async (dir) => {
      await makeFixture(dir)
      const brokenStatus =
        '| slug | 路径 | 状态 | 一句话 |' + '\n' +
        '| --- | --- | --- | --- |' + '\n' +
        '| `' + FIXTURE_VERSION + '`（patch 收尾行） | — | **`9.9.9` published** | 归档 [A](../roadmap/ACCEPTANCE_' +
        FIXTURE_VERSION.replace(/\./g, '_') + '_zh.md) |' + '\n' +
        '| x-y | — | signed | 叙事顺带提及 spec-wave@' + FIXTURE_VERSION + ' |' + '\n'
      await writeRel(dir, 'docs/spec/README.md', brokenStatus)
      // §3.J lead 实验：状态格 9.9.9 · 同行归档链接 3_1_4 + 别行 prose 3.1.4 仍在 → 新口径 exit 2（修复前旧码 exit 0）
      const bad = runCli(['pins', 'check'], dir)
      assert.equal(bad.status, 2, bad.combined)
      assert.match(bad.combined, /\[mismatch\] pin-08 docs\/spec\/README\.md/)
      // 改回状态格点式版本串（同行归档链接 X_Y_Z 保留 · 证明状态格点式串即真值）→ 转绿
      await writeRel(dir, 'docs/spec/README.md', brokenStatus.replace('`9.9.9` published', '`' + FIXTURE_VERSION + '` published'))
      const good = runCli(['pins', 'check'], dir)
      assert.equal(good.status, 0, good.combined)
      assert.match(good.combined, /\[ok\] pin-08 /)
      // 回归锁：状态格只写下划线式 X_Y_Z → 不计入版本串（slug/文件名顶包排除）→ exit 2
      await writeRel(dir, 'docs/spec/README.md', brokenStatus.replace('`9.9.9` published', FIXTURE_VERSION.replace(/\./g, '_') + ' published'))
      const under = runCli(['pins', 'check'], dir)
      assert.equal(under.status, 2, under.combined)
      assert.match(under.combined, /\[mismatch\] pin-08 docs\/spec\/README\.md/)
    })
  })
})

// ==== 2.4-W6 N10 pin-16 大小写口径 fixture（D-24-W6-N10 · 验收报告 §3.K 固化） ====
// §3.K 假阳修复前留证：链接 foo.md · 盘上 FOO.md · 白名单含 FOO.md → 旧码 macOS 假红 exit 2
// （本棒 30 开工时 mktemp fixture 实测复现）。新口径 = 大小写不敏感比较 + 磁盘存在性
// （仓根条目快照 · 同为大小写不敏感）二次确认最终判据 → 双平台语义一致。
const W6_PINS_YAML = [
  'version: "1"',
  'truth_source: package.json#version',
  'pins:',
  '  - id: pin-16',
  '    path: package.json',
  "    extract: { kind: files-whitelist-link }",
  "    expected: { kind: const, value: 0-miss }",
  '    required: true',
  '    fixable: false',
  '',
].join('\n')

/** W6 fixture 仓：仅 pin-16 · files 白名单由入参给定。 */
async function makeW6Fixture(dir: string, files: string[]): Promise<void> {
  await writeRel(
    dir,
    'package.json',
    JSON.stringify({ name: 'spec-wave', version: FIXTURE_VERSION, files }, null, 2) + '\n',
  )
  await writeRel(dir, 'assets/release-pins.yaml', W6_PINS_YAML)
}

describe('2.4-W6 N10 · pin-16 白名单大小写口径统一（D-24-W6-N10 · §3.K · 双平台语义一致）', { concurrency: 1 }, () => {
  it('24W6-N10a 正向双向：链接 foo.md vs 盘上+白名单 FOO.md → PASS；反向 链接 BAR.md vs 盘上+白名单 bar.md → PASS', async () => {
    await withTemp(async (dir) => {
      await makeW6Fixture(dir, ['README.md', 'FOO.md'])
      await writeRel(dir, 'FOO.md', '# F\n')
      await writeRel(dir, 'README.md', '# T\n\nsee [f](foo.md)\n')
      const r = runCli(['pins', 'check'], dir)
      assert.equal(r.status, 0, '大小写差异合法样本不得假红（§3.K）: ' + r.combined)
      assert.match(r.combined, /\[ok\] pin-16 /)
      assert.match(r.combined, /PINS: PASS/)
    })
    await withTemp(async (dir) => {
      await makeW6Fixture(dir, ['README.md', 'bar.md'])
      await writeRel(dir, 'bar.md', '# B\n')
      await writeRel(dir, 'README.md', '# T\n\nsee [b](BAR.md)\n')
      const r = runCli(['pins', 'check'], dir)
      assert.equal(r.status, 0, '反向大小写差异（链接大写 · 盘上小写）同口径放行: ' + r.combined)
      assert.match(r.combined, /\[ok\] pin-16 /)
    })
  })

  it('24W6-N10b 负向对照（F-W6-01 不误放）：白名单含 GHOST.md 但盘上无任何大小写变体 → exit 2 指 文件:行号 -> ghost.md', async () => {
    await withTemp(async (dir) => {
      await makeW6Fixture(dir, ['README.md', 'GHOST.md'])
      await writeRel(dir, 'README.md', '# T\n\nsee [g](ghost.md)\n')
      const r = runCli(['pins', 'check'], dir)
      assert.equal(r.status, 2, '白名单命中但盘上无变体 → 不放行（磁盘存在性为最终判据）: ' + r.combined)
      assert.match(r.combined, /\[mismatch\] pin-16 package\.json/)
      assert.match(r.combined, /README\.md:3 -> ghost\.md/)
      assert.match(r.combined, /F-W6-01 不放行/)
    })
  })

  it('24W6-N10c 回归：白名单外不存在目标仍不判（F-W2-07 口径保持）· 白名单外存在目标仍 exit 2（W2-B2 口径保持）', async () => {
    await withTemp(async (dir) => {
      await makeW6Fixture(dir, ['README.md'])
      await writeRel(dir, 'README.md', '# T\n\nsee [g](GONE.md)\n')
      const gone = runCli(['pins', 'check'], dir)
      assert.equal(gone.status, 0, 'F-W2-07：白名单外不存在目标不判: ' + gone.combined)
      await writeRel(dir, 'FOO.md', '# F\n')
      await writeRel(dir, 'README.md', '# T\n\nsee [f](FOO.md)\n')
      const bad = runCli(['pins', 'check'], dir)
      assert.equal(bad.status, 2, '盘上存在但白名单外（无大小写变体命中）→ 仍 exit 2: ' + bad.combined)
      assert.match(bad.combined, /README\.md:3 -> FOO\.md/)
    })
  })
})

describe('W1-A1 release pins · C组 声明源数据形态（SPEC 01 §5 · D-PINS-SCOPE-8）', { concurrency: 1 }, () => {
  type PinRow = {
    id: string
    path: string
    extract: {
      kind: string
      semantics?: string
      readmes?: string[]
      host_hits?: Record<string, string[]>
      known_gaps?: Array<{ host_id: string; since_wave?: string; until_wave?: string; note?: string }>
    }
    expected: { kind: string }
    required: boolean
    fixable: boolean
  }
  const data = yamlLoad(readFileSync(PINS_YAML, 'utf8')) as { pins: PinRow[] }

  it('钉面 17 行齐全：pin-01..pin-17 唯一 id · 全部 required（2.2 W6 增 pin-11/12 · 2.3 W1 增 pin-13/14/15 · 2.3 W2 增 pin-16/17 两新 kind）', () => {
    const ids = data.pins.map((p) => p.id)
    assert.deepEqual(ids, [
      'pin-01',
      'pin-02',
      'pin-03',
      'pin-04',
      'pin-05',
      'pin-06',
      'pin-07',
      'pin-08',
      'pin-09',
      'pin-10',
      'pin-11',
      'pin-12',
      'pin-13',
      'pin-14',
      'pin-15',
      'pin-16',
      'pin-17',
    ])
    assert.equal(new Set(ids).size, 17)
    for (const p of data.pins) assert.equal(p.required, true, p.id + ' 须 required')
  })

  it('fixable 面：pin-03/04/05/06/07 + W6 新增 pin-11/12 + 2.3 W1 新增 pin-13/14/15 可修；真值源/bin/git/spec 索引/W2 两新钉不可修', () => {
    const fixable = Object.fromEntries(data.pins.map((p) => [p.id, p.fixable]))
    assert.deepEqual(fixable, {
      'pin-01': false,
      'pin-02': false,
      'pin-03': true,
      'pin-04': true,
      'pin-05': true,
      'pin-06': true,
      'pin-07': true,
      'pin-08': false,
      'pin-09': false,
      'pin-10': false,
      'pin-11': true,
      'pin-12': true,
      'pin-13': true,
      'pin-14': true,
      'pin-15': true,
      'pin-16': false,
      'pin-17': false,
    })
  })

  it('2.2 W6 新增 pin-11/12：host-adapt README 版本文案落点（新宿主相关 · 数据声明）', () => {
    const p11 = data.pins.find((p) => p.id === 'pin-11')!
    const p12 = data.pins.find((p) => p.id === 'pin-12')!
    assert.equal(p11.path, 'assets/ide/host-adapt/README.md')
    assert.equal(p11.extract.kind, 'regex-all')
    assert.equal(p11.expected.kind, 'package-version')
    assert.equal(p12.path, 'assets/ide/host-adapt/README.md')
    assert.equal(p12.extract.kind, 'regex')
    assert.equal(p12.expected.kind, 'package-version')
  })

  it('钉面 #8 提取语义入数据（D-PINS-SCOPE-8 + 2.4-W1 D-24-PIN08-SEMCELL 语义格位锁定）：spec-index-row + 状态列点式唯一真值', () => {
    const p8 = data.pins.find((p) => p.id === 'pin-08')!
    assert.equal(p8.path, 'docs/spec/README.md')
    assert.equal(p8.extract.kind, 'spec-index-row')
    assert.match(p8.extract.semantics ?? '', /语义格位口径/)
    assert.match(p8.extract.semantics ?? '', /状态列（cells\[2\]/)
    assert.match(p8.extract.semantics ?? '', /点式 X\.Y\.Z/)
    assert.match(p8.extract.semantics ?? '', /X_Y \/ X_Y_Z 一律不计入版本串/)
    assert.match(p8.extract.semantics ?? '', /兜底嫌疑行/)
    // F-W1-05 定稿（2.4-W1 task 定稿位回填）：「规划中」类非发布态行口径入数据
    assert.match(p8.extract.semantics ?? '', /规划中.*行身份合格|行身份合格.*规划中/s)
  })

  it('2.3 W1 新增 pin-13/14/15：CHANGELOG 发布头 / MIGRATION spec-wave@X / AGENTS npx spec-wave@X 三面入钉（纯数据 · [A]#8）', () => {
    const p13 = data.pins.find((p) => p.id === 'pin-13')!
    const p14 = data.pins.find((p) => p.id === 'pin-14')!
    const p15 = data.pins.find((p) => p.id === 'pin-15')!
    assert.equal(p13.path, 'CHANGELOG.md')
    assert.equal(p13.extract.kind, 'regex')
    assert.equal(p14.path, 'MIGRATION.md')
    assert.equal(p14.extract.kind, 'regex-all')
    assert.equal(p15.path, 'AGENTS.md')
    assert.equal(p15.extract.kind, 'regex-all')
    for (const p of [p13, p14, p15]) assert.equal(p.expected.kind, 'package-version')
  })

  it('2.3 W2 新增 pin-16/17：files-whitelist-link / readme-host-row 两新 kind（D-23-W2-CHECK-FORM · 语义/映射/豁免全入数据）', () => {
    const p16 = data.pins.find((p) => p.id === 'pin-16')!
    const p17 = data.pins.find((p) => p.id === 'pin-17')!
    assert.equal(p16.path, 'package.json')
    assert.equal(p16.extract.kind, 'files-whitelist-link')
    assert.equal(p16.expected.kind, 'const')
    assert.match(p16.extract.semantics ?? '', /仓根级/)
    assert.match(p16.extract.semantics ?? '', /npm 自动入包/)
    assert.equal(p17.path, 'assets/ide/host-adapt/examples/mvp-hosts.yaml')
    assert.equal(p17.extract.kind, 'readme-host-row')
    assert.equal(p17.expected.kind, 'const')
    assert.deepEqual(p17.extract.readmes, ['README.md', 'README.zh-CN.md'])
    // host_hits 覆盖适配表 13 宿主（F-W2-04 逐宿主核对入数据 · 2.3 W6 +6 词锚 D-23-W6-ANCHOR · 正则逐字断言防 YAML 转义静默）
    assert.deepEqual(Object.keys(p17.extract.host_hits ?? {}).sort(), [
      'agents',
      'claude',
      'copilot',
      'cursor',
      'codex',
      'dsh',
      'windsurf',
      'gemini',
      'opencode',
      'roo',
      'zed',
      'cline',
      'aider',
    ].sort())
    assert.equal(p17.extract.host_hits?.cursor?.[0], '\\|\\s*\\*\\*Cursor\\*\\*')
    // 2.3 W6 词锚逐字断言（D-23-W6-ANCHOR：roo 须带 Code 防 projectRoot 误伤 · zed 大写防 materialized 误伤）
    assert.deepEqual(p17.extract.host_hits?.gemini, ['Gemini'])
    assert.deepEqual(p17.extract.host_hits?.opencode, ['opencode'])
    assert.deepEqual(p17.extract.host_hits?.roo, ['Roo Code'])
    assert.deepEqual(p17.extract.host_hits?.zed, ['Zed'])
    assert.deepEqual(p17.extract.host_hits?.cline, ['Cline'])
    assert.deepEqual(p17.extract.host_hits?.aider, ['aider'])
    // known_gaps 清零（2.3-W7① 关账：根 README 双语 13 行落地 · 三旧+六新九条过渡豁免全摘 ·
    // 失陈债机检自执行强制 —— 中间态 exit 2 实证见 task_2_3_wiring_w7_dx_health 自检结论）；
    // 机制保留：未来新宿主过渡仍可挂 until_wave 条目
    const gaps = p17.extract.known_gaps ?? []
    assert.deepEqual(gaps, [], 'W7① 已关账：pin-17 known_gaps 必须为空（13 宿主双语全命中 · 零豁免）')
  })

  it('无 S2 落点（docs/tasks · docs/harness/reviews · docs/harness/invokes/by-task）', () => {
    const S2 = ['docs/tasks', 'docs/harness/reviews', 'docs/harness/invokes/by-task']
    for (const p of data.pins) {
      const n = p.path.replace(/\\/g, '/')
      for (const seg of S2) {
        assert.equal(
          n === seg || n.startsWith(seg + '/'),
          false,
          p.id + ' 落点 ' + n + ' 命中 S2 ' + seg,
        )
      }
    }
  })
})
