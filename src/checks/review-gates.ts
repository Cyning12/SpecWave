import { existsSync, readdirSync } from 'node:fs'
import path from 'node:path'
import { normalizeSlug, parseHarnessMeta } from '../cli-shared.ts'
import type { CloseGuardOutcome } from './close-guards.ts'

// ==== verify --spec / spec_reviews_retention（PRD_DEF-003 后续棒 · 单一实现源） ====
// 语义映射旧包 @cyning/harness@2.24.0 lib/task-meta.js findSpecReview / shouldSkipSpecAudit /
// extractSpecSlug（lib/verify.js verifySpecTarget 消费）。与旧包差异（PR body 对照）：
//   ① 目录布局与 findReview 同口径扫 docs/harness/reviews 与 reviews/ 双路径（旧包仅 docs/harness/reviews）；
//   ② 旧包 --workspace-root 第二仓根旗标本包不支持（DEF-011 fail-fast 清单既有钉死）。

// SPEC slug 推导：Harness 元信息表 spec_slug 优先；回退文件名去 SPEC[-_] 前缀与 _v<n> 版本后缀。
// D-23-SPEC-SLUG（2.3-W1 · 机制债 [D]）：目录型 SPEC 夹（doc-health 公约 `docs/spec/<slug>/README.md`）
// 下 basename 回退误推 `readme` → 审查文存在性闸（findSpecReview）按错 slug 查找误判。
// basename 去前缀/后缀后 ∈ {readme, index}（大小写不敏感）→ 取父目录名为 slug
//（normalize 归一在消费侧 normalizeSlug 既有生效 · F-W1-06 failClosed 语义保持）。
export function extractSpecSlug(specFile: string, content: string): string {
  const meta = content ? parseHarnessMeta(content) : {}
  if (meta.spec_slug) return meta.spec_slug
  let base = path.basename(specFile, '.md')
  base = base.replace(/^SPEC[-_]/i, '')
  base = base.replace(/_v\d+$/, '')
  if (base.toLowerCase() === 'readme' || base.toLowerCase() === 'index') {
    base = path.basename(path.dirname(specFile))
  }
  return base
}

