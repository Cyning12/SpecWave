import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { describe, it } from 'node:test'
import { fileURLToPath } from 'node:url'

// 2.3.1 N1 [P1] · 发布卫生：包内不得含 .bak 族（3.0-W5 NEW-6 通配语义）/ *~ / .DS_Store（验收报告 §3.B）
// 红→绿钉死：修复前 scripts/check-pack-hygiene.mjs 不存在（spawn 失败）；
// 修复后正向 PASS · trap.bak 负向 failClosed exit 2 点名。
// 注意：正向用例依赖仓树 .bak=0（N1-e）；本机残留清理前该用例红 = 期望的红先行。

const KIT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const SCRIPT = path.join(KIT, 'scripts', 'check-pack-hygiene.mjs')

function run(): { status: number | null; combined: string } {
  const r = spawnSync(process.execPath, [SCRIPT], { encoding: 'utf8', cwd: KIT })
  return { status: r.status, combined: `${r.stdout ?? ''}\n${r.stderr ?? ''}` }
}

describe('2.3.1 N1 · prepublishOnly 包内容卫生断言（failClosed）', { concurrency: 1 }, () => {
  it('正向：当前包清单无 *.bak/*~/.DS_Store → PASS exit 0 且 GLOSSARY/MIGRATION 不回归', () => {
    const r = run()
    assert.equal(r.status, 0, r.combined)
    assert.match(r.combined, /PACK HYGIENE: PASS/)
    assert.match(r.combined, /GLOSSARY\.md/)
    assert.match(r.combined, /MIGRATION\.md/)
  })

  it('负向：仓根造 README.trap.bak（npm readme 自动入包规则面 · 不受 files 否定项控制）→ exit 2 点名；清除后复绿（failClosed 自证）', async () => {
    // trap 选型理由：验收报告 §3.B 机制 2 —— /^readme(\..+)?$/i 自动入包规则命中 README*.bak，
    // files 否定项管不到该面（npm 必读文件恒入包 · 免疫否定项）；此面正是 2.3.0 真实泄漏面之一（README.md.bak 双语入包）。
    const trap = path.join(KIT, 'README.trap.bak')
    await writeFile(trap, 'trap\n', 'utf8')
    try {
      const bad = run()
      assert.equal(bad.status, 2, bad.combined)
      assert.match(bad.combined, /PACK HYGIENE: FAIL/)
      assert.match(bad.combined, /README\.trap\.bak/)
    } finally {
      await rm(trap, { force: true })
    }
    const good = run()
    assert.equal(good.status, 0, good.combined)
  })
})

describe('3.0-W5 NEW-6 · .bak 族通配语义（fixture 变体全拦为硬判据 · 验收 #1）', { concurrency: 1 }, () => {
  // trap 落点统一 = 仓根 README.trap-*：npm readme 自动入包规则（/^readme(\..+)?$/i）免疫 files 否定项，
  // 四变体必达卫生门 —— 与打包层 glob 分工（!**/*.bak + !**/*.bak.* 先滤可表达面）解耦，单测闸门通配语义本身。
  // 红测先行留证（修复前 · 精确后缀 /\.bak$/i 口径）：.bak2 / .bak.md / 尾空格 .bak 三变体漏网真红（exit 0）；
  // .BAK 大写为同向对照（修复前 i 旗标已拦 · 本用例兼作零回退锁）。
  const variants = [
    { name: 'README.trap-digit.bak2', label: '.bak2 数字续段' },
    { name: 'README.trap-ext.bak.md', label: '.bak.md 扩展段' },
    { name: 'README.trap-case.BAK', label: '.BAK 大写（同向对照 · 修复前已拦）' },
    { name: 'README.trap-space.bak ', label: '尾空格 .bak ' },
  ]
  for (const v of variants) {
    it(`负向：${v.label}（${v.name}）→ exit 2 点名；清除后复绿`, async () => {
      const trap = path.join(KIT, v.name)
      await writeFile(trap, 'trap\n', 'utf8')
      try {
        const bad = run()
        assert.equal(bad.status, 2, bad.combined)
        assert.match(bad.combined, /PACK HYGIENE: FAIL/)
        assert.ok(bad.combined.includes(v.name), `未点名 ${v.name}: ${bad.combined}`)
      } finally {
        await rm(trap, { force: true })
      }
      const good = run()
      assert.equal(good.status, 0, good.combined)
    })
  }

  it('正向：合法名不误拦（F-W5-04 白名单口径 · 「.bak 后接字母」名 hygiene-legit.bakery / .bakxt）', async () => {
    // 误拦面边界钉死：通配选型为边界扩展式 /\.bak(\.|$|[0-9]| )/i，「.bak 后接字母」的合法名不命中。
    const legit1 = path.join(KIT, 'assets', 'hygiene-legit.bakery')
    const legit2 = path.join(KIT, 'assets', 'hygiene-legit.bakxt')
    await writeFile(legit1, 'legit\n', 'utf8')
    await writeFile(legit2, 'legit\n', 'utf8')
    try {
      const r = run()
      assert.equal(r.status, 0, r.combined)
      assert.match(r.combined, /PACK HYGIENE: PASS/)
    } finally {
      await rm(legit1, { force: true })
      await rm(legit2, { force: true })
    }
  })
})

describe('3.0-W5 NEW-7 · 双控制点显式声明（案 B · 机检双锚 · 20 审 A3 · 验收 #2）', () => {
  it('锚①：脚本头注释双控制点声明在案（grep 断言 · 防声明被静默删）', async () => {
    const src = await readFile(SCRIPT, 'utf8')
    assert.match(src, /双控制点声明/)
    assert.match(src, /prepublishOnly/)
    assert.match(src, /pack-hygiene\.test\.ts/)
    assert.match(src, /无第三控制点/)
  })

  it('锚②：测试实跑行存在断言（防注释在而实跑被摘）', async () => {
    // 自指锚：本文件须真实 spawn 卫生门脚本（run() 实跑行），而非仅声明。
    const self = await readFile(fileURLToPath(import.meta.url), 'utf8')
    assert.match(self, /spawnSync\(process\.execPath, \[SCRIPT\]/)
  })
})
