import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { cp, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { describe, it } from 'node:test'
import { fileURLToPath } from 'node:url'

const KIT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const PEER_CORDIS = '@deepseek-ai/cordis'
const PEER_TOOLS = '@deepseek-ai/dsh-tools'

type Pkg = {
  peerDependencies?: Record<string, string>
  peerDependenciesMeta?: Record<string, { optional?: boolean }>
  bin?: Record<string, string>
  dependencies?: Record<string, string>
}

function resolvePnpm(): string | null {
  const which = spawnSync('which', ['pnpm'], { encoding: 'utf8' })
  if (which.status === 0 && which.stdout.trim()) return which.stdout.trim()
  const enable = spawnSync('corepack', ['enable'], { encoding: 'utf8' })
  if (enable.status !== 0) return null
  const again = spawnSync('which', ['pnpm'], { encoding: 'utf8' })
  if (again.status === 0 && again.stdout.trim()) return again.stdout.trim()
  return null
}

// 2.3-W7 ③（D-23-W7-E2 · F-W7-03/F-W7-07）：默认离线 fixture —— 全程无 spawn pnpm/npm 联网调用。
// 形态：tmp 目录伪造「pnpm 已安装完成」的布局（node_modules/spec-wave/ = 本仓 bin/ + lib/ +
// package.json + cordis.patch.yml · 与 package.json#files 运行载荷一致），运行时依赖
// （js-yaml 及其依赖闭包）从本仓 node_modules 直拷 —— 纯文件拷贝，无 registry 访问点。
// 与真实 pnpm 链路的已知差异（F-W7-03 留痕）：fixture 不经过 pnpm 的 peer 解析/提升与
// .bin shim 生成（bin 经 process.execPath 直跑 · 名单取自 fixture 内 package.json#bin 实读），
// 也不覆盖「install 输出无 dsh-type-meta 字样」断言 —— 两者保留在下方 SPEC_WAVE_E2E_NETWORK
// 门控的真实安装测试（默认 skip · 非 CI 默认）。
async function buildOfflineFixture(dir: string): Promise<string> {
  // lib/ 缺失时（CI 干净检出）先仓内离线构建：typescript 是 devDep，npm run build 纯本地
  // tsc，无网络（F-W7-07）；lib/ 已在（开发机常态）则跳过。
  if (!existsSync(path.join(KIT, 'lib', 'cli.js'))) {
    const build = spawnSync('npm', ['run', 'build'], {
      cwd: KIT,
      encoding: 'utf8',
      timeout: 180_000,
    })
    assert.equal(build.status, 0, `离线构建失败（npm run build 纯本地 tsc）：\n${build.stdout}\n${build.stderr}`)
  }
  const pkgDir = path.join(dir, 'node_modules', 'spec-wave')
  await mkdir(pkgDir, { recursive: true })
  for (const rel of ['bin', 'lib', 'package.json', 'cordis.patch.yml']) {
    await cp(path.join(KIT, rel), path.join(pkgDir, rel), { recursive: true })
  }
  // 运行时依赖闭包拷贝（js-yaml → argparse · BFS 防未来新增传递依赖）：本仓 node_modules
  // 直拷到 fixture node_modules 根（Node 解析自 node_modules/spec-wave/lib 向上命中 fixture
  // 根 node_modules，与真实安装的提升布局同构）。
  const queue = Object.keys(
    (JSON.parse(await readFile(path.join(KIT, 'package.json'), 'utf8')) as Pkg).dependencies ?? {},
  )
  const seen = new Set<string>()
  for (let name = queue.shift(); name; name = queue.shift()) {
    if (seen.has(name)) continue
    seen.add(name)
    const srcDir = path.join(KIT, 'node_modules', name)
    assert.ok(existsSync(srcDir), `运行时依赖 ${name} 不在本仓 node_modules（须先 npm install · devDep 环境自带）`)
    await cp(srcDir, path.join(dir, 'node_modules', name), { recursive: true })
    const sub = (JSON.parse(await readFile(path.join(srcDir, 'package.json'), 'utf8')) as Pkg).dependencies ?? {}
    queue.push(...Object.keys(sub))
  }
  return pkgDir
}

// 真实 pnpm 全链路（P1-2-network）：SPEC_WAVE_E2E_NETWORK=1 才执行（默认 skip · 非 CI 默认）。
const NETWORK_E2E = process.env.SPEC_WAVE_E2E_NETWORK === '1'

describe('1.2.2 peer optional + default pnpm install', { concurrency: 1 }, () => {
  it('P1-1: peerDependencies 仍在且 peerDependenciesMeta optional×2', async () => {
    const pkg = JSON.parse(await readFile(path.join(KIT, 'package.json'), 'utf8')) as Pkg
    assert.ok(pkg.peerDependencies?.[PEER_CORDIS], 'missing peer @deepseek-ai/cordis')
    assert.ok(pkg.peerDependencies?.[PEER_TOOLS], 'missing peer @deepseek-ai/dsh-tools')
    assert.equal(pkg.peerDependenciesMeta?.[PEER_CORDIS]?.optional, true)
    assert.equal(pkg.peerDependenciesMeta?.[PEER_TOOLS]?.optional, true)
  })

  it('P1-2: 离线 fixture 伪造已安装布局 → 三 bin --help exit 0 且输出含 spec-wave（零网络）', async () => {
    const dir = await mkdtemp(path.join(os.tmpdir(), 'dsh-ck-peer-opt-'))
    try {
      const pkgDir = await buildOfflineFixture(dir)
      // bin 名单取自 fixture 内 package.json#bin 实读（真实安装面 = 三 bin 钉字 bin/specgate.js ×2 + bin/dsh-coding-kit.js）
      const pkg = JSON.parse(await readFile(path.join(pkgDir, 'package.json'), 'utf8')) as Pkg
      const binNames = Object.keys(pkg.bin ?? {}).sort()
      assert.deepEqual(binNames, ['dsh-coding-kit', 'spec-wave', 'specgate'])
      for (const name of binNames) {
        const rel = pkg.bin?.[name]
        assert.ok(rel, `package.json#bin 缺 ${name}`)
        const help = spawnSync(process.execPath, [path.join(pkgDir, rel), '--help'], {
          encoding: 'utf8',
          cwd: dir,
          env: { ...process.env },
          timeout: 60_000,
        })
        const out = `${help.stdout ?? ''}\n${help.stderr ?? ''}`
        assert.equal(help.status, 0, `${name} --help 退出非 0:\n${out}`)
        assert.match(out, /spec-wave/, `${name} --help 输出须含 spec-wave:\n${out}`)
      }
    } finally {
      await rm(dir, { recursive: true, force: true })
    }
  })

  it(
    'P1-2-network: 干净 fixture 真实 pnpm add -D file:kit → exit 0 且无 dsh-type-meta（门控手动）',
    {
      skip:
        !NETWORK_E2E &&
        '默认 skip：真实 pnpm install 走 registry 网络（2.3-W7 ③ D-23-W7-E2 去网络绑定）；' +
          '全链路保留为 F-W7-03 门控手动测试 —— 执行：SPEC_WAVE_E2E_NETWORK=1 npm test',
    },
    async () => {
      const pnpm = resolvePnpm()
      assert.ok(
        pnpm,
        '环境无 pnpm：已尝试 corepack enable 仍失败；阻塞 P1-2-network（须装 pnpm 或 corepack）',
      )

      const dir = await mkdtemp(path.join(os.tmpdir(), 'dsh-ck-peer-opt-net-'))
      try {
        await writeFile(
          path.join(dir, 'package.json'),
          `${JSON.stringify({ name: 'dsh-ck-peer-opt-fixture', version: '0.0.0', private: true }, null, 2)}\n`,
          'utf8',
        )
        // 禁止预写 auto-install-peers=false（冒充默认配置）
        assert.equal(existsSync(path.join(dir, '.npmrc')), false)

        const add = spawnSync(
          pnpm,
          ['add', '-D', `file:${KIT}`],
          {
            encoding: 'utf8',
            cwd: dir,
            env: { ...process.env },
            timeout: 180_000,
          },
        )
        const combined = `${add.stdout ?? ''}\n${add.stderr ?? ''}`
        assert.equal(add.status, 0, combined)
        assert.equal(
          /dsh-type-meta/i.test(combined),
          false,
          `安装输出不得含 dsh-type-meta:\n${combined}`,
        )
        assert.equal(existsSync(path.join(dir, 'node_modules', 'spec-wave')), true)

        const help = spawnSync(pnpm, ['exec', 'spec-wave', '--help'], {
          encoding: 'utf8',
          cwd: dir,
          env: { ...process.env },
          timeout: 60_000,
        })
        const helpOut = `${help.stdout ?? ''}\n${help.stderr ?? ''}`
        assert.equal(help.status, 0, helpOut)
        assert.match(helpOut, /spec-wave/)

        const helpLegacy = spawnSync(pnpm, ['exec', 'dsh-coding-kit', '--help'], {
          encoding: 'utf8',
          cwd: dir,
          env: { ...process.env },
          timeout: 60_000,
        })
        const legacyOut = `${helpLegacy.stdout ?? ''}\n${helpLegacy.stderr ?? ''}`
        assert.equal(helpLegacy.status, 0, legacyOut)
        assert.match(legacyOut, /spec-wave/)

        const helpSpecgate = spawnSync(pnpm, ['exec', 'specgate', '--help'], {
          encoding: 'utf8',
          cwd: dir,
          env: { ...process.env },
          timeout: 60_000,
        })
        const sgOut = `${helpSpecgate.stdout ?? ''}\n${helpSpecgate.stderr ?? ''}`
        assert.equal(helpSpecgate.status, 0, sgOut)
        assert.match(sgOut, /spec-wave/)
      } finally {
        await rm(dir, { recursive: true, force: true })
      }
    },
  )
})
