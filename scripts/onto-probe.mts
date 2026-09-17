// W3 前置研究 · 本体引用完整性探针（零新依赖 · 仅既有 js-yaml）
//
// 来源：镜像自 .workbuddy/output/_frag/onto_probe_20260915.mjs（2026-09-15 起草轮本地件），
//       按 3.0 硬约束 14「证据必须入库」迁入 tracked 路径；
//       正式研究文：docs/harness/reviews/w3_ontology_graph_research_20260917.md。
//
// 用途：校验 assets/ontology.yaml 的引用完整性（4 条「SHACL 语义子集」形状，约 40 行）。
// 实测结论：relations 存在 3 处悬空引用（sh:class 违规）——
//   relations[0](embedsInto) 两端 DisciplinePackage / BusinessRepository 未声明；
//   relations[3](produces) 客体 TraceArtifact 未声明。
// 该缺陷 OWL(OWA) 判不出，须 CWA 校验 —— 是「不引 OWL」裁决（D-30-OWL-REJECT）的可运行反证。
//
// 运行：cd <repo> && node scripts/onto-probe.mts
// 预期：conforms: false，3 处 VIOLATION，exit 2（与 failClosed 口径一致）。
//
// 处置留痕：本脚本是 W3-A4 首批形状集的种子；W3 实施 task 迁入 src/ 时须配负向 fixture，
//           并对 3 处违规则二选一（真修补齐声明 / 显式登记设计性裁剪豁免），不得静默放过。

import { readFileSync } from 'node:fs'
import path from 'node:path'
import yaml from 'js-yaml'

const REPO = process.cwd()
const ONTO = path.join(REPO, 'assets', 'ontology.yaml')
const doc = yaml.load(readFileSync(ONTO, 'utf8'))
const violations = []
const V = (shape, where, msg) => violations.push({ shape, where, msg })

// 形状 1 · ClassShape：classes[].id 存在且唯一
const classIds = new Set()
for (const [i, c] of (doc.classes ?? []).entries()) {
  if (!c?.id) V('ClassShape', `classes[${i}]`, 'sh:minCount 1 违反 —— 缺 id')
  if (classIds.has(c?.id)) V('ClassShape', `classes[${i}]`, `唯一性违反 —— id 重复: ${c.id}`)
  classIds.add(c?.id)
}

// 形状 2 · RelationShape：subject/object ∈ classes[].id（sh:class 类比）+ cardinality 模式
for (const [i, r] of (doc.relations ?? []).entries()) {
  for (const k of ['subject', 'object']) {
    if (!r?.[k]) V('RelationShape', `relations[${i}].${k}`, 'sh:minCount 1 违反 —— 缺端点')
    else if (!classIds.has(r[k])) V('RelationShape', `relations[${i}].${k}`, `sh:class 违反 —— 未声明的类: ${r[k]}`)
  }
  if (r?.cardinality && !/^\d+\.\.(\d+|\*)$|^\d+$/.test(String(r.cardinality)))
    V('RelationShape', `relations[${i}].cardinality`, `sh:pattern 违反: ${r.cardinality}`)
}

// 形状 3 · AxiomShape：id 用 ONTO- 命名空间 + 必有 text（闭词表 / sh:pattern）
for (const [i, a] of (doc.axioms ?? []).entries()) {
  if (!/^ONTO-[A-Z0-9]+$/.test(String(a?.id ?? ''))) V('AxiomShape', `axioms[${i}].id`, `sh:pattern 违反: ${a?.id}`)
  if (!a?.text) V('AxiomShape', `axioms[${i}]`, 'sh:minCount 1 违反 —— 缺 text')
}

// 形状 4 · GateShape：human_gates[].blocks_hats ⊆ 已声明帽（sh:class 类比）
const hatIds = new Set([...(doc.starter_hats ?? []), ...(doc.extended_hats ?? [])].map((h) => h?.hat_id))
for (const [i, g] of (doc.human_gates ?? []).entries()) {
  for (const [j, h] of (g?.blocks_hats ?? []).entries())
    if (!hatIds.has(h)) V('GateShape', `human_gates[${i}].blocks_hats[${j}]`, `sh:class 违反 —— 未声明的帽: ${h}`)
}

console.log(`形状数: 4 · 校验对象: ${path.basename(ONTO)}`)
console.log(
  `实体: classes=${doc.classes?.length ?? 0} relations=${doc.relations?.length ?? 0} ` +
    `axioms=${doc.axioms?.length ?? 0} gates=${doc.human_gates?.length ?? 0}`,
)
console.log(`conforms: ${violations.length === 0}`)
for (const v of violations) console.log(`  [VIOLATION] ${v.shape} @ ${v.where} :: ${v.msg}`)

// 对照组：OWA 语义下同一事实为何不构成错误
console.log('\n--- 对照组：OWA 语义下同一问题 ---')
const undeclared = [
  ...new Set((doc.relations ?? []).flatMap((r) => [r?.subject, r?.object]).filter((x) => x && !classIds.has(x))),
]
console.log(`未声明的类引用: ${undeclared.length ? undeclared.join(', ') : '(无)'}`)
console.log('OWL/OWA 判定: 不报错 —— 未声明的类只是「未知」，不是「不存在」，且被当作新类名继续参与推理。')
console.log('⇒ 门禁所需的「引用完整性」在 OWL 里表达不出来；须 CWA 校验（本例 40 行 · 零新依赖）。')

process.exitCode = violations.length === 0 ? 0 : 2 // 与 failClosed exit 2 口径一致
