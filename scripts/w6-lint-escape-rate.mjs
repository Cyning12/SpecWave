#!/usr/bin/env node
// 3.0-W6 S6.5 N2-C lint 逃逸率测量脚本（同一脚本同一语料 · 防口径漂移 · 硬约束 14 · F-W6-04 判据面）。
// 用法：node --experimental-strip-types scripts/w6-lint-escape-rate.mjs
//
// 口径（task S6.5 定稿）：
//   语料 = docs/tasks/{done,active}/task_*.md（排除非 task 的 README.md）。
//   前基线 = lintTaskFile errors>0 的文件集（lint 不在 verify 链 ⇒ 逃逸率 100% · 2026-09-17 实测 27 件）。
//   后测   = 同语料影子仓（temp · .git + 测试制品占位中性化 D5）复跑 verify --task
//            （--allow-no-review --allow-invoke-gap 中性化 T4/T5 闸 · 只观 lint/G4 两新步）：
//            · active 投影：每件 lint-FAIL 文件复制入 shadow active/ → 须全部 BLOCKED · task lint FAIL（failClosed）
//            · done 原位：不得被 lint/思考轮步 BLOCKED（warn 降级 · 逐条枚举 · 不追溯存量）
//   逃逸率 = lint-FAIL 且 verify 未因 lint 被判 BLOCKED 的比例（active 投影面硬判据 = 0%）。
import { spawnSync } from 'node:child_process'
import { cpSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { lintTaskFile } from '../src/checks/lint.ts'
import { findGate, parseHumanGates } from '../src/cli-shared.ts'

const KIT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const CLI_TS = path.join(KIT, 'src', 'cli.ts')

const corpus = []
for (const scope of ['active', 'done']) {
  const dir = path.join(KIT, 'docs', 'tasks', scope)
  for (const f of readdirSync(dir)) {
    if (/^task_.*.md$/.test(f)) corpus.push({ scope, rel: 'docs/tasks/' + scope + '/' + f })
  }
}

const lintFails = []
for (const c of corpus) {
  const r = lintTaskFile(path.join(KIT, c.rel), KIT)
  if (r.errors.length > 0) lintFails.push({ ...c, rules: r.errors.map((e) => e.rule).join('/') })
}
console.log('语料:', corpus.length, '件 · lint FAIL:', lintFails.length, '件（' + ((100 * lintFails.length) / corpus.length).toFixed(1) + '%）')
console.log('前基线：lint 不在 verify 链 ⇒ 逃逸率 100%（' + lintFails.length + '/' + lintFails.length + ' 全逃逸）')

const shadow = mkdtempSync(path.join(os.tmpdir(), 'w6-escape-'))
try {
  mkdirSync(path.join(shadow, '.git'), { recursive: true })
  mkdirSync(path.join(shadow, 'test'), { recursive: true })
  writeFileSync(path.join(shadow, 'test', 'dummy.test.ts'), '// 占位：中性化 D5 test-check\n')
  cpSync(path.join(KIT, 'docs', 'tasks'), path.join(shadow, 'docs', 'tasks'), { recursive: true })

  const run = (rel) =>
    spawnSync(
      process.execPath,
      ['--experimental-strip-types', CLI_TS, 'verify', '--task', rel, '--target', shadow, '--allow-no-review', '--allow-invoke-gap'],
      { encoding: 'utf8', cwd: KIT },
    )

  // done 原位：lint/G4 两新步不得 BLOCKED 任何 done（warn 降级硬条）
  const doneWarns = []
  const doneBlocked = []
  for (const c of corpus.filter((x) => x.scope === 'done')) {
    const r = run(c.rel)
    const out = (r.stdout ?? '') + '\n' + (r.stderr ?? '')
    if (/VERIFY: BLOCKED · (task lint FAIL|思考轮控制表缺口)/.test(out)) doneBlocked.push(c.rel)
    if (/verify: warn · (task lint FAIL|思考轮控制表缺口)/.test(out)) {
      const kinds = [...out.matchAll(/verify: warn · (task lint FAIL|思考轮控制表缺口)（([^·）]+)/g)].map((m) => m[1] + ':' + m[2].trim())
      doneWarns.push(c.rel.replace('docs/tasks/done/', '') + ' · ' + kinds.join(' · '))
    }
  }

  // active 投影：lint-FAIL 文件逐一投影 → 须全部 BLOCKED · task lint FAIL。
  // 投影中性化（与 --allow-no-review 同类 · 只影影子仓 · 语料原文不动）：legacy done 的闸表为
  // 3 列旧形态（parseHumanGates 4 列口径取不到 → gate-check 先拦），为把拦截归因到 lint 步本身，
  // 投影件缺 approved HG-AUDIT-R1 时替换首个「### 人工闸」节为合规双闸表。
  let escaped = 0
  const escapedList = []
  const upstreamBlocked = []
  for (const c of lintFails) {
    const projRel = 'docs/tasks/active/' + path.basename(c.rel)
    if (c.scope !== 'active') {
      let body = readFileSync(path.join(KIT, c.rel), 'utf8')
      const gates = parseHumanGates(body)
      if (findGate(gates, 'HG-AUDIT-R1')?.status !== 'approved') {
        const table =
          '### 人工闸\n\n| human_gate_id | status | blocks_hats | 说明 |\n|---------------|--------|-------------|------|\n| HG-TASK-DRAFT | approved | 20,30 | 测量投影中性化 |\n| HG-AUDIT-R1 | approved | 30 | 测量投影中性化 |\n\n'
        const idx = body.indexOf('### 人工闸')
        if (idx >= 0) {
          const rest = body.slice(idx + 10)
          const m = rest.search(/^#{2,3} /m)
          body = m === -1 ? body.slice(0, idx) + table : body.slice(0, idx) + table + rest.slice(m)
        } else {
          body += '\n' + table
        }
      }
      mkdirSync(path.dirname(path.join(shadow, projRel)), { recursive: true })
      writeFileSync(path.join(shadow, projRel), body, 'utf8')
    }
    const r = run(projRel)
    const out = (r.stdout ?? '') + '\n' + (r.stderr ?? '')
    if (r.status === 2 && /VERIFY: BLOCKED · task lint FAIL/.test(out)) {
      // lint 步直接点名拦截（判据字面口径）
    } else if (r.status === 2) {
      upstreamBlocked.push(c.rel + '（上游闸先拦 · 非 lint 步点名 · 门禁面零穿透）')
    } else {
      escaped++
      escapedList.push(c.rel + '（status=' + r.status + ' · 穿透门禁）')
    }
  }

  console.log('')
  console.log('== 后测（影子仓 · 同语料） ==')
  console.log('done 原位复跑：', corpus.filter((x) => x.scope === 'done').length, '件 · 被 lint/G4 新步 BLOCKED:', doneBlocked.length, '件', doneBlocked.length ? doneBlocked : '（硬条达成 · 零静默转 BLOCKED）')
  console.log('done warn 降级枚举（' + doneWarns.length + ' 件 · 不追溯存量 · 逐条登记）:')
  for (const w of doneWarns) console.log('  -', w)
  const total = lintFails.length
  console.log('active 投影面：lint-FAIL ' + total + ' 件 · lint 步 BLOCKED ' + (total - escaped - upstreamBlocked.length) + ' · 上游闸先拦 ' + upstreamBlocked.length + ' · 穿透（exit 0）' + escaped)
  console.log('穿透率（lint-FAIL 且 verify 全链 exit 0）：前 100%（' + total + '/' + total + '）→ 后 ' + (total === 0 ? 'n/a' : ((100 * escaped) / total).toFixed(1) + '%'), escaped === 0 ? '· 硬判据达成（active 面 0% 穿透）' : '· 未达标')
  if (upstreamBlocked.length) console.log('上游闸先拦枚举:', upstreamBlocked)
  if (escapedList.length) console.log('穿透清单:', escapedList)
  if (doneBlocked.length > 0 || escaped > 0) process.exit(1)
} finally {
  rmSync(shadow, { recursive: true, force: true })
}
