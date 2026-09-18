import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { describe, it } from 'node:test'
import { retargetMarkdown } from '../src/cli/close-retarget.ts'
import { runCore } from './_helpers/core-harness.ts'

const ROOT = '/repo'
const SOURCE = path.join(ROOT, 'docs/harness/reviews/r.md')
const FROM = path.join(ROOT, 'docs/tasks/active/t.md')
const TO = path.join(ROOT, 'docs/tasks/done/t.md')

describe('task close · 归档后改写指向该文件的链接', () => {
  it('只改指向本文件的链接；围栏、行内代码、其它文件、旁白不动', () => {
    const input = [
      '[`docs/tasks/active/t.md`](../../tasks/active/t.md) 审时为 active/',
      '',
      '```',
      '[x](../../tasks/active/t.md)',
      '```',
      '',
      '行内 `[nope](../../tasks/active/t.md)` 不动',
      '',
      '[other](../../tasks/active/other.md)',
      '',
      '[hash](../../tasks/active/t.md#s)',
      '',
      '[ref]: ../../tasks/active/t.md',
      '',
      '<a href="../../tasks/active/t.md">x</a>',
    ].join('\n')
    const { text, count } = retargetMarkdown(input, SOURCE, FROM, TO, ROOT)
    assert.equal(count, 4)
    assert.match(text, /\[`docs\/tasks\/done\/t\.md`\]\(\.\.\/\.\.\/tasks\/done\/t\.md\) 审时为 active\//)
    assert.match(text, /```\n\[x\]\(\.\.\/\.\.\/tasks\/active\/t\.md\)\n```/)
    assert.match(text, /行内 `\[nope\]\(\.\.\/\.\.\/tasks\/active\/t\.md\)` 不动/)
    assert.match(text, /\[other\]\(\.\.\/\.\.\/tasks\/active\/other\.md\)/)
    assert.match(text, /\[hash\]\(\.\.\/\.\.\/tasks\/done\/t\.md#s\)/)
    assert.match(text, /\[ref\]: \.\.\/\.\.\/tasks\/done\/t\.md/)
    assert.match(text, /<a href="\.\.\/\.\.\/tasks\/done\/t\.md">/)
  })

  it('task close --yes 改审查文链接；dry-run 不改', async () => {
    const dir = await mkdtemp(path.join(os.tmpdir(), 'dsh-ck-retarget-'))
    await mkdir(path.join(dir, '.git'), { recursive: true })
    try {
      const taskRel = 'docs/tasks/active/task_retarget.md'
      const taskAbs = path.join(dir, taskRel)
      await mkdir(path.dirname(taskAbs), { recursive: true })
      await writeFile(
        taskAbs,
        [
          '# Task retarget',
          '',
          '> **状态**：`done`',
          '',
          '## Harness 元信息',
          '',
          '| 字段 | 值 |',
          '|------|-----|',
          '| **task_slug** | `retarget` |',
          '| **test_strategy** | `recommended` |',
          '| **wiki_delta** | `none` |',
          '',
          '### 人工闸',
          '',
          '| human_gate_id | status | blocks_hats | 说明 |',
          '|---------------|--------|-------------|------|',
          '| HG-TASK-DRAFT | approved | 20,30 | fixture |',
          '| HG-AUDIT-R1 | approved | 30 | fixture |',
          '',
          '## 验收标准',
          '',
          '- [x] fixture item',
          '',
          '## 失败路径',
          '',
          '| F | Scenario |',
          '|---|----------|',
          '| F1 | fixture |',
          '',
          '### 自检结论（执行者）',
          '',
          '自检已回填：fixture retarget。',
          '',
        ].join('\n'),
        'utf8',
      )
      const reviewRel = 'docs/harness/reviews/r.md'
      const reviewAbs = path.join(dir, reviewRel)
      await mkdir(path.dirname(reviewAbs), { recursive: true })
      const review = '[`docs/tasks/active/task_retarget.md`](../../tasks/active/task_retarget.md)\n'
      await writeFile(reviewAbs, review, 'utf8')
      const allow = [
        '--allow-invoke-gap', '--allow-no-review', '--allow-kpi-gap', '--allow-wiki-gap',
        '--allow-no-pr-merge', '--allow-no-hub', '--allow-experience-gap',
      ]

      const dry = await runCore(['task', 'close', '--file', taskAbs, ...allow])
      assert.equal(dry.status, 0, dry.combined)
      assert.match(dry.stdout, /CLOSE: READY/)
      assert.equal(await readFile(reviewAbs, 'utf8'), review)
      assert.equal(existsSync(taskAbs), true)

      const pass = await runCore(['task', 'close', '--file', taskAbs, '--yes', ...allow])
      assert.equal(pass.status, 0, pass.combined)
      assert.match(pass.stdout, /CLOSE: PASS · retarget/)
      assert.match(pass.stdout, /retarget: 1/)
      assert.equal(existsSync(taskAbs), false)
      assert.equal(existsSync(path.join(dir, 'docs/tasks/done/task_retarget.md')), true)
      const after = await readFile(reviewAbs, 'utf8')
      assert.match(after, /docs\/tasks\/done\/task_retarget\.md/)
      assert.match(after, /\.\.\/\.\.\/tasks\/done\/task_retarget\.md/)
      assert.equal(after.includes('tasks/active/'), false)
    } finally {
      await rm(dir, { recursive: true, force: true })
    }
  })
})
