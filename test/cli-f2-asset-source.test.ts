import assert from 'node:assert/strict'
import { mkdtemp, rm, mkdir, writeFile } from 'node:fs/promises'
import { readFileSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { describe, it } from 'node:test'
import { fileURLToPath } from 'node:url'
import { CliError } from '../src/cli-shared.ts'
import { cmdDiscipline, cmdLifecycle } from '../src/cli-lifecycle.ts'
import { yamlLoad } from '../src/yaml.ts'

const KIT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const PKG_DISCIPLINE = path.join(KIT, 'assets', 'harness', 'discipline-coverage.yaml')
const PKG_LIFECYCLE = path.join(KIT, 'assets', 'harness', 'lifecycle.yaml')

// 3.0 W3 · S4.3 F2 真口径（验收 #4 · O3）：discipline/lifecycle show 改读消费者资产。
// 三层解析优先级（existsSync 逐层探测）：
//   1. <target>/assets/harness/<name>（消费者资产 · O3 真口径 —— 本仓即 dogfood 实例）
//   2. <target>/.coding-kit/assets/harness/<name>（布局内消费者资产 · KIT_LAYOUT_DIR）
//   3. packageRoot()/assets/harness/<name>（包内自述兜底 · 命中时输出来源标注行 source: package-fallback）
// 解析失败纪律：三层均缺 → exit 2 fail-closed；消费者资产存在但 YAML 解析失败/校验失败 → exit 2
// 点名该路径（坏资产即红 · 不得静默回退包内件）。
// 机检一致（验收 #4）：--json 输出与所读 yaml 解析结果 deep-equal；human 计数与 yaml 重算一致。

type RunResult = { status: number; stdout: string; stderr: string; combined: string }

// 进程内直调（E3 下沉口径同 test/cli-g1g7.test.ts makeCore · 零子进程）
function makeCore(fn: (args: string[]) => Promise<void>): (args: string[]) => Promise<RunResult> {
  return async (args) => {
    const out: string[] = []
    const err: string[] = []
    const origLog = console.log
    const origError = console.error
    const origWrite = process.stdout.write
    console.log = (...a: unknown[]) => {
      out.push(a.map(String).join(' '))
    }
    console.error = (...a: unknown[]) => {
      err.push(a.map(String).join(' '))
    }
    process.stdout.write = ((chunk: unknown) => {
      out.push(String(chunk).replace(/\n$/, ''))
      return true
    }) as typeof process.stdout.write
    let status = 0
    try {
      await fn(args)
    } catch (e) {
      if (e instanceof CliError) {
        status = e.exitCode
        if (e.message) err.push(e.message)
      } else {
        throw e
      }
    } finally {
      console.log = origLog
      console.error = origError
      process.stdout.write = origWrite
    }
    const stdout = out.length > 0 ? out.join('\n') + '\n' : ''
    const stderr = err.length > 0 ? err.join('\n') + '\n' : ''
    return { status, stdout, stderr, combined: `${stdout}\n${stderr}` }
  }
}

const runDiscipline = makeCore(cmdDiscipline)
const runLifecycle = makeCore(cmdLifecycle)

async function withTemp(fn: (dir: string) => Promise<void>): Promise<void> {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'spec-wave-f2-source-'))
  try {
    await fn(dir)
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
}

// 消费者改造版 coverage（篡改：status 分布与包内版不同 · 证真口径生效）
const CONSUMER_COVERAGE = [
  'version: "1"',
  'as_of_package_version: "9.9.9-consumer"',
  'scope: "consumer-fixture"',
  'statements:',
  '  - id: C1',
  '    source: fixture',
  '    summary: 消费者资产第一条',
  '    status: mechanical',
  '  - id: C2',
  '    source: fixture',
  '    summary: 消费者资产第二条',
  '    status: partial',
  'gaps: []',
  '',
].join('\n')

