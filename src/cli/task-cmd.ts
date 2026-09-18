import { existsSync, mkdirSync, renameSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { appendAuditEvent, resolveAuditFile, stampAuditEvent } from '../audit/log.ts'
import { buildDoneSnapshot, extractTaskSlug, fail, findGitRoot, parseHarnessMeta, printJson, takeOption, toRel } from '../cli-shared.ts'
import { evalCloseExecEvidence, evalCloseGuard, lintTaskFile } from '../cli-checks.ts'
import { cmdTaskCheck, cmdTaskLintDone, cmdTaskLintWikiDelta } from '../cli-task-extra.ts'
import { retargetClosedTaskLinks } from './close-retarget.ts'
import { CLOSE_GUARD_ORDER, TASK_USAGE } from './usage.ts'

async function cmdTaskLint(args: string[]): Promise<void> {
  const json = args.includes('--json')
  let rest = args.filter((a) => a !== '--json')
  const { value: fileArg, rest: r1 } = takeOption(rest, '--file')
  rest = r1
  if (rest.length > 0) fail(`task lint 未知参数: ${rest.join(' ')}`)
  if (!fileArg) fail('task lint 须指定 --file PATH')
  const result = lintTaskFile(fileArg, process.cwd())
  if (json) {
    // 2.4.1 NEW-2（D-24-OUTPUT-REL-EXIT 补漏）：基参取命令 target = 任务文件所在仓根
    // （findGitRoot 上溯 · 无 .git 回落 cwd 保持旧行为）——cwd≠target 时 result.file 仍可相对化
    const target = findGitRoot(result.file) ?? process.cwd()
    printJson(target, result)
  } else {
    for (const e of result.errors) {
      console.log(`  - [${e.rule}${e.line ? `:L${e.line}` : ''}] ${e.message}`)
    }
    for (const w of result.warnings) {
      console.log(`warn: [${w.rule}${w.line ? `:L${w.line}` : ''}] ${w.message}`)
    }
    console.log(`LINT: ${result.ok ? 'PASS' : 'FAIL'} · ${path.basename(result.file)}`)
  }
  if (!result.ok) fail('', 2)
}

async function cmdTaskClose(args: string[]): Promise<void> {
  const yes = args.includes('--yes')
  // K5（close-done-snapshot · 拟 1.8.0）：task close 新增 --json 旗标
  // （done_snapshot 唯绑归档事件 · 20 审 R2 口径裁决）
  const json = args.includes('--json')
  // DEF-003 阶段二 T6 + doc-health：close 守卫豁免旗标
  const allowUnchecked = args.includes('--allow-unchecked')
  const allowInvokeGap = args.includes('--allow-invoke-gap')
  const allowNoReview = args.includes('--allow-no-review')
  const allowKpiGap = args.includes('--allow-kpi-gap')
  const allowExperienceGap = args.includes('--allow-experience-gap')
  const allowWikiGap = args.includes('--allow-wiki-gap')
  const allowNoPrMerge = args.includes('--allow-no-pr-merge')
  const allowNoHub = args.includes('--allow-no-hub')
  let rest = args.filter(
    (a) =>
      a !== '--yes' &&
      a !== '--json' &&
      a !== '--allow-unchecked' &&
      a !== '--allow-invoke-gap' &&
      a !== '--allow-no-review' &&
      a !== '--allow-kpi-gap' &&
      a !== '--allow-experience-gap' &&
      a !== '--allow-wiki-gap' &&
      a !== '--allow-no-pr-merge' &&
      a !== '--allow-no-hub',
  )
  const { value: fileArg, rest: r1 } = takeOption(rest, '--file')
  rest = r1
  const { value: targetArg, rest: r2 } = takeOption(rest, '--target')
  rest = r2
  // 3.0-W6 S6.1：--audit-file 仅改审计落点（相对 task 所在仓根解析 · 仓外拒 + S2 拒写双兜底 · 无豁免参数）
  const { value: auditFile, rest: r3 } = takeOption(rest, '--audit-file')
  rest = r3
  if (rest.length > 0) fail(`task close 未知参数: ${rest.join(' ')}`)
  if (!fileArg) fail('task close 须指定 --file PATH')
  const abs = path.resolve(process.cwd(), fileArg)
  if (!existsSync(abs)) fail(`task 文件不存在: ${fileArg}`, 2)
  // 2.4.1 NEW-2：--json 基参取命令 target = task 文件所在仓根（findGitRoot 上溯 · 无 .git 回落 cwd
  // 保持旧行为）——cwd≠target 时 dest/done_snapshot/blockers 内嵌路径仍可相对化（报告 §3 代理复现面）
  const closeJsonBase = findGitRoot(abs) ?? process.cwd()
  // F-W6-02/F-W6-07：审计落点合法性 fail-fast（拒写硬失败不降级 · 先于守卫求值）
  resolveAuditFile(closeJsonBase, auditFile)
  const closeStartedAt = Date.now()
  const content = await readFile(abs, 'utf8')
  const meta = parseHarnessMeta(content)
  const fileSlug = extractTaskSlug(abs)
  const slug = meta.task_slug ?? fileSlug
  // 3.0-W6 S6.1 ③：close verdict 三态落审计轨（观测面纯旁路 · appendAuditEvent 单一实现源）。
  // 偏差登记（留 20 复核）：verdict 枚举 v1 = PASS|BLOCKED|FAIL 无 READY —— dry-run READY
  // 映射 verdict=PASS + detail 点名「READY（dry-run · 未执行归档）」区分真归档 PASS。
  const emitCloseAudit = (verdict: 'PASS' | 'BLOCKED', exitCode: number, detail?: string): void => {
    appendAuditEvent(
      closeJsonBase,
      stampAuditEvent({
        event: 'task_close',
        verdict,
        exit_code: exitCode,
        task: slug,
        ...(detail ? { detail: detail.slice(0, 300) } : {}),
        duration_ms: Date.now() - closeStartedAt,
      }),
      { auditFile },
    )
  }
  const blockers: string[] = []
  const traces: string[] = []
  const closeAllowFlags: Record<string, string | undefined> = {
    close_invoke: allowInvokeGap ? '--allow-invoke-gap' : undefined,
    close_acceptance: allowUnchecked ? '--allow-unchecked' : undefined,
    close_review: allowNoReview ? '--allow-no-review' : undefined,
    close_kpi: allowKpiGap ? '--allow-kpi-gap' : undefined,
    close_experience: allowExperienceGap ? '--allow-experience-gap' : undefined,
    close_wiki_delta: allowWikiGap ? '--allow-wiki-gap' : undefined,
    close_wiki_promotion: allowWikiGap ? '--allow-wiki-gap' : undefined,
    close_pr_merged: allowNoPrMerge ? '--allow-no-pr-merge' : undefined,
    close_hub_index: allowNoHub ? '--allow-no-hub' : undefined,
  }
  for (const guardId of CLOSE_GUARD_ORDER) {
    const outcome = evalCloseGuard(guardId, abs, content)
    if (!outcome) continue
    if (outcome.status === 'warn') {
      traces.push(`close: warn · ${guardId} · ${outcome.detail}`)
      continue
    }
    if (outcome.status === 'fail') {
      const flag = closeAllowFlags[guardId]
      if (flag) traces.push(`close: 留痕 · ${guardId} · ${outcome.detail} → ${flag} 豁免生效`)
      else blockers.push(`${guardId}: ${outcome.detail}`)
    }
  }
  // 3.0-W6 S6.6 G7 执行证据对照（warn-only · 00 裁定诚实口径）：自检结论声称 verify 而审计轨无
  // 对应 verify PASS 事件 → warn 点名不挡 close（traces 同格式旁路 · 故意不入 CLOSE_GUARD_ORDER
  // 防 dry-run/lifecycle 面扰动 · 升 failClosed 归后续 SPEC 明文裁决）。
  const execEvidence = evalCloseExecEvidence(abs, content)
  if (execEvidence) traces.push(`close: warn · close_exec_evidence · ${execEvidence.detail}`)
  const activeDir = path.dirname(abs)
  const inActive = path.basename(activeDir) === 'active'
  let dest: string | null = null
  if (targetArg && path.basename(targetArg).endsWith('.md')) {
    dest = path.resolve(process.cwd(), targetArg)
  } else if (!inActive) {
    blockers.push('源文件不在 */active/ 且未指定 --target（拒绝对 done 文件二次 close）')
  } else {
    dest = path.join(path.dirname(activeDir), 'done', path.basename(abs))
  }
  if (dest && existsSync(dest)) blockers.push(`目标已存在（不覆盖）: ${toRel(process.cwd(), dest)}`)
  if (!json) {
    for (const t of traces) console.log(t)
  }
  if (blockers.length > 0) {
    emitCloseAudit('BLOCKED', 2, blockers.join('；'))
    if (json) {
      // K5：--json BLOCKED —— 非 0 退出 · JSON 仅错误面（无 done_snapshot 字段）
      printJson(closeJsonBase, { ok: false, status: 'BLOCKED', slug, blockers, traces })
    } else {
      for (const b of blockers) console.log(`  - ${b}`)
      console.log(`CLOSE: BLOCKED · ${slug}`)
    }
    fail('', 2)
  }
  if (!yes) {
    emitCloseAudit('PASS', 0, 'READY（dry-run · 未执行归档）')
    if (json) {
      // K5：--json READY（dry-run · 含豁免 dry-run）—— 未归档 → done_snapshot 恒 null · exit 0
      printJson(closeJsonBase, { ok: true, status: 'READY', slug, dest, traces, done_snapshot: null })
    } else {
      console.log('mode: dry-run（未执行 mv · 加 --yes 执行）')
      // 2.4-W3（D-24-OUTPUT-REL-EXIT）：人类输出路径值同口径相对化（C3 零泄漏）
      console.log(`dest: ${toRel(process.cwd(), dest ?? '')}`)
      console.log(`CLOSE: READY · ${slug}`)
    }
    return
  }
  if (!dest) fail('无法解析归档目标', 2)
  mkdirSync(path.dirname(dest), { recursive: true })
  renameSync(abs, dest)
  // 归档使 active/ 路径失效。同一次 --yes 改写 docs 里正好指向该文件的 Markdown 链接，
  // 不依赖 30 事后手改。dry-run 不执行。历史指向其它文件的坏链不动。
  const retargeted = retargetClosedTaskLinks(closeJsonBase, abs, dest)
  traces.push(`close: retarget · ${retargeted}`)
  // K5：真归档（renameSync 执行）后构建 done 片段快照 —— 摘录归档文件内
  // HARNESS_META_HEADING 节原文（extractSection · 归档真值防模板漂移）；快照存在性
  // 唯绑归档事件，与豁免旗标无关（20 审 R2 口径裁决：豁免 + --yes → 快照照打）
  const snapshot = buildDoneSnapshot(dest)
  emitCloseAudit('PASS', 0, `归档 → ${toRel(closeJsonBase, dest)}`)
  if (json) {
    printJson(closeJsonBase, {
      ok: true,
      status: 'PASS',
      slug,
      dest,
      traces,
      done_snapshot: {
        path: snapshot.path,
        harness_meta_section: snapshot.harness_meta_section,
      },
    })
    return
  }
  // 2.4-W3（D-24-OUTPUT-REL-EXIT）：人类输出路径值同口径相对化（冻结文案 CLOSE: PASS 不动）
  console.log(`moved: ${toRel(process.cwd(), abs)} → ${toRel(process.cwd(), dest)}`)
  console.log(`CLOSE: PASS · ${slug}`)
  console.log(`retarget: ${retargeted}`)
  // K5（W1）：PASS 分支 stdout 追加快照块 —— 归档后路径 + 元信息节摘录 + 禁手写提示；
  // 取不到元信息节（异常态）打 canonical 模板占位 + WARN 行；不改 CLOSE: PASS 冻结文案，仅追加
  console.log(`done_snapshot · path: ${toRel(process.cwd(), snapshot.path)}`)
  if (snapshot.warn) console.log(`WARN: ${snapshot.warn}`)
  console.log('done_snapshot · harness_meta_section:')
  console.log(snapshot.harness_meta_section)
  console.log('done_snapshot · 禁止手写 done · 以此快照为格式真值')
}

export async function cmdTask(args: string[]): Promise<void> {
  const [sub, ...rest] = args
  if (sub === '--help' || sub === '-h') {
    console.log(`用法: ${TASK_USAGE}`)
    return
  }
  if (!sub) fail(`task 子命令未知: (空)\n用法: ${TASK_USAGE}`)
  if (sub === 'lint') {
    await cmdTaskLint(rest)
    return
  }
  if (sub === 'close') {
    await cmdTaskClose(rest)
    return
  }
  if (sub === 'lint-done') {
    await cmdTaskLintDone(rest)
    return
  }
  if (sub === 'lint-wiki-delta') {
    await cmdTaskLintWikiDelta(rest)
    return
  }
  if (sub === 'check') {
    await cmdTaskCheck(rest)
    return
  }
  fail(`task 子命令未知: ${sub}\n用法: ${TASK_USAGE}`)
}
