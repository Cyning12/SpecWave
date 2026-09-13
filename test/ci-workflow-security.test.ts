import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, it } from 'node:test'
import { fileURLToPath } from 'node:url'

const KIT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

function readWorkflow(name: string): string {
  return readFileSync(path.join(KIT, '.github', 'workflows', name), 'utf8')
}

// 2.3-W3 ④（C4 · SPEC 03 §5.4）：CI 最小权限 + 依赖/密钥扫描钉面（task_2_3_wiring_w3_security_observability）
describe('2.3-W3 C4 · CI workflow 安全基线', () => {
  it('ci.yml 顶层 permissions 最小化（contents: read）', () => {
    const y = readWorkflow('ci.yml')
    assert.match(y, /^permissions:\s*\n\s+contents:\s*read\s*$/m, 'ci.yml 须含顶层 permissions: contents: read')
  })

  it('ci.yml 依赖扫描 job：npm audit --audit-level=high（fail-closed · D-23-W3-AUDIT-GATE）', () => {
    const y = readWorkflow('ci.yml')
    assert.match(y, /^ {2}audit:\s*$/m, 'ci.yml 须存在 audit job')
    assert.match(y, /npm audit --audit-level=high/, 'audit job 须跑 npm audit --audit-level=high')
  })

  it('ci.yml 密钥扫描 job：gitleaks --no-git 工作树档（D-23-W3-GITLEAKS-FORM）', () => {
    const y = readWorkflow('ci.yml')
    assert.match(y, /^ {2}secrets-scan:\s*$/m, 'ci.yml 须存在 secrets-scan job')
    assert.match(y, /gitleaks/, 'secrets-scan 须用 gitleaks')
    assert.match(y, /--no-git/, 'gitleaks 须为 --no-git 工作树档')
  })

  it('tech-graph.yml 顶层 permissions 最小化（contents: read）', () => {
    const y = readWorkflow('tech-graph.yml')
    assert.match(y, /^permissions:\s*\n\s+contents:\s*read\s*$/m, 'tech-graph.yml 须含顶层 permissions: contents: read')
  })
})
