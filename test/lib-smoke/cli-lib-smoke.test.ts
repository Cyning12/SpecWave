import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { existsSync, statSync } from 'node:fs'
import { mkdtemp, rm } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { describe, it } from 'node:test'
import { fileURLToPath } from 'node:url'

// DEF-018 lib 冒烟：对发布入口 bin/dsh-coding-kit.js（即 lib/ 编译产物）跑最小路径。
// 本文件刻意放在 test/lib-smoke/ 子目录：npm test 的 glob（test/*.test.ts）不递归，
// 保持 src 套件不依赖 build；lib 冒烟由 test:lib 单独触发（prepublishOnly 中 build 之后）。

const KIT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const BIN = path.join(KIT, 'bin', 'dsh-coding-kit.js')
const LIB_CLI = path.join(KIT, 'lib', 'cli.js')
const SRC_CLI = path.join(KIT, 'src', 'cli.ts')

type RunResult = {
  status: number | null
  stdout: string
  combined: string
}

function runBin(args: string[]): RunResult {
  const result = spawnSync(process.execPath, [BIN, ...args], {
    encoding: 'utf8',
    cwd: KIT,
    env: { ...process.env },
  })
  return {
    status: result.status,
    stdout: result.stdout ?? '',
    combined: `${result.stdout ?? ''}\n${result.stderr ?? ''}`,
  }
}

describe('lib 冒烟（DEF-018 · 发布产物最小路径）', { concurrency: 1 }, () => {
  it('S0: 漂移哨兵——lib/cli.js 存在且 mtime ≥ src/cli.ts（src 新 lib 旧即 FAIL）', () => {
    assert.ok(
      existsSync(LIB_CLI),
      'lib/cli.js 缺失：请先 npm run build 再跑 lib 冒烟（npm run test:lib）',
    )
    const libMtime = statSync(LIB_CLI).mtimeMs
    const srcMtime = statSync(SRC_CLI).mtimeMs
    assert.ok(
      libMtime >= srcMtime,
      `src→lib 漂移：src/cli.ts（${new Date(srcMtime).toISOString()}）新于 lib/cli.js` +
        `（${new Date(libMtime).toISOString()}）——请 npm run build 后重跑`,
    )
  })

  it('S1: --help exit 0 且列出 verify 与 skills install', () => {
    const r = runBin(['--help'])
    assert.equal(r.status, 0, r.combined)
    assert.match(r.combined, /verify/)
    assert.match(r.combined, /skills install/)
  })

  // 2.3-W4 FULL-reviews：裸 verify 语义由用法错改为仓级 reviews 扫描（bin 面钉面）
  it('S2: 裸 verify（2.3-W4 FULL-reviews）仓级扫描本仓 → exit 0 PASS（dogfood 真值 · 豁免清单生效）', () => {
    const r = runBin(['verify'])
    assert.equal(r.status, 0, r.combined)
    assert.match(r.combined, /VERIFY: PASS（裸 verify · 仓级 reviews 扫描）/)
    assert.match(r.combined, /豁免命中留痕/)
  })

  it('S4: 2.3-W3 ② bin 面 exit 1 用法错 + --json → stdout JSON 信封（D-23-W3-ENVELOPE · bin 接线钉面）', () => {
    // 2.3-W4：裸 verify 已是合法模式 → 用法错信封改由 --task/--spec 互斥触发
    const r = runBin(['verify', '--task', 'a.md', '--spec', 'b.md', '--json'])
    assert.equal(r.status, 1, r.combined)
    const payload = JSON.parse(r.stdout) as Record<string, unknown> // stdout 纯信封无人类文本污染
    assert.equal(payload.command, 'verify')
    assert.equal(payload.exitCode, 1)
    assert.match((payload.error as { message: string }).message, /互斥/)
  })

  // 2.3-W5 A2（SPEC 05）：assets verify bin 面钉面（W3 教训 · src 绿 ≠ bin 面正确）
  it('S5: assets verify 本仓 dogfood → exit 0 ASSETS: PASS（发布产物 bin 面）', () => {
    const r = runBin(['assets', 'verify'])
    assert.equal(r.status, 0, r.combined)
    assert.match(r.combined, /ASSETS: PASS · \d+\/\d+ 文件一致/)
  })

  it('S3: skills install --target <tmp> PASS 且落 harness-10-spec/SKILL.md', async () => {
    const dir = await mkdtemp(path.join(os.tmpdir(), 'dsh-ck-lib-smoke-'))
    try {
      const r = runBin(['skills', 'install', '--target', dir])
      assert.equal(r.status, 0, r.combined)
      assert.match(r.combined, /SKILLS INSTALL: PASS/)
      assert.equal(
        existsSync(path.join(dir, '.dsh', 'skills', 'harness-10-spec', 'SKILL.md')),
        true,
        'lib 产物 skills install 未落 harness-10-spec/SKILL.md',
      )
    } finally {
      await rm(dir, { recursive: true, force: true })
    }
  })
})
