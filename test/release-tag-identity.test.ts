import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, it } from 'node:test'
import { fileURLToPath } from 'node:url'

const KIT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const PKG = path.join(KIT, 'package.json')

/**
 * 发布溯源：git tag `v<package.json#version>` 指向的 package.json
 * 须与当前包名/版本一致（防 2.1.1 改名期 tag↔npm 身份错位重演）。
 *
 * 纪律：bump 后须先打 `vX.Y.Z` 再期望本测绿 / publish（对齐 RELEASING）。
 * CI 须能拿到 tags（checkout fetch-tags）。
 */
describe('release tag identity · git tag ↔ package.json', { concurrency: 1 }, () => {
  const pkg = JSON.parse(readFileSync(PKG, 'utf8')) as { name: string; version: string }
  const tag = `v${pkg.version}`

  it(`tag ${tag} 存在，且 package.json#name/#version 与当前包一致`, () => {
    const verified = spawnSync('git', ['rev-parse', '--verify', `refs/tags/${tag}`], {
      cwd: KIT,
      encoding: 'utf8',
    })
    assert.equal(
      verified.status,
      0,
      `缺少 git tag ${tag}（发布溯源）。请先：git tag ${tag} <publish-commit>。stderr=${verified.stderr}`,
    )

    const show = spawnSync('git', ['show', `${tag}:package.json`], {
      cwd: KIT,
      encoding: 'utf8',
    })
    assert.equal(show.status, 0, `git show ${tag}:package.json 失败：${show.stderr}`)
    const tagged = JSON.parse(show.stdout) as { name?: string; version?: string }
    assert.equal(tagged.name, pkg.name, `${tag} 包名 ${tagged.name} ≠ 当前 ${pkg.name}`)
    assert.equal(tagged.version, pkg.version, `${tag} 版本 ${tagged.version} ≠ 当前 ${pkg.version}`)
  })
})
