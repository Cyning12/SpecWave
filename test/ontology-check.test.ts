import assert from 'node:assert/strict'
import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { readFileSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { describe, it } from 'node:test'
import { fileURLToPath } from 'node:url'
import { CliError } from '../src/cli-shared.ts'
import { cmdGraph } from '../src/cli-graph.ts'

const KIT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const PKG_VERSION = (JSON.parse(readFileSync(path.join(KIT, 'package.json'), 'utf8')) as { version: string }).version

// 3.0 W3 · S4.1 A4 ontology-check 接线（验收 #1）：SHACL 语义子集校验器双向 fixture。
// 红测先行（负 fixture 先红后绿 · 硬约束 6 修严型负向锁）：
//   负向 ≥4 —— RelationShape 未声明类引用 / minCount 缺端点 / pattern 违 / AxiomShape 命名空间 /
//   GateShape 未声明帽 / ClassShape 唯一性 —— 报红点名形状 exit 2；合规报绿 exit 0；
//   VersionShape 恒 Warning 不咬 exit（单源划界 pin-03 · F-W3-11）；不可读/解析失败 exit 2（fail-closed）。
// --json 键集钉死（task S4.1 定稿键集）：{command, ontology, profile, shapes, entities, conforms, violations:[{shape, where, message, severity}]}。

type RunResult = { status: number; stdout: string; stderr: string; combined: string }

// 进程内直调 cmdGraph（E3 下沉口径同 test/cli-g1g7.test.ts makeCore · 零子进程）
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

const runGraph = makeCore(cmdGraph)

async function withTemp(fn: (dir: string) => Promise<void>): Promise<void> {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'spec-wave-onto-check-'))
  try {
    await fn(dir)
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
}

// 合规基件（五形状全绿 · product_semver 对齐本包 version 以隔离 VersionShape 观察项）
function conformingOntology(): string {
  return [
    'version: "1"',
    `product_semver: "${PKG_VERSION}"`,
    'license: MIT',
    'classes:',
    '  - id: DisciplinePackage',
    '    domain: Package',
    '  - id: BusinessRepository',
    '    domain: Instance',
    '  - id: Task',
    '    domain: Instance',
    '  - id: Hat',
    '    domain: Instance',
    '  - id: HumanGate',
    '    domain: Instance',
    'relations:',
    '  - id: embedsInto',
    '    subject: DisciplinePackage',
    '    object: BusinessRepository',
    '    cardinality: "1..*"',
    '  - id: blocks',
    '    subject: HumanGate',
    '    object: Hat',
    '    cardinality: "1..*"',
    '  - id: hasGate',
    '    subject: Task',
    '    object: HumanGate',
    '    cardinality: "1..*"',
    'axioms:',
    '  - id: ONTO-P1',
    '    text: "纪律包不含业务代码与 LLM Runtime"',
    'starter_hats:',
    '  - hat_id: "30-execute-code"',
    '    role: ExecuteHat',
    'extended_hats:',
    '  - hat_id: "00-orchestrator"',
    '    role: OrchestratorHat',
    'human_gates:',
    '  - id: HG-AUDIT-R1',
    '    blocks_hats: ["30-execute-code"]',
    '',
  ].join('\n')
}

async function writeFixture(dir: string, body: string): Promise<string> {
  const file = path.join(dir, 'ontology.yaml')
  await writeFile(file, body)
  return file
}

