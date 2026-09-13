/**
 * 2.3.0 W5 · A2 · 资产完整性校验（assets integrity）· spec-wave assets verify / manifest rebuild
 *
 * 蓝本：docs/spec/2_3-wiring-completion/05_w5_assets_integrity_v1.md（唯一 SPEC）。
 * 语义族独立于 pins（SPEC §6：pins=版本/身份钉 · assets=内容完整性 · 不并入）；
 * 门禁语义同构：failClosed exit 2（D-PINS-EXIT 同档 · 00 §2 P0）。
 * 定案：D-23-W5-GEN-CMD（生成=显式命令非 build 钩子 · 防门禁消解 F-W5-08）·
 * D-23-W5-FIX-TARGET（修复对象=manifest · 资产为真值永不反向改）·
 * D-23-W5-NOBAK（manifest 派生数据无 .bak）· D-23-W5-EXCLUDE（排除清单单一常量双侧消费）。
 */
import { createHash } from 'node:crypto'
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fail, normalizeSlashPath, takeOption } from './cli-shared.ts'

const ASSETS_REL = 'assets'
const MANIFEST_REL = 'assets/sha256.manifest'
const ASSETS_USAGE =
  'npx spec-wave assets verify [--target PATH] [--json]' + '\n' +
  '  npx spec-wave assets manifest rebuild [--target PATH] [--yes]  （默认 dry-run · 修复对象=manifest · 资产永不反向改）'

/**
 * D-23-W5-EXCLUDE（F-W5-06）：排除清单单一真值——生成与 verify 双侧消费同一实现，
 * 双侧一致由构造保证。manifest 自身（sha256.manifest）永不在清单内（SPEC §3①）。
 */
function isExcludedBasename(basename: string): boolean {
  if (basename === 'sha256.manifest') return true
  if (basename === '.DS_Store') return true
  if (basename.endsWith('.bak')) return true
  if (basename.endsWith('~')) return true
  return false
}

function sha256File(abs: string): string {
  return createHash('sha256').update(readFileSync(abs)).digest('hex')
}

/**
 * 遍历 <root>/assets 下全部常规文件（排除清单 D-23-W5-EXCLUDE · symlink/非常规文件跳过），
 * 返回 posix 相对路径（F-W5-04）确定性排序的条目集。assets 目录缺失 → failClosed exit 2（F-W5-02）。
 */
function collectAssets(root: string): AssetEntry[] {
  const assetsAbs = path.join(root, ASSETS_REL)
  if (!existsSync(assetsAbs) || !statSync(assetsAbs).isDirectory()) {
    fail('ASSETS: BLOCKED · assets 目录缺失: ' + ASSETS_REL + '（F-W5-02 failClosed · 本命令校验对象为包内 assets/）', 2)
  }
  const entries: AssetEntry[] = []
  const walk = (dir: string, rel: string): void => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const childRel = rel ? rel + '/' + e.name : e.name
      if (e.isDirectory()) {
        walk(path.join(dir, e.name), childRel)
      } else if (e.isFile()) {
        if (isExcludedBasename(e.name)) continue
        entries.push({ path: childRel, hash: sha256File(path.join(dir, e.name)) })
      }
    }
  }
  walk(assetsAbs, '')
  entries.sort((a, b) => (a.path < b.path ? -1 : a.path > b.path ? 1 : 0))
  return entries
}

/** manifest 文本：逐行 sha256 + 两空格 + posix relpath（sha256sum 生态一致 · SPEC §6 荐）。 */
function renderManifest(entries: AssetEntry[]): string {
  return entries.map((e) => e.hash + '  ' + e.path).join('\n') + '\n'
}

const MANIFEST_LINE_RE = /^([0-9a-f]{64})  (.+)$/

/**
 * 解析 manifest（F-W5-01 failClosed：缺失/坏行/重复路径/越界路径一律 exit 2 指 manifest 本身）。
 * 越界路径（绝对 / .. 逃逸）拒读——manifest 是声明不是指令，不得引导读出 assets/ 之外。
 */
