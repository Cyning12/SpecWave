import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { describe, it } from 'node:test'
import { fileURLToPath } from 'node:url'

// 2.3.1 N1 [P1] · 发布卫生：包内不得含 *.bak / *~ / .DS_Store（验收报告 §3.B）
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
    // files 否定项 "!assets/**/*.bak" 管不到该面；此面正是 2.3.0 真实泄漏面之一（README.md.bak 双语入包）。
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
