import { existsSync, readFileSync, statSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { appendAuditEvent, resolveAuditFile, stampAuditEvent, type AuditGateSnapshot } from '../audit/log.ts'
import { CliError, extractTaskSlug, fail, findGate, normalizeSlug, parseHarnessMeta, parseHumanGates, printJson, resolveTarget, resolveTaskPath, takeOption, toRel } from '../cli-shared.ts'
import {
  checkPre30InvokeHats,
  evalReviewConclusion,
  evalThinkingRoundStructure,
  findLatestReview,
  findReview,
  findSpecReview,
  loadLegacyGateExempt,
  resolveExemptEntry,
  runTestCheck,
  shouldSkipSpecAudit,
  type LegacyGateExemptEntry,
} from '../cli-checks.ts'
import { collectTaskFilesByScope, lintWikiDeltaMissing } from '../cli-task-extra.ts'
import { formatGateCheck } from './gates.ts'
import { collectVerifyObservability, VERIFY_BLOCKED_EXIT_CODE, type VerifyObservability } from './usage.ts'

// K3（FEEDBACK §3 · task verify-with-wiki-lint）：verify --with-wiki-lint 追加闸 ——
// 复用 lintWikiDeltaMissing 导出（默认档 · scope=all，与 PR CI assets/ci/samples/lint-wiki-delta.yml.example 对齐），
// 逻辑不复制；fail → BLOCKED + issues + 与 CI 逐字一致的复跑命令（含 --yes · sample L33）。
type WikiLintGateResult = ReturnType<typeof lintWikiDeltaMissing>

function wikiLintJson(res: WikiLintGateResult): { ok: boolean; issues: WikiLintGateResult['issues']; scanned: number } {
  return { ok: res.ok, issues: res.issues, scanned: res.scanned }
}

function printWikiLintIssues(res: WikiLintGateResult): void {
  console.log('verify: 缺 wiki_delta 字段的 task（lint-wiki-delta · scope=all · 缺口可能来自兄弟 active/done task）:')
  for (const m of res.issues) {
    console.log(`  - ${m.path} · ${m.code} · ${m.detail}`)
  }
  console.log('复跑（与 PR CI 同命令）: npx --yes spec-wave task lint-wiki-delta --target .')
}

// PRD_DEF-003 后续棒：verify --spec 真闸（SPEC→00 前查审查文存在性 · 消灭最后一个 notDelivered 命令面）。
// 语义映射旧包 @cyning/harness@2.24.0 lib/verify.js verifySpecTarget（差异见 cli-checks.ts findSpecReview 注释与 PR body）：
//   · 仅查审查文存在性，不跑 gate-check / audit D5 / task lint（与 --task 模式分离）
//   · bugfix / skip_spec_audit 元信息豁免（shouldSkipSpecAudit）→ PASS
//   · 缺失 → VERIFY: BLOCKED · missing spec R<n> review · exit 2
//   · --allow-no-spec-review（canonical · lifecycle.yaml 登记）/ --allow-no-review（别名）真豁免 · 留痕（文本 + JSON waived[]，与 T4 口径一致）
async function verifySpecMode(
  target: string,
  specFile: string,
  opts: { json: boolean; allowNoSpecReview: boolean; allowNoReview: boolean; withWikiLint: boolean },
  obs: VerifyObservability | null,
): Promise<void> {
  const abs = resolveTaskPath(target, specFile)
  const label = path.basename(abs)
  const emitJson = (
    blocked: boolean,
    extra?: { waived?: string[]; skipped?: string },
    wikiLint?: WikiLintGateResult | null,
  ): void => {
    // obs 恒非空：emitJson 全部调用点均在 opts.json 守卫内（obs 仅 --json 时计算）
    const o = obs as VerifyObservability
    printJson(target, {
      command: 'verify',
      // C3 补漏（2.3-W3 · D-23-JSON-TARGET-REL）：--json target 字段绝对 → 相对（与人类面同口径）
      target: toRel(process.cwd(), target),
      spec: specFile,
      blocked,
      verdict: blocked ? 'BLOCKED' : 'PASS',
      traceId: o.traceId,
      exitCode: blocked ? VERIFY_BLOCKED_EXIT_CODE : 0,
      source: o.source,
      injectedFiles: o.injectedFiles,
      ...(extra?.skipped ? { skipped: extra.skipped } : {}),
      ...(extra?.waived && extra.waived.length > 0 ? { waived: extra.waived } : {}),
      ...(wikiLint ? { wiki_lint: wikiLintJson(wikiLint) } : {}),
    })
  }
  // C3 补漏（2.3-W3 · D-23-W3-REL-BASE）：错误文案相对化（target 归卡基）
  if (!existsSync(abs)) fail(`错误: 未找到 --spec 文件 ${toRel(target, abs)}`)
  // F-W1-05（2.3-W1）：--spec 传目录路径本身 → 干净「用法错」exit 1
  //（止血裸 EISDIR 崩溃 · 不新增目录直读能力 · 目录型夹须传夹内 SPEC 文件）。
  if (statSync(abs).isDirectory()) {
    // C3 补漏（2.3-W3 · D-23-W3-REL-BASE）：错误文案相对化（target 归卡基）
    fail(`错误: --spec 须为 SPEC 文件（收到目录）: ${toRel(target, abs)} · 目录型夹请传 ` +
      `docs/spec/<slug>/README.md 或 SPEC_<slug>_v1.md`)
  }
  const content = await readFile(abs, 'utf8')
  // K3：--with-wiki-lint 在 --spec 模式同生效（20 审 R1 已定 · 复用 lintWikiDeltaMissing 导出 · 默认档 scope=all）
  const wikiLint = opts.withWikiLint ? lintWikiDeltaMissing(target, { scope: 'all' }) : null
  if (shouldSkipSpecAudit(content)) {
    if (wikiLint && !wikiLint.ok) {
      if (opts.json) emitJson(true, { skipped: 'bugfix / skip_spec_audit' }, wikiLint)
      else {
        console.log('verify: INFO · skip SPEC review gate（bugfix / skip_spec_audit）')
        printWikiLintIssues(wikiLint)
        console.log(`VERIFY: BLOCKED · wiki_delta 缺口（lint-wiki-delta · scope=all）· ${label}`)
      }
      fail('', VERIFY_BLOCKED_EXIT_CODE)
    }
    if (opts.json) emitJson(false, { skipped: 'bugfix / skip_spec_audit' }, wikiLint)
    else {
      console.log('verify: INFO · skip SPEC review gate（bugfix / skip_spec_audit）')
      if (wikiLint) console.log(`verify: wiki-lint PASS · scanned: ${wikiLint.scanned} · scope: all`)
      console.log(`VERIFY: PASS · ${label}`)
    }
    return
  }
  const allowFlag = opts.allowNoSpecReview ? '--allow-no-spec-review' : opts.allowNoReview ? '--allow-no-review' : null
  const reviewFound = findSpecReview(target, abs, content)
  if (!reviewFound && !allowFlag) {
    if (opts.json) emitJson(true)
    else console.log(`VERIFY: BLOCKED · missing spec R<n> review · ${label}`)
    fail('', VERIFY_BLOCKED_EXIT_CODE)
  }
  const waived: string[] = []
  if (!reviewFound && allowFlag) {
    waived.push(`missing spec R<n> review（${allowFlag} 豁免）`)
    if (!opts.json) {
      console.log(
        `verify: 留痕 · 缺 spec R<n> 审查文 · ${allowFlag} 豁免生效（仍须补审并由维护者签 HG-SPEC-SIGNOFF）`,
      )
    }
  }
  if (wikiLint && !wikiLint.ok) {
    if (opts.json) emitJson(true, { waived }, wikiLint)
    else {
      printWikiLintIssues(wikiLint)
      console.log(`VERIFY: BLOCKED · wiki_delta 缺口（lint-wiki-delta · scope=all）· ${label}`)
    }
    fail('', VERIFY_BLOCKED_EXIT_CODE)
  }
  if (opts.json) emitJson(false, { waived }, wikiLint)
  else {
    if (wikiLint) console.log(`verify: wiki-lint PASS · scanned: ${wikiLint.scanned} · scope: all`)
    console.log(`VERIFY: PASS · ${label}`)
  }
}

// 2.3-W4 FULL-reviews：裸 verify（无 --task/--spec）= 仓级 reviews 全量扫描（评审文 §2.3 定稿）。
// done 面 failClosed（审查文存在 + 最高 R 轮结论可机读通过 · 与 G2 同一实现源）；active 面信息报告
//（draft 期无审查文合法 · 不闸）；存量过渡走数据豁免 docs/harness/legacy-gate-exempt.yaml
//（D-23-W4-EXEMPT-FORMAT · F-W4-04 四字段留痕回显）。
async function verifyBareReviewsMode(
  target: string,
  opts: { json: boolean; withWikiLint: boolean },
  obs: VerifyObservability | null,
): Promise<void> {
  const exempt = loadLegacyGateExempt(target)
  const files = collectTaskFilesByScope(target)
  const doneFiles = files.filter((f) => f.scope === 'done')
  const activeFiles = files.filter((f) => f.scope === 'active')
  const gaps: { slug: string; rel: string; reason: string }[] = []
  const exempted: { slug: string; reason: string; entry: LegacyGateExemptEntry }[] = []
  const metaOf = (abs: string): Record<string, string> => {
    try {
      return parseHarnessMeta(readFileSync(abs, 'utf8'))
    } catch {
      return {} // 读失败 → 空元信息回退（failClosed 方向）
    }
  }
  for (const f of doneFiles) {
    const slug = metaOf(f.abs).task_slug ?? extractTaskSlug(f.abs)
    const latest = findLatestReview(target, f.abs)
    let reason: string | null = null
    if (!latest) {
      reason = 'missing R<n> review'
    } else {
      const verdict = evalReviewConclusion(readFileSync(latest.path, 'utf8'))
      if (!verdict.pass) reason = `审查文结论不可机读通过（${latest.name} · ${verdict.detail}）`
    }
    if (!reason) continue
    const ent = resolveExemptEntry(exempt, 'reviews', slug) // U1 单源（3.0-W4 · checks/exempt.ts）
    if (ent) exempted.push({ slug, reason, entry: ent })
    else gaps.push({ slug, rel: f.rel, reason })
  }
  const activeMissing: string[] = []
  for (const f of activeFiles) {
    if (findLatestReview(target, f.abs)) continue
    activeMissing.push(metaOf(f.abs).task_slug ?? extractTaskSlug(f.abs))
  }
  // K3 同口径：--with-wiki-lint 在裸模式同生效（正交加闸 · 复用 lintWikiDeltaMissing 导出）
  const wikiLint = opts.withWikiLint ? lintWikiDeltaMissing(target, { scope: 'all' }) : null
  const blocked = gaps.length > 0
  const wikiBlocked = wikiLint ? !wikiLint.ok : false
  if (opts.json) {
    // obs 恒非空：本分支在 opts.json 守卫内（obs 仅 --json 时计算）
    const o = obs as VerifyObservability
    printJson(target, {
      command: 'verify',
      target: toRel(process.cwd(), target),
      blocked: blocked || wikiBlocked,
      verdict: blocked || wikiBlocked ? 'BLOCKED' : 'PASS',
      traceId: o.traceId,
      exitCode: blocked || wikiBlocked ? VERIFY_BLOCKED_EXIT_CODE : 0,
      source: o.source,
      injectedFiles: o.injectedFiles,
      reviews_scan: {
        done: doneFiles.length,
        active: activeFiles.length,
        active_missing_reviews: activeMissing,
        gaps,
        exempted: exempted.map((e) => ({ slug: e.slug, gap: e.reason, exempt: e.entry })),
        exempt_invalid: exempt.invalid,
      },
      ...(wikiLint ? { wiki_lint: wikiLintJson(wikiLint) } : {}),
    })
  } else {
    console.log(`目标: ${toRel(process.cwd(), target)}`)
    console.log('verify: 仓级 reviews 全量扫描（双路径 docs/harness/reviews + reviews/ · 2.3-W4 FULL-reviews）')
    console.log(`done tasks: ${doneFiles.length} · active tasks: ${activeFiles.length}`)
    for (const slug of activeMissing) {
      console.log(`warn: active 缺 R<n> 审查文（draft 期合法 · 不闸）: ${slug}`)
    }
    for (const e of exempted) {
      console.log(`豁免命中留痕: ${e.slug}（${e.entry.reason} · ${e.entry.date} · ${e.entry.authorized_by}）`)
    }
    for (const inv of exempt.invalid) console.log(`warn: 豁免条目无效（不豁免）: ${inv}`)
    if (wikiLint && !wikiLint.ok) printWikiLintIssues(wikiLint)
    else if (wikiLint) console.log(`verify: wiki-lint PASS · scanned: ${wikiLint.scanned} · scope: all`)
    if (blocked) {
      console.log(
        'reviews 缺口（failClosed · 存量过渡豁免走 docs/harness/legacy-gate-exempt.yaml · 四字段 slug/reason/date/authorized_by）:',
      )
      for (const g of gaps) console.log(`  - ${g.rel} · ${g.reason}`)
    }
    console.log(
      blocked || wikiBlocked
        ? `VERIFY: BLOCKED · 仓级 reviews 缺口 ${gaps.length}`
        : 'VERIFY: PASS（裸 verify · 仓级 reviews 扫描）',
    )
  }
  if (blocked || wikiBlocked) fail('', VERIFY_BLOCKED_EXIT_CODE)
}
export async function cmdVerify(args: string[]): Promise<void> {
  if (args.includes('--help') || args.includes('-h')) {
    console.log(
      '用法: npx spec-wave verify [--target PATH] [--task FILE | --spec FILE] [--json] [--with-wiki-lint] [--allow-no-review] [--allow-invoke-gap] [--allow-no-spec-review]（不带 --task/--spec = 仓级 reviews 全量扫描 · 2.3-W4 FULL-reviews）',
    )
    return
  }
  const json = args.includes('--json')
  let rest = args.filter((a) => a !== '--json')
  const { value: targetArg, rest: r1 } = takeOption(rest, '--target')
  rest = r1
  const { value: taskFile, rest: r2 } = takeOption(rest, '--task')
  rest = r2
  const { value: specFile, rest: r3 } = takeOption(rest, '--spec')
  rest = r3
  // DEF-003 阶段二 T4/T5：--allow-no-review / --allow-invoke-gap 真生效（硬闸豁免 · 留痕）；
  // PRD_DEF-003 后续棒：--allow-no-spec-review 真生效（verify --spec 豁免 · 留痕）；
  // 其余 --allow-* 仍走 DEF-011 fail-fast（--allow-lint-fail 等归 DEF-011 交接清单）
  const allowNoReview = rest.includes('--allow-no-review')
  rest = rest.filter((a) => a !== '--allow-no-review')
  const allowInvokeGap = rest.includes('--allow-invoke-gap')
  rest = rest.filter((a) => a !== '--allow-invoke-gap')
  const allowNoSpecReview = rest.includes('--allow-no-spec-review')
  rest = rest.filter((a) => a !== '--allow-no-spec-review')
  // K3：--with-wiki-lint 追加闸（显式旗标 · 非破坏；preset 默认开启为独立决策点，本 task 不做）
  const withWikiLint = rest.includes('--with-wiki-lint')
  rest = rest.filter((a) => a !== '--with-wiki-lint')
  // 3.0-W6 S6.1：--audit-file 仅改审计落点（仅 --task 模式落事件 · 仓外拒 + S2 拒写双兜底 · 无豁免参数）
  const { value: auditFile, rest: r5 } = takeOption(rest, '--audit-file')
  rest = r5
  if (rest.length > 0) fail(`verify 未知参数: ${rest.join(' ')}`)
  // C1-b（2.2-W2）：gate 面 --target 须落 git 仓内（F-W2-02 · 安全设计 §2.2.4 跨仓引用禁止）
  const target = resolveTarget(process.cwd(), targetArg, { requireGitRoot: true })
  // 2.2-W3 C2：--json 时预计算可观测载荷（task / spec 两模式同一份 · traceId 单次运行级）
  const obs = json ? await collectVerifyObservability() : null
  // --task 与 --spec 互斥（旧包 lib/cli.js#487-491 语义 · exit 1 用法错误）
  if (taskFile && specFile) fail('verify：--task 与 --spec 互斥')
  // 3.0-W6：--audit-file 仅 --task 模式有意义（裸 verify/--spec 不落审计事件 · 防静默忽略误导）
  if (auditFile && !taskFile) fail('verify：--audit-file 仅 --task 模式有效（裸 verify / --spec 不落审计事件）')
  if (specFile) {
    await verifySpecMode(target, specFile, { json, allowNoSpecReview, allowNoReview, withWikiLint }, obs)
    return
  }
  if (!taskFile) {
    // 2.3-W4 FULL-reviews：裸 verify = 仓级 reviews 全量扫描（原用法错 exit 1 语义由本模式取代）
    await verifyBareReviewsMode(target, { json, withWikiLint }, obs)
    return
  }
  // 3.0-W6 S6.1 ②：--task 各 verdict 出口落审计轨（appendAuditEvent 单一实现源 · 观测面纯旁路）。
  // 落点合法性 fail-fast（F-W6-02 S2 拒写 exit 2 / F-W6-07 仓外拒 exit 1 · 拒写不降级）；
  // verdict 事件经 try/catch 旁路留痕后原样重抛 —— 主输出与 exit code 零变更（行为面零回归快照钉死）。
  resolveAuditFile(target, auditFile)
  const auditStartedAt = Date.now()
  let auditGates: AuditGateSnapshot[] | undefined
  const emitVerifyAudit = (verdict: 'PASS' | 'BLOCKED', exitCode: number, detail?: string): void => {
    appendAuditEvent(
      target,
      stampAuditEvent({
        event: 'verify',
        verdict,
        exit_code: exitCode,
        task: taskFile,
        ...(auditGates && auditGates.length > 0 ? { gates: auditGates } : {}),
        ...(detail ? { detail: detail.slice(0, 300) } : {}),
        duration_ms: Date.now() - auditStartedAt,
      }),
      { auditFile },
    )
  }
  const abs = resolveTaskPath(target, taskFile)
  const label = path.basename(abs)
  const exempted: string[] = [] // U1：exempt.reviews 命中留痕（done 面 · OQ-3 命名对齐裸 verify · emitJson 闭包消费故须先声明）
  const waived: string[] = [] // 豁免/降级留痕（emitJson 闭包消费 · 3.0-W6 G4 done warn 降级同通道故须先声明）
  const emitJson = (blocked: boolean, waived?: string[], wikiLint?: WikiLintGateResult | null): void => {
    // obs 恒非空：emitJson 全部调用点均在 if (json) 守卫内（obs 仅 --json 时计算）
    const o = obs as VerifyObservability
    printJson(target, {
      command: 'verify',
      // C3 补漏（2.3-W3 · D-23-JSON-TARGET-REL）：--json target 字段绝对 → 相对（与人类面同口径）
      target: toRel(process.cwd(), target),
      task: taskFile,
      blocked,
      verdict: blocked ? 'BLOCKED' : 'PASS',
      traceId: o.traceId,
      exitCode: blocked ? VERIFY_BLOCKED_EXIT_CODE : 0,
      source: o.source,
      injectedFiles: o.injectedFiles,
      ...(waived && waived.length > 0 ? { waived } : {}),
      // U1/OQ-3（3.0-W4 · 评审文 §6.2）：exempt 命中留痕键名与裸 verify 面对齐（exempted）· 契约只增不改（条件键）
      ...(exempted.length > 0 ? { exempted } : {}),
      ...(wikiLint ? { wiki_lint: wikiLintJson(wikiLint) } : {}),
    })
  }
  try {
  if (!existsSync(abs)) {
    if (json) emitJson(true)
    else console.log(`VERIFY: BLOCKED · task 文件不存在 · ${label}`)
    fail('', VERIFY_BLOCKED_EXIT_CODE)
  }
  const content = await readFile(abs, 'utf8')
  auditGates = parseHumanGates(content).map((g) => ({ id: g.id, status: g.status }))
  const formatted = formatGateCheck(abs, content)
  if (!json) process.stdout.write(formatted.text)
  if (formatted.blocked) {
    const gates = parseHumanGates(content)
    const audit = findGate(gates, 'HG-AUDIT-R1')
    const reason =
      audit?.status !== 'approved' ? 'HG-AUDIT-R1 pending' : formatted.text.includes('HG-TASK-DRAFT')
        ? 'HG-TASK-DRAFT pending'
        : 'gate-check blocked'
    if (json) emitJson(true)
    else console.log(`VERIFY: BLOCKED · ${reason} · ${label}`)
    fail('', VERIFY_BLOCKED_EXIT_CODE)
  }
  const test = runTestCheck(target, taskFile)
  if (!test.ok) {
    if (json) emitJson(true)
    else console.log(`VERIFY: BLOCKED · ${test.reason} · ${label}`)
    fail('', VERIFY_BLOCKED_EXIT_CODE)
  }
  // 3.0-W6 S6.4 G4 思考轮控制表闸（SPEC 07 ④ signed · D-23-W4-G4-EXIT 升级通道兑现）：
  // 判据 = evalThinkingRoundStructure 单一实现源（checks/lint.ts · 与 task lint W5–W7 同族不复制）；
  // active 面 failClosed（缺槽位/控制表/reason 点名 exit 2）· done 面 warn 降级不挡
  //（D-23-W4-TRANSITION 不追溯存量 · 硬约束 7 · waived[] 留痕）· 无思考轮节维持豁免（SPEC 承载 / bugfix 轨）。
  const think = evalThinkingRoundStructure(content)
  if (think.hasSection && (think.missingSlots.length > 0 || think.missingTable || think.earlyStopNoReason)) {
    const lacks: string[] = []
    if (think.missingSlots.length > 0) lacks.push(`槽位 ${think.missingSlots.join('/')}`)
    if (think.missingTable) lacks.push('控制表')
    if (think.earlyStopNoReason) lacks.push('early_stop reason')
    const gapText = lacks.join(' · ')
    if (abs.split(path.sep).includes('done')) {
      waived.push(`思考轮控制表缺口（缺 ${gapText} · done 目录审计降级 warn）`)
      if (!json) {
        console.log(`verify: warn · 思考轮控制表缺口（缺 ${gapText} · done 目录降级不挡 · D-23-W4-TRANSITION 不追溯存量）`)
      }
    } else {
      if (json) emitJson(true)
      else console.log(`VERIFY: BLOCKED · 思考轮控制表缺口（缺 ${gapText} 点名）· ${label}`)
      fail('', VERIFY_BLOCKED_EXIT_CODE)
    }
  }
  // DEF-003 阶段二 T4：R<n> 审查文存在性硬闸（findReview 与 status / dry-run 同口径 · cli-checks 单一实现源）
  const reviewFound = findReview(target, abs)
  if (!reviewFound && !allowNoReview) {
    if (json) emitJson(true)
    else console.log(`VERIFY: BLOCKED · missing R<n> review · ${label}`)
    fail('', VERIFY_BLOCKED_EXIT_CODE)
  }
  if (!reviewFound && allowNoReview) {
    waived.push('missing R<n> review（--allow-no-review 豁免）')
    if (!json) {
      console.log('verify: 留痕 · 缺 R<n> 审查文 · --allow-no-review 豁免生效（仍须补审并由维护者签 HG-AUDIT-R1）')
    }
  }
  // 2.3-W4 G2 结论级（评审文 §2.1）：最高 R 轮审查文结论可机读通过 ——
  // active failClosed · done 目录 warn 降级（D-23-W4-TRANSITION 不追溯存量）· --allow-no-review 同豁结论级
  const latestReview = findLatestReview(target, abs)
  if (latestReview) {
    const verdict = evalReviewConclusion(await readFile(latestReview.path, 'utf8'))
    if (!verdict.pass) {
      if (allowNoReview) {
        waived.push(`审查文结论不可机读通过（${latestReview.name} · --allow-no-review 豁免）`)
        if (!json) {
          console.log(`verify: 留痕 · ${latestReview.name} 结论不可机读通过（${verdict.detail}）· --allow-no-review 豁免生效`)
        }
      } else if (abs.split(path.sep).includes('done')) {
        // U1（3.0-W4 · 评审文 §6.2 定稿）：done 面补消费 exempt.reviews —— 有豁免条目 → exempted 留痕
        //（不再 warn · 字段命名与裸 verify 对齐 OQ-3）；无豁免 → 维持 D-23-W4-TRANSITION warn 降级不挡（现状不变）。
        const exempt = loadLegacyGateExempt(target)
        const taskSlug = parseHarnessMeta(content).task_slug ?? extractTaskSlug(abs)
        const ent = resolveExemptEntry(exempt, 'reviews', taskSlug)
        if (ent) {
          exempted.push(`审查文结论不可机读通过（${latestReview.name} · 豁免命中留痕: ${taskSlug}）`)
          if (!json) {
            console.log(`verify: exempted · ${latestReview.name} 结论不可机读通过（${verdict.detail}）`)
            console.log(`豁免命中留痕: ${taskSlug}（${ent.reason} · ${ent.date} · ${ent.authorized_by}）`)
          }
        } else {
          waived.push(`审查文结论不可机读通过（${latestReview.name} · done 目录审计降级 warn）`)
          if (!json) {
            console.log(`verify: warn · ${latestReview.name} 结论不可机读通过（${verdict.detail} · done 目录降级 · 不挡）`)
          }
        }
      } else {
        if (json) emitJson(true)
        else console.log(`VERIFY: BLOCKED · 审查文结论不可机读通过 · ${latestReview.name}（${verdict.detail}）· ${label}`)
        fail('', VERIFY_BLOCKED_EXIT_CODE)
      }
    }
  }
  // DEF-003 阶段二 T5：pre-30 invoke hats 硬闸（required ∩ {10,20,00} · cli-checks 单一实现源，
  // 与 task close 帽集合检查同口径；缺 40 不挡 30 · minimal 无 preRequired 不挡）
  const invoke = checkPre30InvokeHats(target, abs)
  if (!invoke.ok && !allowInvokeGap) {
    if (json) emitJson(true)
    else console.log(`VERIFY: BLOCKED · missing pre-30 invoke hats: ${invoke.missing.join(',')} · ${label}`)
    fail('', VERIFY_BLOCKED_EXIT_CODE)
  }
  if (!invoke.ok && allowInvokeGap) {
    waived.push(`missing pre-30 invoke hats: ${invoke.missing.join(',')}（--allow-invoke-gap 豁免）`)
    if (!json) {
      console.log(
        `verify: 留痕 · 缺 pre-30 invoke hats: ${invoke.missing.join(',')}（${invoke.source}）· --allow-invoke-gap 豁免生效（仍须补落 invoke 快照）`,
      )
    }
  }
  // K3：--with-wiki-lint 追加闸（既有全部硬闸之后 · 复用 lintWikiDeltaMissing 导出 · 默认档 scope=all）；
  // target 无 docs/tasks/ 候选目录时 scanned:0/ok:true，不得误 BLOCKED（失败路径表边缘行）
  if (withWikiLint) {
    const wikiLint = lintWikiDeltaMissing(target, { scope: 'all' })
    if (!wikiLint.ok) {
      if (json) emitJson(true, waived, wikiLint)
      else {
        printWikiLintIssues(wikiLint)
        console.log(`VERIFY: BLOCKED · wiki_delta 缺口（lint-wiki-delta · scope=all）· ${label}`)
      }
      fail('', VERIFY_BLOCKED_EXIT_CODE)
    }
    emitVerifyAudit('PASS', 0, [...waived, ...exempted].length > 0 ? [...waived, ...exempted].join('；') : undefined)
    if (json) emitJson(false, waived, wikiLint)
    else {
      console.log(`verify: wiki-lint PASS · scanned: ${wikiLint.scanned} · scope: all`)
      console.log(`VERIFY: PASS · ${label}`)
    }
    return
  }
  emitVerifyAudit('PASS', 0, [...waived, ...exempted].length > 0 ? [...waived, ...exempted].join('；') : undefined)
  if (json) emitJson(false, waived)
  else {
    console.log(`VERIFY: PASS · ${label}`)
  }
  } catch (err) {
    // 3.0-W6 S6.1：BLOCKED verdict 留痕后原样重抛（观测面旁路 · 主输出与 exit code 零变更）
    if (err instanceof CliError && err.exitCode === VERIFY_BLOCKED_EXIT_CODE) {
      emitVerifyAudit('BLOCKED', err.exitCode, err.message || undefined)
    }
    throw err
  }
}