describe('3.0-W3 S4.1 · graph ontology check（SHACL 语义子集校验器接线）', { concurrency: 1 }, () => {
  it('合规件报绿 exit 0 · --json 键集钉死（profile 显式声明 · violations 空）', async () => {
    await withTemp(async (dir) => {
      const file = await writeFixture(dir, conformingOntology())
      const human = await runGraph(['ontology', 'check', '--file', file])
      assert.equal(human.status, 0, human.combined)
      assert.match(human.combined, /profile: spec-wave-shacl-subset\/v1/)
      assert.match(human.combined, /conforms: true/)

      const json = await runGraph(['ontology', 'check', '--file', file, '--json'])
      assert.equal(json.status, 0, json.combined)
      const report = JSON.parse(json.stdout) as Record<string, unknown>
      assert.deepEqual(Object.keys(report), [
        'command',
        'ontology',
        'profile',
        'shapes',
        'entities',
        'conforms',
        'violations',
      ])
      assert.equal(report.command, 'graph ontology check')
      assert.equal(report.profile, 'spec-wave-shacl-subset/v1')
      assert.deepEqual(report.shapes, ['ClassShape', 'RelationShape', 'AxiomShape', 'GateShape', 'VersionShape'])
      assert.deepEqual(Object.keys(report.entities as Record<string, unknown>), ['classes', 'relations', 'axioms', 'gates'])
      assert.deepEqual(report.entities, { classes: 5, relations: 3, axioms: 1, gates: 1 })
      assert.equal(report.conforms, true)
      assert.deepEqual(report.violations, [])
    })
  })

  it('负向 1 · RelationShape 未声明类引用（删 Hat 声明）→ 报红点名 exit 2', async () => {
    await withTemp(async (dir) => {
      const drifted = conformingOntology().replace('  - id: Hat\n    domain: Instance\n', '')
      const file = await writeFixture(dir, drifted)
      const r = await runGraph(['ontology', 'check', '--file', file])
      assert.equal(r.status, 2, r.combined)
      assert.match(r.combined, /\[VIOLATION\] RelationShape @ relations\[1\]\.object :: .*未声明的类: Hat/)
      assert.match(r.combined, /conforms: false/)

      const json = await runGraph(['ontology', 'check', '--file', file, '--json'])
      assert.equal(json.status, 2, json.combined)
      const report = JSON.parse(json.stdout) as { conforms: boolean; violations: Record<string, unknown>[] }
      assert.equal(report.conforms, false)
      assert.deepEqual(Object.keys(report.violations[0]!), ['shape', 'where', 'message', 'severity'])
      assert.equal(report.violations[0]!.severity, 'Violation')
      assert.equal(report.violations[0]!.shape, 'RelationShape')
    })
  })

  it('负向 2 · RelationShape minCount（缺 subject 端点）→ 报红点名 exit 2', async () => {
    await withTemp(async (dir) => {
      const drifted = conformingOntology().replace('    subject: HumanGate\n', '')
      const file = await writeFixture(dir, drifted)
      const r = await runGraph(['ontology', 'check', '--file', file])
      assert.equal(r.status, 2, r.combined)
      assert.match(r.combined, /\[VIOLATION\] RelationShape @ relations\[1\]\.subject :: sh:minCount 1 违反/)
    })
  })

  it('负向 3 · RelationShape pattern（cardinality 违模式）→ 报红点名 exit 2', async () => {
    await withTemp(async (dir) => {
      const drifted = conformingOntology().replace('cardinality: "1..*"\n  - id: blocks', 'cardinality: "many"\n  - id: blocks')
      const file = await writeFixture(dir, drifted)
      const r = await runGraph(['ontology', 'check', '--file', file])
      assert.equal(r.status, 2, r.combined)
      assert.match(r.combined, /\[VIOLATION\] RelationShape @ relations\[0\]\.cardinality :: sh:pattern 违反: many/)
    })
  })

  it('负向 4 · AxiomShape（id 去 ONTO- 前缀）→ 报红点名 exit 2', async () => {
    await withTemp(async (dir) => {
      const drifted = conformingOntology().replace('  - id: ONTO-P1', '  - id: P1')
      const file = await writeFixture(dir, drifted)
      const r = await runGraph(['ontology', 'check', '--file', file])
      assert.equal(r.status, 2, r.combined)
      assert.match(r.combined, /\[VIOLATION\] AxiomShape @ axioms\[0\]\.id :: sh:pattern 违反: P1/)
    })
  })

  it('负向 5 · GateShape（blocks_hats 塞未声明帽）→ 报红点名 exit 2', async () => {
    await withTemp(async (dir) => {
      const drifted = conformingOntology().replace('blocks_hats: ["30-execute-code"]', 'blocks_hats: ["30-execute-code", "99-nonexistent"]')
      const file = await writeFixture(dir, drifted)
      const r = await runGraph(['ontology', 'check', '--file', file])
      assert.equal(r.status, 2, r.combined)
      assert.match(r.combined, /\[VIOLATION\] GateShape @ human_gates\[0\]\.blocks_hats\[1\] :: .*未声明的帽: 99-nonexistent/)
    })
  })

  it('负向 6 · ClassShape（id 重复 / 缺 id）→ 报红点名 exit 2', async () => {
    await withTemp(async (dir) => {
      const dup = conformingOntology().replace('  - id: Hat\n    domain: Instance\n', '  - id: Hat\n    domain: Instance\n  - id: Hat\n    domain: Instance\n')
      const dupFile = await writeFixture(dir, dup)
      const r1 = await runGraph(['ontology', 'check', '--file', dupFile])
      assert.equal(r1.status, 2, r1.combined)
      assert.match(r1.combined, /\[VIOLATION\] ClassShape @ classes\[4\] :: 唯一性违反 —— id 重复: Hat/)

      const missing = conformingOntology().replace('  - id: Hat\n    domain: Instance\n', '  - domain: Instance\n')
      const missFile = path.join(dir, 'ontology-missing-id.yaml')
      await writeFile(missFile, missing)
      const r2 = await runGraph(['ontology', 'check', '--file', missFile])
      assert.equal(r2.status, 2, r2.combined)
      assert.match(r2.combined, /\[VIOLATION\] ClassShape @ classes\[3\] :: sh:minCount 1 违反 —— 缺 id/)
    })
  })

  it('severity 分级 · VersionShape 恒 Warning 不咬 exit（exit 0 + 警示行 · see pin-03 单源划界）', async () => {
    await withTemp(async (dir) => {
      const drifted = conformingOntology().replace(`product_semver: "${PKG_VERSION}"`, 'product_semver: "0.0.0-drift"')
      const file = await writeFixture(dir, drifted)
      const human = await runGraph(['ontology', 'check', '--file', file])
      assert.equal(human.status, 0, human.combined)
      assert.match(human.combined, /\[WARNING\] VersionShape @ product_semver :: /)
      assert.match(human.combined, /see pin-03/)
      assert.match(human.combined, /conforms: true/)

      const json = await runGraph(['ontology', 'check', '--file', file, '--json'])
      assert.equal(json.status, 0, json.combined)
      const report = JSON.parse(json.stdout) as { conforms: boolean; violations: { shape: string; severity: string; message: string }[] }
      assert.equal(report.conforms, true)
      assert.equal(report.violations.length, 1)
      assert.equal(report.violations[0]!.shape, 'VersionShape')
      assert.equal(report.violations[0]!.severity, 'Warning')
      assert.match(report.violations[0]!.message, /see pin-03/)
    })
  })

  it('fail-closed · ontology 不可读 / YAML 解析失败 → exit 2', async () => {
    await withTemp(async (dir) => {
      const missing = await runGraph(['ontology', 'check', '--file', path.join(dir, 'nope.yaml')])
      assert.equal(missing.status, 2, missing.combined)
      assert.match(missing.combined, /不可读|不存在|ENOENT|ontology/i)

      const badFile = path.join(dir, 'bad.yaml')
      await writeFile(badFile, 'classes: [unclosed\n')
      const bad = await runGraph(['ontology', 'check', '--file', badFile])
      assert.equal(bad.status, 2, bad.combined)
      assert.match(bad.combined, /解析失败|YAML/)
    })
  })

  it('graph --help 含 ontology 子命令行（分派接线面）', async () => {
    const r = await runGraph(['--help'])
    assert.equal(r.status, 0, r.combined)
    assert.match(r.combined, /graph ontology check \[--file PATH\] \[--json\]/)
  })

  // 登记项（F-W3-08 · 验收 #2 进度机械锁）：DisciplinePackage/BusinessRepository 补声明 + hasGate 追认登记
  // 已落地（接线前 3 处 → 现余 1 处）；produces→TraceArtifact 对账问法已由 00 出示维护者、本棒开工时未得答
  // （task S4.2 硬步骤：未得答不得二选一 · 处置独立 commit 后补）——得答处置落地后本断言须翻转为 0 Violation / exit 0。
  it('登记项 · 仓内 assets/ontology.yaml 当前违规计数钉（3→1 · TraceArtifact 待对账）', async () => {
    const r = await runGraph(['ontology', 'check'])
    assert.equal(r.status, 2, r.combined)
    assert.match(r.combined, /\[VIOLATION\] RelationShape @ relations\[3\]\.object :: .*未声明的类: TraceArtifact/)
    assert.doesNotMatch(r.combined, /DisciplinePackage|BusinessRepository/)
    assert.match(r.combined, /ontology 校验未通过（Violation × 1）/)
    const json = await runGraph(['ontology', 'check', '--json'])
    assert.equal(json.status, 2, json.combined)
    const report = JSON.parse(json.stdout) as { entities: Record<string, number>; violations: unknown[] }
    assert.deepEqual(report.entities, { classes: 17, relations: 5, axioms: 6, gates: 4 })
    assert.equal(report.violations.length, 1)
  })
})
