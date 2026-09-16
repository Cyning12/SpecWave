import { existsSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { evaluateMayStart30, fail, findGate, parseHumanGates, printJson, resolveTarget, resolveTaskPath, takeOption, toRel } from '../cli-shared.ts'
import { listBareSpecFiles, runTestCheck } from '../cli-checks.ts'
import { compareVersion, isLegacyHarnessLineVersion, manifestPath, readManifest } from './init.ts'

export async function cmdCheck(args: string[], pkgVersion: string): Promise<void> {
  if (args.includes('--help') || args.includes('-h')) {
    console.log('用法: npx spec-wave check [--target PATH]')
    return
  }
  let rest = args
  const { value: targetArg, rest: r1 } = takeOption(rest, '--target')
  rest = r1
  if (rest.length > 0) fail(`check 未知参数: ${rest.join(' ')}`)
  const target = resolveTarget(process.cwd(), targetArg)
  const manifest = await readManifest(target)
  console.log(`目标: ${toRel(process.cwd(), target)}`) // C3（2.2-W2）：目标打印相对化（toRel 口径）
  console.log(`包版本: ${pkgVersion}`)
  if (!manifest) {
    console.log('状态: 未接入（无 .coding-kit/manifest.json 或 legacy .cyning-harness/manifest.json）')
    console.log('建议: npx spec-wave init --preset harness-only --yes')
    return
  }
  console.log(`manifest.version: ${manifest.version}`)
  console.log(`manifest.preset: ${manifest.preset}`)
  const cmp = compareVersion(manifest.version, pkgVersion)
  if (cmp === 0) {
    console.log('状态: 已是最新')
  } else if (cmp < 0) {
    console.log('状态: 可升级')
    console.log('建议: npx spec-wave upgrade --yes')
  } else if (manifest.from_version != null && isLegacyHarnessLineVersion(manifest.from_version)) {
    // DEF-028：from_version 属旧包产品线（2.x 系列）= 从旧产品线迁来，跨产品线版本号不可比，输出迁移语义而非降级警告
    // DEF-030：判据收窄——kit 线（1.x）from_version 不走本分支，回落下方「降级安装」语义
    console.log(
      `状态: 跨产品线迁移：@cyning/harness ${manifest.version} → spec-wave ${pkgVersion}（跨产品线版本号不可比）`,
    )
    console.log('建议: npx spec-wave upgrade --yes')
  } else {
    console.log('状态: manifest 版本高于包版本（可能为降级安装）')
    console.log('建议: 核对接入来源（manifest 由更高版本 CLI 写入）')
  }
  const bareSpecs = listBareSpecFiles(target)
  if (bareSpecs.length > 0) {
    console.log(
      `WARN: docs/spec 根级裸 SPEC-*.md（${bareSpecs.length}）· 见 docs/spec/doc-health（新 SPEC 须专属夹）`,
    )
    for (const f of bareSpecs) console.log(`  - docs/spec/${f}`)
  }
}

/**
 * 3.0 W1 阶段四（S2.6 泛化渲染 · 验收 #6 · F-W1-13 三条红线保留：exit code 语义 / --json 键集 /
 * 「→ 30 不可开工」文案语义）：渲染 = 既有三闸行（格式逐字保留 · 缺行占位不变）+ 全部白名单外
 * blocks_hats 含 30 的命中行（声明序追加 · 不再只列 3 行）。阻断行：三闸既有文案逐字 + 泛化行
 * `→ 30 不可开工: <ID> pending 且 blocks 30`（与 HG-TASK-DRAFT 同式）。
 */
export function formatGateCheck(taskFile: string, content: string): { text: string; blocked: boolean } {
  const gates = parseHumanGates(content)
  const draft = findGate(gates, 'HG-TASK-DRAFT')
  const audit = findGate(gates, 'HG-AUDIT-R1')
  const graph = findGate(gates, 'HG-GRAPH-MODULES')
  // 白名单外 blocks-30 命中行（findGate 同口径前缀排除既有三闸 · 声明序）
  const legacyMatch = (id: string): boolean => {
    for (const prefix of ['HG-TASK-DRAFT', 'HG-AUDIT-R1', 'HG-GRAPH-MODULES']) {
      if (id === prefix || id.startsWith(`${prefix}（`) || id.startsWith(`${prefix}(`)) return true
    }
    return false
  }
  const genericRows = gates.filter((g) => g.blocksHats.includes('30') && !legacyMatch(g.id))
  const lines: string[] = []
  lines.push(`task: ${path.basename(taskFile)}`)
  lines.push('| gate | status | blocks_30 | 30 影响 |')
  lines.push('|------|--------|-----------|--------|')
  const draftStatus = draft?.status ?? '?'
  const draftBlocks = draft?.blocksHats ?? '?'
  const draftImpact =
    draftStatus === 'approved' ? '—' : draftBlocks.includes('30') ? '❌ 拒 30' : '—'
  lines.push(`| HG-TASK-DRAFT | ${draftStatus} | ${draftBlocks} | ${draftImpact} |`)
  const auditStatus = audit?.status ?? '?'
  lines.push(
    `| HG-AUDIT-R1 | ${auditStatus} | 30 | ${auditStatus === 'approved' ? '✅ 可 30' : '❌ 拒 30'} |`,
  )
  if (graph && graph.status !== '—' && graph.status !== '?') {
    lines.push(
      `| HG-GRAPH-MODULES | ${graph.status} | — | ${graph.status === 'approved' ? '✅' : '❌ 若 pending 拒 30'} |`,
    )
  }
  for (const g of genericRows) {
    lines.push(`| ${g.id} | ${g.status} | ${g.blocksHats} | ${g.status === 'approved' ? '✅ 可 30' : '❌ 拒 30'} |`)
  }
  lines.push('')
  const may = evaluateMayStart30(gates)
  let blocked = false
  if (auditStatus !== 'approved') {
    blocked = true
    lines.push('→ 30 不可开工: HG-AUDIT-R1 非 approved（须维护者签 task 表）')
  }
  if (draft && draft.status !== 'approved' && draft.blocksHats.includes('30')) {
    blocked = true
    lines.push('→ 30 不可开工: HG-TASK-DRAFT pending 且 blocks 30')
  }
  if (graph?.status === 'pending') {
    blocked = true
    lines.push('→ 30 不可开工: HG-GRAPH-MODULES pending')
  }
  for (const g of genericRows) {
    if (g.status !== 'approved') {
      blocked = true
      lines.push(`→ 30 不可开工: ${g.id} pending 且 blocks 30`)
    }
  }
  if (!blocked && !may.ok) {
    blocked = true
    lines.push(`→ 30 不可开工: ${may.reason}`)
  }
  lines.push('')
  return { text: lines.join('\n'), blocked }
}

export async function cmdGateCheck(args: string[]): Promise<void> {
  if (args.includes('--help') || args.includes('-h')) {
    console.log('用法: npx spec-wave gate-check [--target PATH] [--task FILE] [--json]')
    return
  }
  const json = args.includes('--json')
  let rest = args.filter((a) => a !== '--json')
  const { value: targetArg, rest: r1 } = takeOption(rest, '--target')
  rest = r1
  const { value: taskFile, rest: r2 } = takeOption(rest, '--task')
  rest = r2
  if (rest.length > 0) fail(`gate-check 未知参数: ${rest.join(' ')}`)
  // C1-b（2.2-W2）：gate 面 --target 须落 git 仓内（F-W2-02）；C3：目标打印相对化（toRel 口径）
  const target = resolveTarget(process.cwd(), targetArg, { requireGitRoot: true })
  const mf = await readManifest(target)
  if (!json) {
    console.log('=== Harness gate-check ===')
    console.log(`目标: ${toRel(process.cwd(), target)}`)
    if (mf) {
      console.log(`manifest.version: ${mf.version}`)
      console.log(`manifest.preset: ${mf.preset}`)
    } else {
      console.log(`manifest: (未接入 · 无 ${toRel(process.cwd(), manifestPath(target))})`) // C3（2.2-W2）：相对口径
    }
    console.log('')
  }
  if (!taskFile) fail('gate-check 须指定 --task FILE（1.1.0 P0 子集）')
  const abs = resolveTaskPath(target, taskFile)
  // C3 补漏（2.3-W3 · D-23-W3-REL-BASE）：错误文案相对化（target 归卡基）
  if (!existsSync(abs)) fail(`错误: 未找到 --task 文件 ${toRel(target, abs)}`)
  const formatted = formatGateCheck(abs, await readFile(abs, 'utf8'))
  if (json) {
    printJson(target, {
      command: 'gate-check',
      // C3 补漏（2.3-W3 · D-23-JSON-TARGET-REL）：--json target 字段绝对 → 相对（与人类面同口径）
      target: toRel(process.cwd(), target),
      task: taskFile,
      blocked: formatted.blocked,
      verdict: formatted.blocked ? 'BLOCKED' : 'PASS',
    })
  } else {
    process.stdout.write(formatted.text)
  }
  if (formatted.blocked) fail('', 2)
  if (!json) {
    console.log('闸检查: 未发现阻塞（仍须 Agent 首输出 GATE_VERIFY · 不得采信 invoke 字面 approved）')
  }
}

export async function cmdAudit(args: string[]): Promise<void> {
  if (args.includes('--help') || args.includes('-h')) {
    console.log('用法: npx spec-wave audit [--target PATH] [--task FILE]')
    return
  }
  let rest = args
  const { value: targetArg, rest: r1 } = takeOption(rest, '--target')
  rest = r1
  const { value: taskFile, rest: r2 } = takeOption(rest, '--task')
  rest = r2
  if (rest.length > 0) fail(`audit 未知参数: ${rest.join(' ')}`)
  // C1-b（2.2-W2）：gate 面 --target 须落 git 仓内（F-W2-02）；C3：目标打印相对化（toRel 口径）
  const target = resolveTarget(process.cwd(), targetArg, { requireGitRoot: true })
  console.log(`目标: ${toRel(process.cwd(), target)}`)
  if (taskFile) console.log(`task: ${taskFile}`)

  let gateOk = true
  let gateText = ''
  if (taskFile) {
    const abs = resolveTaskPath(target, taskFile)
    // C3 补漏（2.3-W3 · D-23-W3-REL-BASE）：错误文案相对化（target 归卡基）
    if (!existsSync(abs)) fail(`错误: 未找到 --task 文件 ${toRel(target, abs)}`)
    const formatted = formatGateCheck(abs, await readFile(abs, 'utf8'))
    gateText = formatted.text
    gateOk = !formatted.blocked
    process.stdout.write(gateText)
  }
  const test = runTestCheck(target, taskFile)
  console.log(`audit: ${gateOk && test.ok ? 'PASS' : 'FAIL'}`)
  console.log(`  gate-check: ${gateOk ? 'PASS' : 'FAIL'}`)
  console.log(`  test-check: ${test.ok ? 'PASS' : 'FAIL'}`)
  if (test.reason) console.log(`    ${test.reason}`)
  if (!gateOk || !test.ok) fail('ICVO audit 未通过', 2)
}