function loadManifest(root: string): AssetEntry[] {
  const abs = path.join(root, MANIFEST_REL)
  if (!existsSync(abs)) {
    fail(
      'ASSETS: BLOCKED · manifest 缺失: ' + MANIFEST_REL +
        '（F-W5-01 failClosed · 修复: npx spec-wave assets manifest rebuild --yes）',
      2,
    )
  }
  const lines = readFileSync(abs, 'utf8').split('\n')
  const entries: AssetEntry[] = []
  const seen = new Set<string>()
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]! // i < lines.length 循环界内（E5 noUncheckedIndexedAccess 收窄）
    if (line === '' && i === lines.length - 1) continue // 尾部换行
    const m = MANIFEST_LINE_RE.exec(line)
    if (!m) {
      fail('ASSETS: BLOCKED · manifest 语法错误: ' + MANIFEST_REL + ' 第 ' + (i + 1) + ' 行（F-W5-01 failClosed · 期望 sha256+两空格+path 行格式）', 2)
    }
    const rel = normalizeSlashPath(m[2]!) // MANIFEST_LINE_RE 双捕获组必参与（E5 收窄）
    if (path.isAbsolute(rel) || rel === '..' || rel.startsWith('../') || rel.split('/').includes('..')) {
      fail('ASSETS: BLOCKED · manifest 路径越界: ' + MANIFEST_REL + ' 第 ' + (i + 1) + ' 行 ' + rel + '（拒绝读取 assets/ 之外 · failClosed）', 2)
    }
    if (seen.has(rel)) {
      fail('ASSETS: BLOCKED · manifest 路径重复: ' + MANIFEST_REL + ' 第 ' + (i + 1) + ' 行 ' + rel + '（F-W5-01 failClosed）', 2)
    }
    seen.add(rel)
    entries.push({ path: rel, hash: m[1]! })
  }
  return entries
}

function runAssetsVerify(root: string): { results: FileResult[]; registered: number } {
  // F-W5-02 优先于 F-W5-01：assets 目录缺失是更根本的偏差，先判（报错指向目录而非 manifest）
  const actual = collectAssets(root)
  const declared = loadManifest(root)
  const actualByPath = new Map(actual.map((e) => [e.path, e.hash]))
  const results: FileResult[] = []
  for (const d of declared) {
    const got = actualByPath.get(d.path)
    if (got === undefined) {
      results.push({ path: d.path, status: 'missing', expected: d.hash })
    } else if (got !== d.hash) {
      results.push({ path: d.path, status: 'mismatch', expected: d.hash, actual: got })
    } else {
      results.push({ path: d.path, status: 'ok', expected: d.hash })
    }
    actualByPath.delete(d.path)
  }
  for (const [p, hash] of [...actualByPath.entries()].sort()) {
    results.push({ path: p, status: 'extra', actual: hash })
  }
  results.sort((a, b) => (a.path < b.path ? -1 : a.path > b.path ? 1 : 0))
  return { results, registered: declared.length }
}

function cmdAssetsVerify(root: string, json: boolean): void {
  const { results, registered } = runAssetsVerify(root)
  const bad = results.filter((r) => r.status !== 'ok')
  const counts = {
    registered,
    ok: results.filter((r) => r.status === 'ok').length,
    mismatch: bad.filter((r) => r.status === 'mismatch').length,
    missing: bad.filter((r) => r.status === 'missing').length,
    extra: bad.filter((r) => r.status === 'extra').length,
  }
  if (json) {
    console.log(JSON.stringify({
      status: bad.length === 0 ? 'pass' : 'blocked',
      manifest: MANIFEST_REL,
      counts,
      files: results,
    }, null, 2))
  } else {
    console.log('assets verify · manifest ' + MANIFEST_REL + ' · 登记 ' + registered + ' 文件')
    for (const r of results) {
      if (r.status === 'ok') {
        console.log('[ok] ' + r.path)
      } else if (r.status === 'mismatch') {
        console.log('[mismatch] ' + r.path + ' · actual=' + (r.actual ?? '').slice(0, 12) + '… expected=' + (r.expected ?? '').slice(0, 12) + '…（内容变更 · 篡改或漏重生成）')
      } else if (r.status === 'missing') {
        console.log('[missing] ' + r.path + '（manifest 登记但文件不存在）')
      } else {
        console.log('[extra] ' + r.path + '（文件存在但 manifest 未登记）')
      }
    }
    if (bad.length === 0) {
      console.log('ASSETS: PASS · ' + counts.ok + '/' + registered + ' 文件一致')
    } else {
      console.log('ASSETS: BLOCKED · ' + bad.length + ' 偏差 / ' + registered + ' 登记（mismatch ' + counts.mismatch + ' · missing ' + counts.missing + ' · extra ' + counts.extra + ' · failClosed exit 2）')
    }
  }
  if (bad.length > 0) {
    fail('ASSETS: BLOCKED · ' + bad.length + ' 偏差（详见上方 · 修复: npx spec-wave assets manifest rebuild（默认 dry-run））', 2)
  }
}

