import { chmodSync, existsSync, readFileSync, readdirSync, statSync, unlinkSync } from 'node:fs'
import path from 'node:path'
import {
  assertNotS2Abs,
  fail,
  isS2AbsPath,
  isS2RelPath,
  normalizeSlashPath,
  toRel,
} from '../cli-shared.ts'
import { isExecuteHatSkipped } from '../cli-skills.ts'
import {
  commandEntryApplies,
  parseCoreCommandBasename,
  parseExpandedCommandBasename,
} from './commands.ts'
import type { CommandSets, HooksDecl } from './resolve.ts'
import {
  atomicWrite,
  backupFile,
  ensureBackupGen,
  pruneBackups,
  type BackupFamily,
} from './backup.ts'
import {
  buildShellHookScript,
  configHookSpecOf,
  isShellHookManaged,
  mergeHookConfig,
  SHELL_HOOK_PRE_COMMIT_REL,
} from './hooks.ts'
import type { HostRow } from './table.ts'

const PRODUCT_BEGIN = '<!-- cyning-harness:begin -->'
const PRODUCT_END = '<!-- cyning-harness:end -->'
const LOCAL_BEGIN = '<!-- cyning-harness-local:begin -->'
const LOCAL_END = '<!-- cyning-harness-local:end -->'

type PlannedOp = 'write' | 'merge' | 'skip_identical' | 'conflict'

/** 3.0 W2 阶段二：kind 增 'hook'（config-hook JSON 合并落点 · S3.3 · 导出供 host verify 比对分派） */
export type PlannedItem = {
  hostId: string
  kind: 'always_on' | 'command' | 'skill' | 'hook'
  destRel: string
  destAbs: string
  sourceRel: string
  sourceAbs: string
  op: PlannedOp
  nextText: string
  /** kind='hook' 专用：声明 triggers（host verify 比对锚点 · S3.4 形态③/逐字） */
  hooksTriggers?: ('pre-commit' | 'pre-archive')[]
  /** kind='hook' 专用：机制族（config-hook=JSON 包含性比对 · shell-hook=逐字比对 · S3.4 分派） */
  hookMechanism?: 'shell-hook' | 'config-hook'
  /** shell-hook 落点须可执行（.git/hooks/* · commitPlannedWrites 写后 chmod 0755） */
  executable?: boolean
}

type SkillSource = { sourceRel: string; innerRel: string }

/** 3.0 W2 阶段二：导出供 host verify marker 产品块比对分派（S3.4 形态②） */
export function isMarkdownMergeTarget(destRel: string): boolean {
  const base = path.basename(destRel)
  // 2.3-W6：GEMINI.md 入 marker-merge 白名单（gemini 官方上下文文件 · 取证卡 D-23-W6-REUSE）——
  // 与 AGENTS.md/CLAUDE.md 同语义：产品块 marker 包裹 + local 块保留；否则 gemini 行always_on 退化为
  // 裸拷贝（升级整文件覆写 · 用户定制丢失）。非 schema 变更（host-adapt.schema.json 零改动）。
  return base === 'CLAUDE.md' || base === 'AGENTS.md' || base === 'GEMINI.md'
}

function isKitManagedContent(content: string): boolean {
  if (content.includes(PRODUCT_BEGIN) || content.includes(PRODUCT_END)) return true
  if (content.includes('# Harness Starter（业务仓')) return true
  if (content.includes('Harness Starter — 读序、task、人工闸与 Verify 纪律')) return true
  return false
}

function extractProductInner(source: string): string {
  const text = source.replace(/\r\n/g, '\n')
  const b = text.indexOf(PRODUCT_BEGIN)
  const e = text.indexOf(PRODUCT_END)
  if (b !== -1 && e !== -1 && e > b) {
    return text.slice(b + PRODUCT_BEGIN.length, e).replace(/^\n/, '').replace(/\n$/, '')
  }
  return text.replace(/\s+$/, '')
}

