import assert from 'node:assert/strict'
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { describe, it } from 'node:test'
import {
  KIT_LAYOUT_DIR,
  LEGACY_LAYOUT_DIR,
  kitLayoutJoin,
  legacyLayoutJoin,
  resolveLayoutFile,
} from '../src/cli-shared.ts'

describe('F4 layout resolve (scheme B)', () => {
  it('常量钉死现行 / legacy 根名', () => {
    assert.equal(KIT_LAYOUT_DIR, '.coding-kit')
    assert.equal(LEGACY_LAYOUT_DIR, '.cyning-harness')
  })

  it('resolveLayoutFile：kit 优先；仅 legacy 时回退；皆无时 source=none 且 abs 指向 kit', async () => {
    const dir = await mkdtemp(path.join(os.tmpdir(), 'dsh-ck-f4-'))
    try {
      const none = resolveLayoutFile(dir, 'manifest.json')
      assert.equal(none.source, 'none')
      assert.equal(none.abs, kitLayoutJoin(dir, 'manifest.json'))

      await mkdir(path.join(dir, LEGACY_LAYOUT_DIR), { recursive: true })
      await writeFile(path.join(dir, LEGACY_LAYOUT_DIR, 'manifest.json'), '{"version":"1.2.0"}\n', 'utf8')
      const leg = resolveLayoutFile(dir, 'manifest.json')
      assert.equal(leg.source, 'legacy')
      assert.equal(leg.abs, legacyLayoutJoin(dir, 'manifest.json'))

      await mkdir(path.join(dir, KIT_LAYOUT_DIR), { recursive: true })
      await writeFile(path.join(dir, KIT_LAYOUT_DIR, 'manifest.json'), '{"version":"1.12.1"}\n', 'utf8')
      const kit = resolveLayoutFile(dir, 'manifest.json')
      assert.equal(kit.source, 'kit')
      assert.equal(kit.abs, kitLayoutJoin(dir, 'manifest.json'))
      assert.equal(existsSync(legacyLayoutJoin(dir, 'manifest.json')), true)
    } finally {
      await rm(dir, { recursive: true, force: true })
    }
  })
})
