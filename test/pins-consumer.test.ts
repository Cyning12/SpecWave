/**
 * 3.0.2 W2 · pins consumer 模式（F-3/F-4 · 消费侧钉版保鲜闸）
 * 红测先行：A1 回退链四态 / A2 --truth 三态 / A3 取值口径 / A4 默认钉面闭环 /
 * A5 零落点提示 / A6 声明源 / A7 S2 拒写 · release 模式零回归由既有套件钉死（A8）。
 * fixture 样板：test/w3-pins-io-failclosed.test.ts（mkdtemp + runCore）。
 */
import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { describe, it } from 'node:test'
import { runCore } from './_helpers/core-harness.ts'

async function withTemp(fn: (dir: string) => Promise<void>): Promise<void> {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'w2-pins-consumer-'))
  try {
    await fn(dir)
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
}

async function writeRel(dir: string, rel: string, body: string): Promise<void> {
  const abs = path.join(dir, rel)
  await mkdir(path.dirname(abs), { recursive: true })
  await writeFile(abs, body, 'utf8')
}

function pkgJson(fields: Record<string, unknown>): string {
  return JSON.stringify({ name: 'consumer-app', private: true, ...fields }, null, 2) + '\n'
}

describe('3.0.2 W2 · pins consumer 真值回退链（A1）', { concurrency: 1 }, () => {
  it('① devDependencies["spec-wave"]="3.0.1" ⇒ 真值源 package.json#devDependencies.spec-wave', async () => {
    await withTemp(async (dir) => {
      await writeRel(dir, 'package.json', pkgJson({ devDependencies: { 'spec-wave': '3.0.1' } }))
      const r = await runCore(['pins', 'check', '--consumer'], dir)
      assert.equal(r.status, 0, r.combined)
      assert.match(r.combined, /pins check \[consumer\] · 真值源 package\.json#devDependencies\.spec-wave = 3\.0\.1 · 落点 0/)
      // 无 workflows ⇒ A5 显式提示行（不静默 PASS 假象）
      assert.match(r.combined, /未声明 \.spec-wave\/pins-consumer\.yaml 且未发现 CI workflow 钉面 · 0 落点/)
    })
  })

  it('② devDeps 缺 · dependencies["spec-wave"]="3.0.1" ⇒ 真值源 package.json#dependencies.spec-wave', async () => {
    await withTemp(async (dir) => {
      await writeRel(dir, 'package.json', pkgJson({ dependencies: { 'spec-wave': '3.0.1' } }))
      const r = await runCore(['pins', 'check', '--consumer'], dir)
      assert.equal(r.status, 0, r.combined)
      assert.match(r.combined, /真值源 package\.json#dependencies\.spec-wave = 3\.0\.1/)
    })
  })

  it('③ devDeps/deps 皆缺 · version="3.0.1" ⇒ 真值源 package.json#version', async () => {
    await withTemp(async (dir) => {
      await writeRel(dir, 'package.json', pkgJson({ version: '3.0.1' }))
      const r = await runCore(['pins', 'check', '--consumer'], dir)
      assert.equal(r.status, 0, r.combined)
      assert.match(r.combined, /真值源 package\.json#version = 3\.0\.1/)
    })
  })

  it('④ 三处皆缺 ⇒ exit 2 + PINS: BLOCKED 点名完整回退链', async () => {
    await withTemp(async (dir) => {
      await writeRel(dir, 'package.json', pkgJson({}))
      const r = await runCore(['pins', 'check', '--consumer'], dir)
      assert.equal(r.status, 2, r.combined)
      assert.match(r.combined, /PINS: BLOCKED/)
      assert.match(r.combined, /package\.json#devDependencies\.spec-wave/)
      assert.match(r.combined, /package\.json#dependencies\.spec-wave/)
      assert.match(r.combined, /package\.json#version/)
    })
  })
})

describe('3.0.2 W2 · pins consumer --truth 显式指定（A2）', { concurrency: 1 }, () => {
  it('① custom.json#devDependencies.spec-wave（package.json 三缺）⇒ exit 0 · 真值源点名 custom.json · 跳过回退链', async () => {
    await withTemp(async (dir) => {
      await writeRel(dir, 'package.json', pkgJson({}))
      await writeRel(dir, 'custom.json', JSON.stringify({ devDependencies: { 'spec-wave': '3.0.1' } }) + '\n')
      const r = await runCore(['pins', 'check', '--consumer', '--truth', 'custom.json#devDependencies.spec-wave'], dir)
      assert.equal(r.status, 0, r.combined)
      assert.match(r.combined, /真值源 custom\.json#devDependencies\.spec-wave = 3\.0\.1/)
    })
  })

  it('② 键缺 ⇒ exit 2 点名断键', async () => {
    await withTemp(async (dir) => {
      await writeRel(dir, 'package.json', pkgJson({ devDependencies: { 'spec-wave': '3.0.1' } }))
      await writeRel(dir, 'custom.json', JSON.stringify({ devDependencies: { 'spec-wave': '3.0.1' } }) + '\n')
      const r = await runCore(['pins', 'check', '--consumer', '--truth', 'custom.json#dependencies.spec-wave'], dir)
      assert.equal(r.status, 2, r.combined)
      assert.match(r.combined, /PINS: BLOCKED · --truth 键缺失/)
      assert.match(r.combined, /断于 dependencies/)
    })
  })

  it('③ 值非串 ⇒ exit 2', async () => {
    await withTemp(async (dir) => {
      await writeRel(dir, 'package.json', pkgJson({ devDependencies: { 'spec-wave': '3.0.1' } }))
      await writeRel(dir, 'custom.json', JSON.stringify({ ver: 123 }) + '\n')
      const r = await runCore(['pins', 'check', '--consumer', '--truth', 'custom.json#ver'], dir)
      assert.equal(r.status, 2, r.combined)
      assert.match(r.combined, /--truth 值非字符串/)
    })
  })

  it('④ 路径越界（绝对路径与 ../）⇒ exit 2', async () => {
    await withTemp(async (dir) => {
      await writeRel(dir, 'package.json', pkgJson({ devDependencies: { 'spec-wave': '3.0.1' } }))
      const r1 = await runCore(['pins', 'check', '--consumer', '--truth', '/abs/x.json#ver'], dir)
      assert.equal(r1.status, 2, r1.combined)
      assert.match(r1.combined, /--truth 路径越界/)
      const r2 = await runCore(['pins', 'check', '--consumer', '--truth', '../x.json#ver'], dir)
      assert.equal(r2.status, 2, r2.combined)
      assert.match(r2.combined, /--truth 路径越界/)
    })
  })

  it('⑤ --truth 无 --consumer ⇒ exit 1 用法提示', async () => {
    await withTemp(async (dir) => {
      await writeRel(dir, 'package.json', pkgJson({ devDependencies: { 'spec-wave': '3.0.1' } }))
      const r = await runCore(['pins', 'check', '--truth', 'custom.json#ver'], dir)
      assert.equal(r.status, 1, r.combined)
      assert.match(r.combined, /pins --truth 仅在 --consumer 下合法/)
    })
  })
})

describe('3.0.2 W2 · pins consumer 取值口径（A3 · ^/~ 归一 WARN 可见 · 非精确拒）', { concurrency: 1 }, () => {
  it('① ^3.0.1 ⇒ exit 0 · stderr 含 [warning] 归一为 3.0.1（不要静默）', async () => {
    await withTemp(async (dir) => {
      await writeRel(dir, 'package.json', pkgJson({ devDependencies: { 'spec-wave': '^3.0.1' } }))
      const r = await runCore(['pins', 'check', '--consumer'], dir)
      assert.equal(r.status, 0, r.combined)
      assert.match(r.stderr, /\[warning\] consumer 真值源 package\.json#devDependencies\.spec-wave = "\^3\.0\.1" 含范围前缀 · 已归一为 3\.0\.1/)
      assert.match(r.combined, /pins check \[consumer\] · 真值源 package\.json#devDependencies\.spec-wave = 3\.0\.1/)
    })
  })

  it('② --json：warnings 数组含 WARN · truth_version=3.0.1 · status pass（信封只增）', async () => {
    await withTemp(async (dir) => {
      await writeRel(dir, 'package.json', pkgJson({ devDependencies: { 'spec-wave': '~3.0.1' } }))
      const r = await runCore(['pins', 'check', '--consumer', '--json'], dir)
      assert.equal(r.status, 0, r.combined)
      const env = JSON.parse(r.stdout) as {
        mode: string
        truth_version: string
        truth_source: string
        status: string
        warnings?: string[]
      }
      assert.equal(env.mode, 'consumer')
      assert.equal(env.truth_version, '3.0.1')
      assert.equal(env.truth_source, 'package.json#devDependencies.spec-wave')
      assert.equal(env.status, 'pass')
      assert.ok(Array.isArray(env.warnings) && env.warnings.length === 1)
      assert.match(env.warnings![0]!, /已归一为 3\.0\.1/)
    })
  })

  it('③ * / workspace:* ⇒ exit 2 含「建议改 exact」', async () => {
    await withTemp(async (dir) => {
      await writeRel(dir, 'package.json', pkgJson({ devDependencies: { 'spec-wave': '*' } }))
      const r1 = await runCore(['pins', 'check', '--consumer'], dir)
      assert.equal(r1.status, 2, r1.combined)
      assert.match(r1.combined, /consumer 真值非精确版本/)
      assert.match(r1.combined, /建议改 exact/)
      await writeRel(dir, 'package.json', pkgJson({ devDependencies: { 'spec-wave': 'workspace:*' } }))
      const r2 = await runCore(['pins', 'check', '--consumer'], dir)
      assert.equal(r2.status, 2, r2.combined)
      assert.match(r2.combined, /consumer 真值非精确版本/)
      assert.match(r2.combined, /建议改 exact/)
    })
  })
})

describe('3.0.2 W2 · pins consumer 内置默认钉面闭环（A4 · CI workflow 字面钉）', { concurrency: 1 }, () => {
  const WF = [
    'name: ci',
    'on: [push]',
    'jobs:',
    '  gate:',
    '    steps:',
    '      - run: npx spec-wave@3.0.0 verify --target .',
    '      - run: npx spec-wave@3.0.0 task lint --file docs/tasks/active/task_x.md',
    '',
  ].join('\n')

  it('闭环：漂移 exit 2（2/2 失配）→ dry-run 零写盘无 .bak → --yes 写盘 → 复跑 PASS', async () => {
    await withTemp(async (dir) => {
      await writeRel(dir, 'package.json', pkgJson({ devDependencies: { 'spec-wave': '3.0.1' } }))
      await writeRel(dir, '.github/workflows/ci.yml', WF)
      const bad = await runCore(['pins', 'check', '--consumer'], dir)
      assert.equal(bad.status, 2, bad.combined)
      assert.match(bad.combined, /\[mismatch\] consumer-wf-ci \.github\/workflows\/ci\.yml/)
      assert.match(bad.combined, /2\/2 处失配/)
      const dry = await runCore(['pins', 'fix', '--consumer'], dir)
      assert.equal(dry.status, 0, dry.combined)
      assert.match(dry.combined, /pins fix \[consumer\] · 真值源 package\.json#devDependencies\.spec-wave = 3\.0\.1 · 落点 1/)
      assert.match(dry.combined, /\[dry-run\] consumer-wf-ci/)
      assert.equal(await readFile(path.join(dir, '.github/workflows/ci.yml'), 'utf8'), WF)
      assert.equal(existsSync(path.join(dir, '.github/workflows/ci.yml.bak')), false)
      const fix = await runCore(['pins', 'fix', '--consumer', '--yes'], dir)
      assert.equal(fix.status, 0, fix.combined)
      assert.match(fix.combined, /\[written\] \.github\/workflows\/ci\.yml/)
      assert.equal(
        await readFile(path.join(dir, '.github/workflows/ci.yml'), 'utf8'),
        WF.replaceAll('spec-wave@3.0.0', 'spec-wave@3.0.1'),
      )
      assert.equal(existsSync(path.join(dir, '.github/workflows/ci.yml.bak')), false)
      const ok = await runCore(['pins', 'check', '--consumer'], dir)
      assert.equal(ok.status, 0, ok.combined)
      assert.match(ok.combined, /PINS: PASS · 1\/1 落点一致/)
    })
  })

  it('A4b（R-1 预筛）：无字面 workflow 合法跳过 · 无 extract_error 误报 · 行为仅由含字面文件决定', async () => {
    await withTemp(async (dir) => {
      await writeRel(dir, 'package.json', pkgJson({ devDependencies: { 'spec-wave': '3.0.1' } }))
      await writeRel(dir, '.github/workflows/ci.yml', WF)
      await writeRel(dir, '.github/workflows/release.yml', 'name: release\non: [push]\njobs: {}\n')
      const r = await runCore(['pins', 'check', '--consumer'], dir)
      assert.equal(r.status, 2, r.combined)
      assert.match(r.combined, /consumer-wf-ci/)
      assert.doesNotMatch(r.combined, /consumer-wf-release/)
      assert.doesNotMatch(r.combined, /extract_error/)
    })
  })
})

describe('3.0.2 W2 · pins consumer 声明源（A6 · .spec-wave/pins-consumer.yaml · 显式 > 缺省）', { concurrency: 1 }, () => {
  const DECL = [
    'version: "1"',
    'pins:',
    '  - id: mock-pins',
    '    path: test/mock.ts',
    "    extract: { kind: regex-all, pattern: 'spec-wave@(\\d+\\.\\d+\\.\\d+)', flags: g }",
    '    expected: { kind: package-version }',
    '    required: true',
    '    fixable: true',
    '',
  ].join('\n')

  it('① 自定义 pins 漂移 exit 2 → fix --yes 写盘 → 复跑 PASS（声明源存在不走默认钉面提示）', async () => {
    await withTemp(async (dir) => {
      await writeRel(dir, 'package.json', pkgJson({ devDependencies: { 'spec-wave': '3.0.1' } }))
      await writeRel(dir, '.spec-wave/pins-consumer.yaml', DECL)
      await writeRel(dir, 'test/mock.ts', "export const KIT = 'spec-wave@3.0.0'\nexport const KIT2 = 'spec-wave@3.0.0'\n")
      const bad = await runCore(['pins', 'check', '--consumer'], dir)
      assert.equal(bad.status, 2, bad.combined)
      assert.match(bad.combined, /\[mismatch\] mock-pins test\/mock\.ts/)
      assert.match(bad.combined, /2\/2 处失配/)
      assert.doesNotMatch(bad.combined, /未发现 CI workflow 钉面/)
      const fix = await runCore(['pins', 'fix', '--consumer', '--yes'], dir)
      assert.equal(fix.status, 0, fix.combined)
      assert.match(fix.combined, /\[written\] test\/mock\.ts/)
      const ok = await runCore(['pins', 'check', '--consumer'], dir)
      assert.equal(ok.status, 0, ok.combined)
      assert.match(ok.combined, /PINS: PASS · 1\/1 落点一致/)
    })
  })

  it('② package_name: dsh-coding-kit 覆盖回退链包名与声明源正则', async () => {
    await withTemp(async (dir) => {
      await writeRel(dir, 'package.json', pkgJson({ devDependencies: { 'dsh-coding-kit': '3.0.1' } }))
      await writeRel(dir, '.spec-wave/pins-consumer.yaml', [
        'version: "1"',
        'package_name: dsh-coding-kit',
        'pins:',
        '  - id: leg',
        '    path: test/mock.ts',
        "    extract: { kind: regex-all, pattern: 'dsh-coding-kit@(\\d+\\.\\d+\\.\\d+)', flags: g }",
        '    expected: { kind: package-version }',
        '    required: true',
        '    fixable: true',
        '',
      ].join('\n'))
      await writeRel(dir, 'test/mock.ts', "export const KIT = 'dsh-coding-kit@3.0.1'\n")
      const r = await runCore(['pins', 'check', '--consumer'], dir)
      assert.equal(r.status, 0, r.combined)
      assert.match(r.combined, /真值源 package\.json#devDependencies\.dsh-coding-kit = 3\.0\.1/)
    })
  })

  it('③ 坏语法 / 缺 pins / 行缺字段 ⇒ exit 2 含「声明源」· 不回落默认钉面（存在且坏 ≠ 缺失）', async () => {
    await withTemp(async (dir) => {
      await writeRel(dir, 'package.json', pkgJson({ devDependencies: { 'spec-wave': '3.0.1' } }))
      await writeRel(dir, '.spec-wave/pins-consumer.yaml', 'pins: [unclosed\n')
      const r1 = await runCore(['pins', 'check', '--consumer'], dir)
      assert.equal(r1.status, 2, r1.combined)
      assert.match(r1.combined, /PINS: BLOCKED · 声明源语法错误/)
      assert.doesNotMatch(r1.combined, /未发现 CI workflow 钉面/)
      await writeRel(dir, '.spec-wave/pins-consumer.yaml', 'version: "1"\n')
      const r2 = await runCore(['pins', 'check', '--consumer'], dir)
      assert.equal(r2.status, 2, r2.combined)
      assert.match(r2.combined, /声明源缺 pins 列表/)
      await writeRel(dir, '.spec-wave/pins-consumer.yaml', 'version: "1"\npins:\n  - id: only-id\n')
      const r3 = await runCore(['pins', 'check', '--consumer'], dir)
      assert.equal(r3.status, 2, r3.combined)
      assert.match(r3.combined, /声明源行缺 id\/path\/extract\/expected/)
    })
  })

  it('④ 声明源 pin path 越界（../）⇒ extract_error exit 2', async () => {
    await withTemp(async (dir) => {
      await writeRel(dir, 'package.json', pkgJson({ devDependencies: { 'spec-wave': '3.0.1' } }))
      await writeRel(dir, '.spec-wave/pins-consumer.yaml', [
        'version: "1"',
        'pins:',
        '  - id: evil',
        '    path: ../evil.yml',
        "    extract: { kind: regex-all, pattern: 'spec-wave@(\\d+\\.\\d+\\.\\d+)', flags: g }",
        '    expected: { kind: package-version }',
        '    required: true',
        '    fixable: true',
        '',
      ].join('\n'))
      const r = await runCore(['pins', 'check', '--consumer'], dir)
      assert.equal(r.status, 2, r.combined)
      assert.match(r.combined, /\[extract_error\] evil \.\.\/evil\.yml/)
      assert.match(r.combined, /落点路径越界/)
    })
  })
})

describe('3.0.2 W2 · pins consumer S2 机械拒写（A7 · 无豁免）', { concurrency: 1 }, () => {
  it('声明源 pin 落点命中 S2（docs/tasks/）⇒ fix --yes 整体拒写 exit 2 · 零写盘无 .bak', async () => {
    await withTemp(async (dir) => {
      await writeRel(dir, 'package.json', pkgJson({ devDependencies: { 'spec-wave': '3.0.1' } }))
      await writeRel(dir, '.spec-wave/pins-consumer.yaml', [
        'version: "1"',
        'pins:',
        '  - id: s2-pin',
        '    path: docs/tasks/x.md',
        "    extract: { kind: regex-all, pattern: 'spec-wave@(\\d+\\.\\d+\\.\\d+)', flags: g }",
        '    expected: { kind: package-version }',
        '    required: true',
        '    fixable: true',
        '',
      ].join('\n'))
      await writeRel(dir, 'docs/tasks/x.md', '# x\nnpx spec-wave@3.0.0 verify\n')
      const bad = await runCore(['pins', 'check', '--consumer'], dir)
      assert.equal(bad.status, 2, bad.combined)
      assert.match(bad.combined, /\[mismatch\] s2-pin docs\/tasks\/x\.md/)
      const fix = await runCore(['pins', 'fix', '--consumer', '--yes'], dir)
      assert.equal(fix.status, 2, fix.combined)
      assert.match(fix.combined, /PINS FIX: REFUSED · S2/)
      assert.equal(await readFile(path.join(dir, 'docs/tasks/x.md'), 'utf8'), '# x\nnpx spec-wave@3.0.0 verify\n')
      assert.equal(existsSync(path.join(dir, 'docs/tasks/x.md.bak')), false)
      assert.equal(existsSync(path.join(dir, 'docs/tasks/x.md.pins-fix-backup')), false)
    })
  })
})