function wrapProductBlock(inner: string): string {
  const body = inner.replace(/\s+$/, '')
  return `${PRODUCT_BEGIN}\n${body}\n${PRODUCT_END}\n`
}

function productSpanHasLocal(text: string): boolean {
  const b = text.indexOf(PRODUCT_BEGIN)
  const e = text.indexOf(PRODUCT_END)
  if (b === -1 || e === -1 || e < b) return false
  const span = text.slice(b, e + PRODUCT_END.length)
  return span.includes(LOCAL_BEGIN) || span.includes(LOCAL_END)
}

/**
 * host verify marker 产品块比对（3.0 W2 阶段二 · S3.4 形态② · 验收 #9）：
 * 产品块（cyning-harness:begin/end 包裹段）逐字比对 —— 用户 local 块（块内）与块外内容**不计篡改**
 * （local span 剔除后比对产品 inner）；产品块缺失/被改 → false（报红）。
 */
export function verifyMarkdownProductBlock(existing: string, sourceBody: string): boolean {
  const text = existing.replace(/\r\n/g, '\n')
  const b = text.indexOf(PRODUCT_BEGIN)
  const e = text.indexOf(PRODUCT_END)
  if (b === -1 || e === -1 || e < b) return false
  let inner = text.slice(b + PRODUCT_BEGIN.length, e)
  const lb = inner.indexOf(LOCAL_BEGIN)
  if (lb !== -1) {
    const le = inner.indexOf(LOCAL_END, lb + LOCAL_BEGIN.length)
    if (le !== -1) inner = inner.slice(0, lb) + inner.slice(le + LOCAL_END.length)
  }
  const norm = (s: string): string => s.replace(/^\n+/, '').replace(/\s+$/, '')
  return norm(inner) === norm(extractProductInner(sourceBody))
}

function mergeMarkdownAlwaysOn(existing: string | null, sourceBody: string): string {
  const block = wrapProductBlock(extractProductInner(sourceBody))
  if (existing === null) return block
  const text = existing.replace(/\r\n/g, '\n')
  const b = text.indexOf(PRODUCT_BEGIN)
  const e = text.indexOf(PRODUCT_END)
  if (b === -1 || e === -1 || e < b) {
    const prefix = text.endsWith('\n') ? text : `${text}\n`
    return `${prefix}\n${block}`
  }
  let rest = text.slice(e + PRODUCT_END.length)
  if (rest.startsWith('\n')) rest = rest.slice(1)
  return text.slice(0, b) + block + rest
}

