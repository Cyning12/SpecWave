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
      '| x-y | — | **' + FIXTURE_VERSION + ' published** | z |' + '\n',
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

  it('B4 fix --yes：写回真值 · 留 .bak（旧值）· 复跑幂等（0 修改 · 备份不被覆写）', async () => {
    await withTemp(async (dir) => {
      await makeFixture(dir)
      await writeRel(dir, 'assets/ontology.yaml', BROKEN_ONTOLOGY)
      const r = runCli(['pins', 'fix', '--yes'], dir)
      assert.equal(r.status, 0, r.combined)
      const fixed = await readFile(path.join(dir, 'assets/ontology.yaml'), 'utf8')
      assert.equal(fixed, GOOD_ONTOLOGY)
      const bak = await readFile(path.join(dir, 'assets/ontology.yaml.bak'), 'utf8')
      assert.equal(bak, BROKEN_ONTOLOGY, '.bak 须保留写前旧值')
      const check = runCli(['pins', 'check'], dir)
      assert.equal(check.status, 0, check.combined)
      const again = runCli(['pins', 'fix', '--yes'], dir)
      assert.equal(again.status, 0, again.combined)
      assert.match(again.combined, /0 处|无偏差|nothing/i)
      const bak2 = await readFile(path.join(dir, 'assets/ontology.yaml.bak'), 'utf8')
      assert.equal(bak2, BROKEN_ONTOLOGY, '幂等复跑不得覆写既有备份')
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
      const bak = await readFile(path.join(dir, 'assets/ide/host-adapt/README.md.bak'), 'utf8')
      assert.equal(bak, DUAL_BROKEN, '.bak 须保留写前旧值且同文件只备份一次')
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

describe('W1-A1 release pins · C组 声明源数据形态（SPEC 01 §5 · D-PINS-SCOPE-8）', { concurrency: 1 }, () => {
  type PinRow = {
    id: string
    path: string
    extract: { kind: string; semantics?: string }
    expected: { kind: string }
    required: boolean
    fixable: boolean
  }
  const data = yamlLoad(readFileSync(PINS_YAML, 'utf8')) as { pins: PinRow[] }

  it('钉面 12 行齐全：pin-01..pin-12 唯一 id · 全部 required（2.2 W6 数据增 pin-11/12 · 只动数据不改 pins 代码）', () => {
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
    ])
    assert.equal(new Set(ids).size, 12)
    for (const p of data.pins) assert.equal(p.required, true, p.id + ' 须 required')
  })

  it('fixable 面：pin-03/04/05/06/07 + W6 新增 pin-11/12 可修；真值源/bin/git/spec 索引不可修', () => {
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

  it('钉面 #8 提取语义入数据（D-PINS-SCOPE-8）：spec-index-row + 「当前 minor 对应行或标注行」', () => {
    const p8 = data.pins.find((p) => p.id === 'pin-08')!
    assert.equal(p8.path, 'docs/spec/README.md')
    assert.equal(p8.extract.kind, 'spec-index-row')
    assert.match(p8.extract.semantics ?? '', /当前 minor/)
    assert.match(p8.extract.semantics ?? '', /对应行或标注行/)
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