// bugfix / 显式跳过 10-spec 审计：不要求 SPEC 审查文（lifecycle.yaml to_00 守卫 note 同口径）。
// 只认元信息表 / 文首 track 行——避免命中正文里对规则的说明文字（旧包口径逐字映射）。
export function shouldSkipSpecAudit(content: string): boolean {
  if (!content) return false
  const meta = parseHarnessMeta(content)
  if (String(meta.skip_spec_audit ?? '').toLowerCase() === 'true') return true
  if (String(meta.track ?? '').toLowerCase() === 'bugfix') return true
  if (/^>\s*\*\*track\*\*[：:]\s*`?bugfix\b/im.test(content)) return true
  return false
}

// SPEC 的 R<n> 审查文存在性（verify --spec 与 lifecycle dry-run to_00 同口径）：
// 扫描 docs/harness/reviews 与 reviews/ 双路径（与 findReview 布局一致），命名兼容旧包三模式
//   1. spec_<slug>_audit_R<n>_*.md（推荐）
//   2. spec_<slug>_ACCEPT_R<n>_*.md
//   3. task_<slug>_spec_ACCEPT_R<n>_*.md
export function findSpecReview(target: string, specFile: string, content: string): boolean {
  const dirs = [path.join(target, 'docs/harness/reviews'), path.join(target, 'reviews')]
  const stripVer = (s: string) => s.replace(/_v\d+$/, '')
  const slugNorm = normalizeSlug(stripVer(extractSpecSlug(specFile, content)))
  const PATTERNS = [
    /^spec_(.+?)_audit_R\d+_.*\.md$/i,
    /^spec_(.+?)_ACCEPT_R\d+_.*\.md$/i,
    /^task_(.+?)_spec_ACCEPT_R\d+_.*\.md$/i,
  ]
  for (const reviewsDir of dirs) {
    if (!existsSync(reviewsDir)) continue
    for (const name of readdirSync(reviewsDir)) {
      for (const RE of PATTERNS) {
        const m = name.match(RE)
        if (!m) continue
        if (normalizeSlug(stripVer(m[1]!)) === slugNorm) return true // 捕获组必参与（E5 收窄）
        break
      }
    }
  }
  return false
}

// spec_reviews_retention（lifecycle.yaml to_00 登记 · severity=block · allow=--allow-no-spec-review）：
// dry-run 的 --task 在该转移下携带待签收 SPEC 路径（非 task 文件 · 守卫 note「不挂 verify --task」）。
export function evalSpecReviewsRetention(
  target: string,
  absSpec: string,
  content: string,
): CloseGuardOutcome {
  if (shouldSkipSpecAudit(content)) {
    return { status: 'pass', detail: 'skip SPEC review gate（bugfix / skip_spec_audit 元信息豁免）' }
  }
  return findSpecReview(target, absSpec, content)
    ? {
        status: 'pass',
        detail: 'spec R<n> 审查文存在（docs/harness/reviews 或 reviews/ 命中 spec_*_audit_R<n>_* / *_ACCEPT_R<n>_*）',
      }
    : {
        status: 'fail',
        detail: 'missing spec R<n> review（docs/harness/reviews 与 reviews/ 均无 · 或 --allow-no-spec-review 豁免）',
      }
}

// R<n> 审查文扫描（DEF-003 T4 真值源 · 2.3-W4 升级为最新轮返回）：扫描 docs/harness/reviews 与
// reviews/ 双路径，文件名口径 task_<slug>_audit_R<n>_*.md（slug 去 _v<n> 版本后缀）；
// 返回最高 R 轮文件（终轮结论为真值 · R2 通过覆盖 R1 退回）；无命中 → null。
export function findLatestReview(
  target: string,
  taskFile: string,
): { path: string; name: string; round: number } | null {
  const dirs = [path.join(target, 'docs/harness/reviews'), path.join(target, 'reviews')]
  const stripVer = (s: string) => s.replace(/_v\d+$/, '')
  const base = stripVer(path.basename(taskFile, '.md'))
  const RE = /^(task_.+?)_audit_R(\d+)_.*\.md$/i
  let best: { path: string; name: string; round: number } | null = null
  for (const reviewsDir of dirs) {
    if (!existsSync(reviewsDir)) continue
    for (const name of readdirSync(reviewsDir)) {
      const m = name.match(RE)
      if (!m) continue
      if (stripVer(m[1]!) !== base) continue // 捕获组必参与（E5 收窄）
      const round = parseInt(m[2]!, 10)
      if (!best || round > best.round || (round === best.round && name > best.name)) {
        best = { path: path.join(reviewsDir, name), name, round }
      }
    }
  }
  return best
}

// R<n> 审查文存在性（布尔投影 · findLatestReview 单一实现源 · status / dry-run 消费）
export function findReview(target: string, taskFile: string): boolean {
  return findLatestReview(target, taskFile) !== null
}

// ==== 2.3-W4 G2 结论级：审查文「R1 通过判定」机读口径（评审文 w4_gate_wiring_plan_review_20260913 §2.1 定稿 v2） ====
// 抽取：节标题以「结论/签收」起首（允许中文序号前缀）的节合并。
// 2.3.1 N11 [P1]（验收报告-SpecWave-2.3.0 §3.L）：无结论/签收节 → 直接判未通过（禁止回退全文 ·
// A2 形态「只写通过二字」绕过面封堵 · failClosed 成立）。
// 通过词：PASS / ACCEPT / 签收 / 通过 / 零内容阻塞 / 零阻塞（大小写不敏感 · 须落结论节内）。
// 否定守卫：退回（前置 无需/不/未 除外）· 否定+通过同句共现（2.4.2 R-2：窗口由 2.4.1 的
// 「不/未 与 通过 之间 ≤3 任意字符」放宽为同句共现 `不[^。；\n]{0,12}通过` / `未[^。；\n]{0,12}通过` ——
// 封堵「不最终予以通过」「未能够予以通过」插 4 字超窗形态（验收报告-SpecWave-2.4.1 §3.1 行 I/J ·
// §4 R-4 建议形态）；窗口显式排除 `\n` → R-5 换行形态维持已登记残余不动（归 3.0 · K 断言钉死）；
// 排除 `。；` 限同句防跨句误中）· no pass / not pass / reject（英文基本形态 · i 旗标 ·
// R-2 补 `not\s*pass` 封堵 `NOT PASS` 形态 · §3.1 行 G）· 内容阻塞（前置 零 除外）——命中即不通过。
// 3.0-W4 NEW-11（评审文 w4_semantic_criteria_review_20260917 §3.3 定稿 · 63 份合规结论节误伤 0/63 实测）：
// 词表广义化五类入表 —— 中文签收面（不予/不/未签收）· 英文否定完成式（doesn't/does not pass ·
// fail to pass · not approv*）· 英文否决族（decline/veto/refuse）· 中英混入（不/未+pass · not/no+通过）·
// `\bNG\b` 不入首批（OQ-4 观察名单：本仓 284 份 0 命中 · 消费者英文 prose 或有他义 · 若日后入限结论节作用域）。
// 误伤兜底：措辞巧合误伤阈值与回退档见 task_2_4_2_patch R-2-c（存量实测 0 翻转 · 留痕在案）。
// 判定：通过词命中且无否定命中且节内容量达标（2.4-W2 S1·N=20）→ pass；否则 fail（不可解析 = 不通过 · 不误绿）。
const REVIEW_SECTION_HEAD_RE = /^#{2,3}\s*(?:[一二三四五六七八九十]+[、.]\s*)?(结论|签收)/
const REVIEW_PASS_RE = /(\bPASS\b|ACCEPT|签收|零内容阻塞|零阻塞|通过)/i
// NEW-11 五类形态说明与残余登记见上方注释块（:132-135 · 残余四类：日韩德法俄全形态/符号形态/谐音拆字全角/拼音 ·
// 不承诺完备 · 后续发现新形态 → 补词表 + fixture · 循本次同流程 · F-W4-02 兑现面）。
const REVIEW_NEG_RE = /((?<!无需)(?<!不)(?<!未)退回|不[^。；\n]{0,12}通过|未[^。；\n]{0,12}通过|不予签收|不签收|未签收|no\s*pass|not\s*pass|doesn['’]t\s*pass|does\s+not\s+pass|fail(?:ed|s)?\s+to\s+pass|not\s+approv\w*|\bdeclined?\b|\bveto(?:ed)?\b|\brefused?\b|(?:不|未)\s*pass|not\s*通过|no\s*通过|reject|(?<!零)内容阻塞)/i
// 2.4-W2 S1·N=20（评审文 w2_conclusion_gate_strength_review_20260914 §4 定档）：
// 结论/签收节合并文本去除全部通过词命中后，残余非空白字符数须 >= REVIEW_MIN_SUBSTANCE，
// 封堵 A2 收窄形态「结论节只写通过二字」（存量 48 份现行 PASS 文实测误伤 0/48 · D-24-W2-NO-RETRO 不追溯）。
const REVIEW_MIN_SUBSTANCE = 20
const REVIEW_PASS_STRIP_RE = new RegExp(REVIEW_PASS_RE.source, 'gi')

// 3.0-W4 NEW-5（评审文 w4_semantic_criteria_review_20260917 §2 定稿 · OQ-1 档 M 采纳 · 20-task-audit R1 维持档 M）：
// 结论/签收节内语义组合判 VERB ∧ SUBJ ∧ (OBJ ∨ GATE)（节内共现 · 不要求同行同句）·
// 与否定守卫 / 通过词 / substance≥20 地板全部 AND 保留（双保险防「词齐但仍是碎句」）。
// 词集单点声明（防双份真值）：VERB = REVIEW_PASS_RE 沿用不扩（63/63 实测命中）·
// SUBJ/OBJ/GATE 三集唯一真值即下列三常量（评审文 §2.2 · 63 份合规结论节命中率 57/59/61 在案 ·
// 档 M 误伤恰 6 件全枚举入 docs/harness/legacy-gate-exempt.yaml 留痕 · 循 2.3.1 N11 先例不追溯）。
const REVIEW_SUBJ_RE = /审查|评审|核对|复核|审计|验收|检查|audit|review/i
const REVIEW_OBJ_RE = /任务|task|SPEC|PLAN|范围|验收|交付|变更|计划|闸|钉|docs\/|src\/|本波|W\d/i
const REVIEW_GATE_RE = /HG-[A-Z-]+|approved|人闸|代签|闸/i

export function evalReviewConclusion(content: string): { pass: boolean; detail: string } {
  const lines = content.split('\n')
  const chunks: string[] = []
  let cur: string[] | null = null
  for (const l of lines) {
    if (REVIEW_SECTION_HEAD_RE.test(l)) {
      if (cur) chunks.push(cur.join('\n'))
      cur = [l]
      continue
    }
    if (cur && /^#{2,3}\s+/.test(l)) {
      chunks.push(cur.join('\n'))
      cur = null
      continue
    }
    if (cur) cur.push(l)
  }
  if (cur) chunks.push(cur.join('\n'))
  // 2.3.1 N11：无结论/签收节 → 直接判未通过（禁止回退全文）
  if (chunks.length === 0) {
    return { pass: false, detail: '无结论/签收节（禁止回退全文 · 审查文须含以「结论/签收」起首的 ##/### 节且通过词落节内）' }
  }
  const text = chunks.join('\n')
  const scope = '结论/签收节'
  if (REVIEW_NEG_RE.test(text)) return { pass: false, detail: scope + '含否定结论词（退回/不.未通过/不予.不.未签收/no.not pass/doesn\'t/fail to pass/not approv*/reject/decline/veto/refuse/中英混入/内容阻塞）' }
  if (!REVIEW_PASS_RE.test(text)) return { pass: false, detail: scope + '无可机读通过词（PASS/ACCEPT/签收/通过/零阻塞）' }
  // 2.4-W2 S1·N=20：节内容量判据（去通过词后残余非空白字符 < N → 判未通过 · failClosed 方向）
  const substance = text.replace(REVIEW_PASS_STRIP_RE, '').replace(/\s+/g, '').length
  if (substance < REVIEW_MIN_SUBSTANCE) {
    return { pass: false, detail: scope + `内容量不足（去通过词后非空白 ${substance}<${REVIEW_MIN_SUBSTANCE} 字符 · 结论节须含实质签收内容 · 2.4-W2 S1·N=20）` }
  }
  // 3.0-W4 NEW-5 档 M 语义组合判（判定链尾 · failClosed · 缺维即不通过 · detail 点名缺失维度）。
  // 诚实边界（评审文 §2.4 末行 · R-① 登记面）：机械判据不防「成段伪造一次并未发生的审查」——
  // 该残余由 invoke 留痕（close_invoke 帽集合闸）与 HG-AUDIT-R1 人签兜底，语义闸职责 = 把裸长度/裸动词顶包逐出合规面。
  if (!REVIEW_SUBJ_RE.test(text)) {
    return { pass: false, detail: scope + '缺审查行为陈述（SUBJ）· 档 M 语义判须陈述审查行为（审查/评审/核对/复核/审计/验收/检查/audit/review · 3.0-W4 NEW-5）' }
  }
  if (!REVIEW_OBJ_RE.test(text) && !REVIEW_GATE_RE.test(text)) {
    return { pass: false, detail: scope + '缺对象或闸指涉（OBJ∨GATE）· 档 M 语义判须指涉被审对象或闸（3.0-W4 NEW-5）' }
  }
  return { pass: true, detail: scope + '结论可机读通过' }
}
