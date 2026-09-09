import assert from 'node:assert/strict'
import { readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, it } from 'node:test'
import { fileURLToPath } from 'node:url'
import {
  S2_TRUTH_PREFIXES,
  isS2AbsPath,
  isS2RelPath,
} from '../src/cli-shared.ts'

const KIT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const SRC = path.join(KIT, 'src')

describe('F1 S2 真值源唯一化', { concurrency: 1 }, () => {
  it('常量含规范三前缀 + legacy 裸前缀（并集 · 不缩小）', () => {
    const set = new Set(S2_TRUTH_PREFIXES)
    for (const p of [
      'docs/tasks',
      'docs/harness/reviews',
      'docs/harness/invokes/by-task',
      'reviews',
      'invokes/by-task',
    ]) {
      assert.ok(set.has(p as (typeof S2_TRUTH_PREFIXES)[number]), `missing ${p}`)
    }
    assert.equal(S2_TRUTH_PREFIXES.length, 5)
  })

  it('相对路径矩阵：命中 / 近邻不误杀', () => {
    const hit = [
      'docs/tasks',
      'docs/tasks/active/t.md',
      'docs/harness/reviews/r.md',
      'docs/harness/invokes/by-task/slug/x.md',
      'reviews/r.md',
      'invokes/by-task/x.md',
    ]
    for (const p of hit) assert.equal(isS2RelPath(p), true, `expect hit: ${p}`)

    const miss = [
      'docs/harness/prompts/00-orchestrator.md',
      'docs/harness/templates/TASK_TEMPLATE.md',
      '.coding-kit/manifest.json',
      '.dsh/coding-kit/standards/x.md',
      'assets/skills/harness-10-spec/SKILL.md',
      'docs/releases/03_defects_debt_ledger.md',
      'src/cli-shared.ts',
    ]
    for (const p of miss) assert.equal(isS2RelPath(p), false, `expect miss: ${p}`)
  })

  it('绝对路径矩阵 + .dsh/skills 白名单', () => {
    const root = '/tmp/consumer-repo'
    assert.equal(isS2AbsPath(path.join(root, 'docs/tasks/active/a.md')), true)
    assert.equal(isS2AbsPath(path.join(root, 'docs/harness/reviews/x.md')), true)
    assert.equal(isS2AbsPath(path.join(root, 'reviews/x.md')), true)
    assert.equal(isS2AbsPath(path.join(root, '.coding-kit/manifest.json')), false)
    assert.equal(isS2AbsPath(path.join(root, 'docs/harness/prompts/a.md')), false)
    assert.equal(isS2AbsPath(path.join(root, '.dsh/skills')), false)
    assert.equal(isS2AbsPath(path.join(root, '.dsh/skills/foo/SKILL.md')), false)
  })

  it('src/ 无第二份 S2 前缀字面量列表（唯一性扫描）', () => {
    const files = readdirSync(SRC).filter((f) => f.endsWith('.ts'))
    const offenders: string[] = []
    const banned = [
      /S2_SKIP_PREFIXES\s*=/,
      /const\s+S2_RE\s*=/,
      /const\s+s2Prefixes\s*=/,
      /function\s+isS2Dest\s*\(/,
      /function\s+isS2Path\s*\(/,
      /function\s+assertNotS2\s*\(/,
    ]
    for (const f of files) {
      if (f === 'cli-shared.ts') continue
      const body = readFileSync(path.join(SRC, f), 'utf8')
      for (const re of banned) {
        if (re.test(body)) offenders.push(`${f} ~ ${re}`)
      }
      // 本地再硬编码「docs/tasks + reviews + invokes」三元组数组
      if (
        /\[\s*['"]docs\/tasks['"]/.test(body) &&
        /['"]reviews['"]/.test(body) &&
        /['"]invokes\/by-task['"]/.test(body)
      ) {
        offenders.push(`${f} ~ inline S2 prefix array`)
      }
    }
    assert.deepEqual(offenders, [], `local S2 defs remain: ${offenders.join('; ')}`)
  })

  it('四锚点文件均 import cli-shared S2 符号', () => {
    for (const f of [
      'index.ts',
      'cli-refresh-ide-blocks.ts',
      'cli-graph-hgm.ts',
      'cli-skills.ts',
    ]) {
      const body = readFileSync(path.join(SRC, f), 'utf8')
      assert.match(body, /from ['"]\.\/cli-shared\.ts['"]/, `${f} missing cli-shared import`)
      assert.match(
        body,
        /isS2RelPath|isS2AbsPath|assertNotS2Abs|S2_TRUTH_PREFIXES/,
        `${f} missing S2 symbol use`,
      )
    }
  })
})