function expandFromGlob(fromPat: string, root: string): string[] {
  const n = normalizeSlashPath(fromPat).replace(/^\.\//, '')
  if (n.endsWith('/*')) {
    const dirRel = n.slice(0, -2)
    const dirAbs = path.join(root, dirRel)
    if (!existsSync(dirAbs) || !statSync(dirAbs).isDirectory()) return []
    return readdirSync(dirAbs)
      .filter((f) => statSync(path.join(dirAbs, f)).isFile())
      .map((f) => normalizeSlashPath(path.join(dirRel, f)))
      .sort()
  }
  const abs = path.join(root, n)
  if (existsSync(abs) && statSync(abs).isFile()) return [n]
  return []
}

function expandSkillSources(fromPat: string, root: string): SkillSource[] {
  const n = normalizeSlashPath(fromPat).replace(/^\.\//, '')
  const out: SkillSource[] = []
  const walkFiles = (absDir: string, sourceDirRel: string, innerPrefix: string): void => {
    if (!existsSync(absDir) || !statSync(absDir).isDirectory()) return
    for (const name of readdirSync(absDir).sort()) {
      const abs = path.join(absDir, name)
      const st = statSync(abs)
      const sourceRel = normalizeSlashPath(path.join(sourceDirRel, name))
      const innerRel = normalizeSlashPath(path.join(innerPrefix, name))
      if (st.isDirectory()) {
        if (isExecuteHatSkipped(absDir, name, false)) continue
        walkFiles(abs, sourceRel, innerRel)
      } else if (st.isFile()) {
        out.push({ sourceRel, innerRel })
      }
    }
  }
  if (n.endsWith('/*')) {
    const parentRel = n.slice(0, -2)
    const parentAbs = path.join(root, parentRel)
    if (!existsSync(parentAbs) || !statSync(parentAbs).isDirectory()) {
      fail(`host 缺 skills 源目录: ${parentRel}`, 2)
    }
    for (const name of readdirSync(parentAbs).sort()) {
      const abs = path.join(parentAbs, name)
      if (!statSync(abs).isDirectory()) continue
      if (isExecuteHatSkipped(parentAbs, name, false)) continue
      walkFiles(abs, normalizeSlashPath(path.join(parentRel, name)), name)
    }
    return out.sort((a, b) => a.sourceRel.localeCompare(b.sourceRel))
  }
  const abs = path.join(root, n)
  if (existsSync(abs) && statSync(abs).isDirectory()) {
    if (!isExecuteHatSkipped(path.dirname(abs), path.basename(n), false)) {
      walkFiles(abs, n, path.basename(n))
    }
  }
  return out.sort((a, b) => a.sourceRel.localeCompare(b.sourceRel))
}

export function commitPlannedWrites(
  target: string,
  items: PlannedItem[],
  family: BackupFamily,
  legacyRemoveRels: string[] = [],
): { written: string[]; removed: string[]; backup: string | null } {
  const toWrite = items.filter((i) => i.op === 'write' || i.op === 'merge')
  for (const item of toWrite) assertNotS2Abs(item.destAbs)
  const needBackup =
    toWrite.some((i) => existsSync(i.destAbs)) || legacyRemoveRels.length > 0
  let backup: string | null = null
  let genDir: string | null = null
  if (needBackup) {
    const ensured = ensureBackupGen(target, family, null)
    genDir = ensured.genDir
    backup = ensured.backup
  }
  const written: string[] = []
  for (const item of toWrite) {
    if (genDir && existsSync(item.destAbs)) backupFile(target, genDir, item.destRel)
    atomicWrite(item.destAbs, item.nextText)
    if (item.executable) chmodSync(item.destAbs, 0o755) // shell-hook git 钩子须可执行（验收 #10）
    written.push(item.destRel)
  }
  const removed: string[] = []
  for (const rel of legacyRemoveRels) {
    const abs = path.join(target, rel)
    if (!existsSync(abs)) continue
    if (!genDir) {
      const ensured = ensureBackupGen(target, family, genDir)
      genDir = ensured.genDir
      backup = ensured.backup
    }
    backupFile(target, genDir, rel)
    unlinkSync(abs)
    removed.push(rel)
  }
  if (needBackup || removed.length > 0) pruneBackups(target, family)
  return { written, removed, backup }
}

export function planApply(opts: {
  target: string
  rows: HostRow[]
  toolIds: string[]
  profile: string
  pkgRoot: string
  /** 3.0 W1 阶段三（S2.5）：命令目录数据源 —— v1=内建目录（resolve.ts builtinCommandSets）· v2=表 command_sets */
  commandSets: CommandSets
  /**
   * host verify 专用（3.0 W2 阶段二 · S3.4 · F-W2-04）：目标侧落点读取容错 —— 无法读取按 null
   * 计划（op 退化），由 verify 比对层 readForVerify 按 unreadable 报红点名；apply/update 不传
   * 本开关（缺省 false · 抛错行为逐字不变 · compat 零影响）。
   */
  tolerateUnreadableDest?: boolean
  /**
   * B5 用户表资产根（3.0 W2 阶段三 · S3.6 裁决②）：宿主 → 资产解析根
   * （内置 → pkgRoot · 用户表宿主 → 表文件所在目录 · 缺省 = 全量 pkgRoot 逐字现状 · compat 零影响）。
   */
  sourceRootOf?: (hostId: string) => string
  /**
   * 3.0.1 W5（实验性 · 缺省关闭）：物化 hooks 命令钉 `npx spec-wave@<semver> hook-guard …`；
   * 缺省 undefined → 与 3.0.0 逐字节一致（无 `@semver`）。
   */
  hookPinVersion?: string
}): { items: PlannedItem[]; s2: string[] } {
  const items: PlannedItem[] = []
  const s2: string[] = []
  const rowById = new Map(opts.rows.map((r) => [r.host_id, r]))

  const pushDest = (destRelRaw: string, destAbs: string): string => {
    const destRel = normalizeSlashPath(destRelRaw)
    if (isS2RelPath(destRel) || isS2AbsPath(destAbs)) s2.push(destRel)
    return destRel
  }

  // 目标侧落点读取（缺省抛错逐字不变 · tolerateUnreadableDest 时无法读取按 null 计划 → verify 层报红）
  const readDestText = (abs: string): string | null => {
    if (!existsSync(abs)) return null
    if (!opts.tolerateUnreadableDest) return readFileSync(abs, 'utf8')
    try {
      return readFileSync(abs, 'utf8')
    } catch {
      return null
    }
  }

  for (const hostId of opts.toolIds) {
    const row = rowById.get(hostId)
    if (!row) continue
    // B5：资产解析根（内置 = pkgRoot · 用户表宿主 = 表文件所在目录 · 缺省 pkgRoot 逐字现状）
    const srcRoot = opts.sourceRootOf?.(hostId) ?? opts.pkgRoot
    for (const entry of row.surfaces.always_on) {
      const sourceRel = normalizeSlashPath(entry.source)
      const sourceAbs = path.join(srcRoot, sourceRel)
      const destAbs = path.resolve(opts.target, entry.target)
      const destRel = pushDest(toRel(opts.target, destAbs), destAbs)
      if (!existsSync(sourceAbs)) {
        fail(`host apply 缺 always_on 源文件: ${sourceRel}`, 2)
      }
      const sourceBody = readFileSync(sourceAbs, 'utf8')
      const exists = existsSync(destAbs)
      const existing = readDestText(destAbs)
      if (isMarkdownMergeTarget(destRel)) {
        if (existing && productSpanHasLocal(existing)) {
          items.push({
            hostId,
            kind: 'always_on',
            destRel,
            destAbs,
            sourceRel,
            sourceAbs,
            op: 'conflict',
            nextText: existing,
          })
          continue
        }
        const nextText = mergeMarkdownAlwaysOn(existing, sourceBody)
        let op: PlannedOp = exists ? 'merge' : 'write'
        if (existing !== null && existing === nextText) op = 'skip_identical'
        items.push({
          hostId,
          kind: 'always_on',
          destRel,
          destAbs,
          sourceRel,
          sourceAbs,
          op,
          nextText,
        })
        continue
      }
      // .mdc 及其他 always_on：缺失则写；已存在不同内容：kit 管理则覆写，否则 conflict
      if (!exists) {
        items.push({
          hostId,
          kind: 'always_on',
          destRel,
          destAbs,
          sourceRel,
          sourceAbs,
          op: 'write',
          nextText: sourceBody,
        })
        continue
      }
      if (existing === sourceBody) {
        items.push({
          hostId,
          kind: 'always_on',
          destRel,
          destAbs,
          sourceRel,
          sourceAbs,
          op: 'skip_identical',
          nextText: sourceBody,
        })
        continue
      }
      if (isKitManagedContent(existing ?? '')) {
        items.push({
          hostId,
          kind: 'always_on',
          destRel,
          destAbs,
          sourceRel,
          sourceAbs,
          op: 'write',
          nextText: sourceBody,
        })
      } else {
        items.push({
          hostId,
          kind: 'always_on',
          destRel,
          destAbs,
          sourceRel,
          sourceAbs,
          op: 'conflict',
          nextText: sourceBody,
        })
      }
    }

    // skills：与表一致物化；跳过 30/40（isExecuteHatSkipped）
    for (const entry of row.surfaces.skills ?? []) {
      const sources = expandSkillSources(entry.from, srcRoot)
      for (const src of sources) {
        const sourceAbs = path.join(srcRoot, src.sourceRel)
        const destAbs = path.resolve(opts.target, entry.target_dir, src.innerRel)
        const destRel = pushDest(toRel(opts.target, destAbs), destAbs)
        const sourceBody = readFileSync(sourceAbs, 'utf8')
        const exists = existsSync(destAbs)
        const existing = readDestText(destAbs)
        let op: PlannedOp = 'write'
        if (exists && existing === sourceBody) op = 'skip_identical'
        items.push({
          hostId,
          kind: 'skill',
          destRel,
          destAbs,
          sourceRel: src.sourceRel,
          sourceAbs,
          op,
          nextText: sourceBody,
        })
      }
    }

    for (const entry of row.surfaces.commands) {
      if (!commandEntryApplies(entry.profile, opts.profile)) continue
      const band: 'core' | 'expanded' = entry.profile === 'expanded' ? 'expanded' : 'core'
      const matched = expandFromGlob(entry.from, srcRoot).filter((rel) => {
        const base = path.basename(rel)
        return band === 'core'
          ? parseCoreCommandBasename(base, opts.commandSets.core) !== null
          : parseExpandedCommandBasename(base, opts.commandSets.expanded) !== null
      })
      if (band === 'core') {
        const have = new Set(
          matched
            .map((rel) => parseCoreCommandBasename(path.basename(rel), opts.commandSets.core))
            .filter((v): v is string => v !== null),
        )
        const missing = opts.commandSets.core.filter((v) => !have.has(v))
        if (missing.length > 0) {
          fail(
            `host apply 缺 core 命令资产（from=${entry.from}）: ${missing.map((v) => `${v}.md|kit-${v}.md`).join(', ')}`,
            2,
          )
        }
      } else {
        const have = new Set(
          matched
            .map((rel) => parseExpandedCommandBasename(path.basename(rel), opts.commandSets.expanded))
            .filter((v): v is string => v !== null),
        )
        const missing = opts.commandSets.expanded.filter((v) => !have.has(v))
        if (missing.length > 0) {
          fail(
            `host apply 缺 expanded 命令资产（from=${entry.from}）: ${missing.map((v) => `${v}.md|kit-${v}.md`).join(', ')}`,
            2,
          )
        }
      }
      for (const sourceRelRaw of matched) {
        const sourceRel = normalizeSlashPath(sourceRelRaw)
        const sourceAbs = path.join(srcRoot, sourceRel)
        const destAbs = path.resolve(opts.target, entry.target_dir, path.basename(sourceRel))
        const destRel = pushDest(toRel(opts.target, destAbs), destAbs)
        const sourceBody = readFileSync(sourceAbs, 'utf8')
        const exists = existsSync(destAbs)
        const existing = readDestText(destAbs)
        let op: PlannedOp = 'write'
        if (exists && existing === sourceBody) op = 'skip_identical'
        items.push({
          hostId,
          kind: 'command',
          destRel,
          destAbs,
          sourceRel,
          sourceAbs,
          op,
          nextText: sourceBody,
        })
      }
    }

    // hooks（3.0 W2 · S3.3）：config-hook 族物化 JSON 合并落点（深合并保用户键 ·
    // 结构性冲突 conflict 点名不覆写 · F-W2-10）；shell-hook 族物化 .git/hooks/pre-commit
    //（阶段四 · 验收 #10 · F-W2-11 非本包 hook conflict 不覆写）；none 零落点（降级留痕归报告面 S3.5）。
    const hooksDecl = (row.surfaces as { hooks?: HooksDecl }).hooks
    if (hooksDecl && hooksDecl.mechanism === 'shell-hook') {
      // S3.1 族×触发表：shell-hook 仅 pre-commit 物化（git 层宿主中立）· pre-archive 不物化
      //（降级留痕 = 脚本头 not-materialized 注记 · 不静默）；仅声明 pre-archive → 零落点。
      // 30 裁决：target 非 git 仓（无 .git）→ 不创 .git · 零落点（apply/verify 同口径 · 无红）。
      if (hooksDecl.triggers.includes('pre-commit') && existsSync(path.join(opts.target, '.git'))) {
        const destAbs = path.resolve(opts.target, SHELL_HOOK_PRE_COMMIT_REL)
        const destRel = pushDest(toRel(opts.target, destAbs), destAbs)
        const script = buildShellHookScript(hooksDecl.triggers, opts.hookPinVersion)
        const exists = existsSync(destAbs)
        const existingText = readDestText(destAbs)
        if (exists && existingText !== null && !isShellHookManaged(existingText)) {
          // F-W2-11：非本包管理 git hook → conflict skip 点名（不得静默覆盖用户既有 hook）
          items.push({
            hostId,
            kind: 'hook',
            destRel,
            destAbs,
            sourceRel: 'surfaces.hooks',
            sourceAbs: '',
            op: 'conflict',
            nextText: existingText,
            hooksTriggers: [...hooksDecl.triggers],
            hookMechanism: 'shell-hook',
            executable: true,
          })
        } else {
          let op: PlannedOp = exists ? 'merge' : 'write'
          if (existingText !== null && existingText === script) op = 'skip_identical'
          items.push({
            hostId,
            kind: 'hook',
            destRel,
            destAbs,
            sourceRel: 'surfaces.hooks',
            sourceAbs: '',
            op,
            nextText: script,
            hooksTriggers: [...hooksDecl.triggers],
            hookMechanism: 'shell-hook',
            executable: true,
          })
        }
      }
    }
    if (hooksDecl && hooksDecl.mechanism === 'config-hook') {
      const spec = configHookSpecOf(hostId)
      if (!spec) {
        fail(`host apply: config-hook 宿主无物化落点映射: ${hostId}（族映射表外宿主 fail-closed · 不静默）`, 2)
      }
      const destAbs = path.resolve(opts.target, spec.destRel)
      const destRel = pushDest(toRel(opts.target, destAbs), destAbs)
      const exists = existsSync(destAbs)
      const existingText = readDestText(destAbs)
      const merged = mergeHookConfig(existingText, hostId, hooksDecl.triggers, opts.hookPinVersion)
      if (!merged.ok) {
        items.push({
          hostId,
          kind: 'hook',
          destRel,
          destAbs,
          sourceRel: 'surfaces.hooks',
          sourceAbs: '',
          op: 'conflict',
          nextText: existingText ?? '',
          hooksTriggers: [...hooksDecl.triggers],
          hookMechanism: 'config-hook',
        })
      } else {
        const nextText = `${JSON.stringify(merged.next, null, 2)}\n`
        let op: PlannedOp = exists ? 'merge' : 'write'
        if (existingText !== null && existingText === nextText) op = 'skip_identical'
        items.push({
          hostId,
          kind: 'hook',
          destRel,
          destAbs,
          sourceRel: 'surfaces.hooks',
          sourceAbs: '',
          op,
          nextText,
          hooksTriggers: [...hooksDecl.triggers],
          hookMechanism: 'config-hook',
        })
      }
    }
  }
  return { items, s2 }
}

export function remapUpdateConflicts(items: PlannedItem[], force: boolean): void {
  for (const item of items) {
    if ((item.kind === 'command' || item.kind === 'skill') && item.op === 'write' && existsSync(item.destAbs)) {
      if (!force) item.op = 'conflict'
    }
    if (item.kind === 'always_on' && item.op === 'conflict' && force) {
      const existing = existsSync(item.destAbs) ? readFileSync(item.destAbs, 'utf8') : ''
      if (!productSpanHasLocal(existing)) item.op = 'write'
    }
  }
}