function cmdAssetsManifestRebuild(root: string, yes: boolean): void {
  const entries = collectAssets(root) // assets 目录缺失 → F-W5-02 exit 2（不生成空 manifest 伪装绿）
  const content = renderManifest(entries)
  const abs = path.join(root, MANIFEST_REL)
  const old = existsSync(abs) ? readFileSync(abs, 'utf8') : null
  const oldSet = new Map<string, string>()
  if (old !== null) {
    for (const line of old.split('\n')) {
      const m = MANIFEST_LINE_RE.exec(line)
      if (m) oldSet.set(normalizeSlashPath(m[2]!), m[1]!)
    }
  }
  const newSet = new Map(entries.map((e) => [e.path, e.hash]))
  const added = entries.filter((e) => !oldSet.has(e.path)).length
  const removed = [...oldSet.keys()].filter((p) => !newSet.has(p)).length
  const changed = entries.filter((e) => oldSet.has(e.path) && oldSet.get(e.path) !== e.hash).length
  const unchanged = entries.length - added - changed
  console.log('assets manifest rebuild · 扫描 ' + ASSETS_REL + '/（排除 sha256.manifest · *.bak · *~ · .DS_Store）')
  console.log('登记 ' + entries.length + ' 文件 · 相对现有 manifest：+' + added + ' 新增 / -' + removed + ' 移除 / ~' + changed + ' 变更 / =' + unchanged + ' 不变')
  if (old === content) {
    console.log('ASSETS MANIFEST: 无变化 · ' + entries.length + ' 条已同步（幂等 · 零写盘）')
    return
  }
  if (!yes) {
    console.log('ASSETS MANIFEST: dry-run · 以上为将写计划（--yes 才写盘 · 修复对象=manifest 声明 · 资产为真值永不反向改 · 无 .bak D-23-W5-NOBAK）')
    return
  }
  writeFileSync(abs, content)
  console.log('[written] ' + MANIFEST_REL + '（' + entries.length + ' 条）')
  console.log('ASSETS MANIFEST: 已重生成 · 复核: npx spec-wave assets verify')
}

type AssetEntry = { path: string; hash: string }
type FileStatus = 'ok' | 'mismatch' | 'missing' | 'extra'
type FileResult = { path: string; status: FileStatus; expected?: string; actual?: string }

export async function cmdAssets(args: string[]): Promise<void> {
  const [sub, ...rest0] = args
  if (sub !== 'verify' && sub !== 'manifest') {
    fail('assets 子命令未知: ' + (sub ?? '(空)') + '\n用法: ' + ASSETS_USAGE, 1)
  }
  let rest: string[] = rest0
  if (sub === 'manifest') {
    const [action, ...rest1] = rest
    if (action !== 'rebuild') {
      fail('assets manifest 动作未知: ' + (action ?? '(空)') + '\n用法: ' + ASSETS_USAGE, 1)
    }
    rest = rest1
  }
  const t = takeOption(rest, '--target')
  const extra: string[] = []
  let json = false
  let yes = false
  for (const a of t.rest) {
    if (a === '--json' && sub === 'verify') { json = true; continue }
    if (a === '--yes' && sub === 'manifest') { yes = true; continue }
    extra.push(a)
  }
  if (extra.length > 0) fail('assets 未知参数: ' + extra.join(' ') + '\n用法: ' + ASSETS_USAGE, 1)
  const root = path.resolve(t.value ?? process.cwd())
  if (sub === 'verify') cmdAssetsVerify(root, json)
  else cmdAssetsManifestRebuild(root, yes)
}
