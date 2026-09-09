import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, it } from 'node:test'
import { fileURLToPath } from 'node:url'
import { load as yamlLoad } from 'js-yaml'

const KIT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const PKG = path.join(KIT, 'package.json')
const ONTO = path.join(KIT, 'assets', 'ontology.yaml')
const DISC = path.join(KIT, 'assets', 'harness', 'discipline-coverage.yaml')
const SPEC = path.join(KIT, 'SPEC.md')

/**
 * F5 方案 B · 现行版本钉集合（不含仓根 SPEC.md 标题版本）。
 * 包版本真值 = package.json#version；随 npm test → prepublishOnly。
 */
describe('F5 version pins · scheme B', { concurrency: 1 }, () => {
  const pkg = JSON.parse(readFileSync(PKG, 'utf8')) as { version: string; files?: string[] }
  const version = pkg.version

  it('钉点清单：ontology product_semver === package.json', () => {
    const body = readFileSync(ONTO, 'utf8')
    const m = /^product_semver:\s*"([^"]+)"/m.exec(body)
    assert.ok(m, 'ontology 缺 product_semver')
    assert.equal(m![1], version)
  })

  it('钉点清单：discipline as_of_package_version === package.json', () => {
    const data = yamlLoad(readFileSync(DISC, 'utf8')) as { as_of_package_version?: string }
    assert.equal(data.as_of_package_version, version)
  })

  it('钉点清单：README 双文件中 dsh-coding-kit@x.y.z 均等于包版本', () => {
    const re = /dsh-coding-kit@(\d+\.\d+\.\d+)/g
    for (const rel of ['README.md', 'README.zh-CN.md']) {
      const body = readFileSync(path.join(KIT, rel), 'utf8')
      const found: string[] = []
      let m: RegExpExecArray | null
      while ((m = re.exec(body))) found.push(m[1])
      assert.ok(found.length >= 1, `${rel} 须至少一处 dsh-coding-kit@x.y.z`)
      for (const v of found) {
        assert.equal(v, version, `${rel} 钉点漂移: @${v} ≠ ${version}`)
      }
    }
  })

  it('方案 B：SPEC.md 须 ARCHIVED；标题史实版本可 ≠ 包版本（不纳入钉点）', () => {
    const body = readFileSync(SPEC, 'utf8')
    assert.match(body, /ARCHIVED EPIC/)
    assert.match(body, /F5 方案 B|方案 B/)
    assert.match(body, /不.*要求本文件与包版本对齐|不要求本文件与包版本对齐/)
    // 史实标题仍可钉 1.2.0
    assert.match(body, /dsh-coding-kit@1\.2\.0/)
    // 明确允许与包版本不同（本仓现状：包已演进）
    assert.notEqual(version, '1.2.0', '前置：包版本已离开 1.2.0 史实 epic，否则本断言无意义')
  })

  it('纪律：SPEC.md 不进 npm files（与 D8 一致）', () => {
    assert.equal(Array.isArray(pkg.files) && pkg.files.includes('SPEC.md'), false)
  })
})
