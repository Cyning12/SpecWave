import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, it } from 'node:test'
import { fileURLToPath } from 'node:url'
import { load as yamlLoad } from 'js-yaml'

const KIT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const ONTO = path.join(KIT, 'assets', 'ontology.yaml')
const PKG = path.join(KIT, 'package.json')

/**
 * 1.12 O1 · ontology 浅校验（结构消费面 · 非独立 CLI ontology-check）。
 * 深度 CLI 另开 SPEC；本测守 F5=B（product_semver 钉包版本）。
 */
describe('1.12 ontology shallow (O1)', { concurrency: 1 }, () => {
  const raw = readFileSync(ONTO, 'utf8')
  const data = yamlLoad(raw) as Record<string, unknown>
  const pkg = JSON.parse(readFileSync(PKG, 'utf8')) as { version: string }

  it('必填顶栏：version / product_semver / classes / axioms / starter_hats', () => {
    for (const k of ['version', 'product_semver', 'classes', 'axioms', 'starter_hats']) {
      assert.ok(k in data, `缺字段 ${k}`)
    }
    assert.equal(typeof data.version, 'string')
    assert.equal(data.product_semver, pkg.version)
  })

  it('classes 非空且每条含 id', () => {
    const classes = data.classes as Array<{ id?: string }>
    assert.ok(Array.isArray(classes) && classes.length >= 1)
    for (const c of classes) assert.ok(c.id, 'class 缺 id')
  })

  it('axioms 均 ONTO- 前缀', () => {
    const axioms = data.axioms as Array<{ id?: string }>
    assert.ok(Array.isArray(axioms) && axioms.length >= 1)
    for (const a of axioms) {
      assert.ok(a.id, 'axiom 缺 id')
      assert.match(String(a.id), /^ONTO-/)
    }
  })

  it('starter_hats 含 10/20/30/40', () => {
    const hats = data.starter_hats as Array<{ hat_id?: string }>
    const ids = new Set(hats.map((h) => h.hat_id))
    for (const need of ['10-task', '20-task-audit', '30-execute-code', '40-self-check']) {
      assert.ok(ids.has(need), `缺 starter hat ${need}`)
    }
  })

  it('投影页存在且声明非第二钉点', () => {
    const body = readFileSync(path.join(KIT, 'docs', 'ontology', 'CURRENT_CAPABILITY.md'), 'utf8')
    assert.match(body, /F5=B|第二钉点/)
    assert.match(body, /ontology\.yaml/)
  })
})