const CONSUMER_LIFECYCLE = [
  'version: "9-consumer"',
  'states:',
  '  - id: consumer_draft',
  '    note: 消费者态',
  '  - id: consumer_done',
  'transitions:',
  '  - id: consumer_go',
  '    from: [consumer_draft]',
  '    to: consumer_done',
  '    hat: "30-execute-code"',
  '    guards:',
  '      - id: consumer_guard',
  '        command_or_check: fixture-check',
  '        severity: warn',
  '',
].join('\n')

async function seedConsumer(dir: string, rel: string, body: string): Promise<string> {
  const abs = path.join(dir, rel)
  await mkdir(path.dirname(abs), { recursive: true })
  await writeFile(abs, body)
  return abs
}

describe('3.0-W3 S4.3 · F2 真口径（discipline/lifecycle show 消费者资产三层解析）', { concurrency: 1 }, () => {
  it('来源正 fixture · 第 1 层：消费者仓 assets/harness 存在 → 读消费者版（--json deep-equal 所读 yaml · 计数重算一致 · source 行点名）', async () => {
    await withTemp(async (dir) => {
      await seedConsumer(dir, 'assets/harness/discipline-coverage.yaml', CONSUMER_COVERAGE)
      const json = await runDiscipline(['show', '--target', dir, '--json'])
      assert.equal(json.status, 0, json.combined)
      const parsed = JSON.parse(json.stdout)
      assert.deepEqual(parsed, yamlLoad(CONSUMER_COVERAGE), '--json 输出须与所读消费者 yaml deep-equal')
      const human = await runDiscipline(['show', '--target', dir])
      assert.equal(human.status, 0, human.combined)
      assert.match(human.stdout, /source: assets\/harness\/discipline-coverage\.yaml/)
      assert.match(human.stdout, /as_of: 9\.9\.9-consumer/, '输出须反映消费者版而非包内版')
      assert.match(human.stdout, /## statements \(2\)/)
      assert.match(human.stdout, /- mechanical: 1/)
      assert.match(human.stdout, /- partial: 1/)
      assert.match(human.stdout, /- \[mechanical\] C1: 消费者资产第一条/, 'sample ⊆ statements[].id')
      assert.match(human.stdout, /注: SoT = assets\/harness\/discipline-coverage\.yaml · show 只读/)
    })
  })

  it('来源正 fixture · 第 2 层：布局内 .coding-kit/assets/harness 命中 → 读布局版（lifecycle show 同口径 · states/transitions ⊆ yaml）', async () => {
    await withTemp(async (dir) => {
      await seedConsumer(dir, '.coding-kit/assets/harness/lifecycle.yaml', CONSUMER_LIFECYCLE)
      const json = await runLifecycle(['show', '--target', dir, '--json'])
      assert.equal(json.status, 0, json.combined)
      assert.deepEqual(JSON.parse(json.stdout), yamlLoad(CONSUMER_LIFECYCLE), '--json 与布局版 yaml deep-equal')
      const human = await runLifecycle(['show', '--target', dir])
      assert.equal(human.status, 0, human.combined)
      assert.match(human.stdout, /source: \.coding-kit\/assets\/harness\/lifecycle\.yaml/)
      assert.match(human.stdout, /lifecycle v9-consumer/)
      assert.match(human.stdout, /- consumer_draft · 消费者态/, 'states ⊆ yaml')
      assert.match(human.stdout, /### consumer_go · consumer_draft → consumer_done · hat=30-execute-code/, 'transitions ⊆ yaml')
    })
  })

  it('优先级：第 1 层与第 2 层同时在 → 读第 1 层（消费者资产优先）', async () => {
    await withTemp(async (dir) => {
      await seedConsumer(dir, 'assets/harness/lifecycle.yaml', CONSUMER_LIFECYCLE)
      await seedConsumer(dir, '.coding-kit/assets/harness/lifecycle.yaml', CONSUMER_LIFECYCLE.replace('v9-consumer', 'v8-layout'))
      const r = await runLifecycle(['show', '--target', dir])
      assert.equal(r.status, 0, r.combined)
      assert.match(r.stdout, /lifecycle v9-consumer/)
      assert.match(r.stdout, /source: assets\/harness\/lifecycle\.yaml/)
    })
  })

  it('来源误 fixture · 第 3 层 fallback：消费者资产未找到 → 包内自述 + package-fallback 标注行（诚实口径 · 不假装读到消费者资产）', async () => {
    await withTemp(async (dir) => {
      const json = await runDiscipline(['show', '--target', dir, '--json'])
      assert.equal(json.status, 0, json.combined)
      assert.deepEqual(
        JSON.parse(json.stdout),
        yamlLoad(readFileSync(PKG_DISCIPLINE, 'utf8')),
        'fallback 层 --json 与包内自述 yaml deep-equal',
      )
      const human = await runDiscipline(['show', '--target', dir])
      assert.equal(human.status, 0, human.combined)
      assert.match(human.stdout, /source: package-fallback（消费者资产未找到 · 显示包内自述口径）/)
      assert.match(human.stdout, /注: SoT = 包内 assets\/harness\/discipline-coverage\.yaml（package-fallback）· show 只读/)
      const life = await runLifecycle(['show', '--target', dir])
      assert.equal(life.status, 0, life.combined)
      assert.match(life.stdout, /source: package-fallback（消费者资产未找到 · 显示包内自述口径）/)
    })
  })

  it('坏资产即红 · 消费者 YAML 解析失败 → exit 2 点名该路径（不得静默回退包内件）', async () => {
    await withTemp(async (dir) => {
      await seedConsumer(dir, 'assets/harness/discipline-coverage.yaml', 'statements: [unclosed\n')
      const r = await runDiscipline(['show', '--target', dir])
      assert.equal(r.status, 2, r.combined)
      assert.match(r.combined, /解析失败/)
      assert.match(r.combined, /discipline-coverage\.yaml/)
      assert.doesNotMatch(r.stdout, /as_of: 2\.4\.2/, '不得静默回退包内版')
    })
  })

  it('坏资产即红 · 消费者 YAML 校验失败（缺 statements）→ exit 2 点名 · lifecycle 缺 states/transitions 同', async () => {
    await withTemp(async (dir) => {
      await seedConsumer(dir, 'assets/harness/discipline-coverage.yaml', 'version: "1"\nas_of_package_version: "9.9.9"\n')
      const r = await runDiscipline(['show', '--target', dir])
      assert.equal(r.status, 2, r.combined)
      assert.match(r.combined, /校验失败/)
      assert.match(r.combined, /discipline-coverage\.yaml/)
      await seedConsumer(dir, 'assets/harness/lifecycle.yaml', 'version: "1"\nstates: []\n')
      const r2 = await runLifecycle(['show', '--target', dir])
      assert.equal(r2.status, 2, r2.combined)
      assert.match(r2.combined, /校验失败/)
      assert.match(r2.combined, /lifecycle\.yaml/)
    })
  })

  it('--target 缺省 = cwd（本仓 dogfood · 第 1 层命中仓根 assets/harness → source 行点名消费者资产）', async () => {
    // in-process 直调 process.cwd() = KIT · 本仓 assets/harness/ tracked 在案 = 消费者资产第 1 层
    const r = await runDiscipline(['show'])
    assert.equal(r.status, 0, r.combined)
    assert.match(r.stdout, /source: assets\/harness\/discipline-coverage\.yaml/)
    const life = await runLifecycle(['show'])
    assert.equal(life.status, 0, life.combined)
    assert.match(life.stdout, /source: assets\/harness\/lifecycle\.yaml/)
  })

  it('help 行同步：discipline/lifecycle show 用法含 [--target PATH]', async () => {
    const d = await runDiscipline(['--help'])
    assert.equal(d.status, 0, d.combined)
    assert.match(d.stdout, /discipline show \[--target PATH\] \[--json\]/)
    const l = await runLifecycle(['--help'])
    assert.equal(l.status, 0, l.combined)
    assert.match(l.stdout, /lifecycle show \[--target PATH\] \[--json\]/)
  })
})
