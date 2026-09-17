// 3.0 W3 · S4.1 · A4 ontology-check 接线：SHACL 语义子集校验器（CWA · 零新依赖：仅既有 js-yaml 经 src/yaml.ts · 硬约束 13）。
//
// 形状种子 = scripts/onto-probe.mts 四形状（ClassShape/RelationShape/AxiomShape/GateShape）转正
//   + VersionShape（product_semver ↔ package.json#version · 恒 Warning）。
// VersionShape 单源划界（F-W3-11 · 研究文 §8.4）：pin-03（assets/release-pins.yaml · required+fixable）
//   是版本钉的唯一强制真值源；本形状仅为报告内 Warning 级观察项 —— 不咬 exit、不修复、message 注 see pin-03。
// 一致性承诺边界（F-W3-06 · 硬约束 13）：仅声称「SHACL 语义子集」的忠实实现 + 显式 profile 声明
//   （ONTOLOGY_CHECK_PROFILE）；不声称任何标准合规。

import { readFileSync } from 'node:fs'
import path from 'node:path'
import { packageRoot } from './cli-shared.ts'
import { hatIdMatchesSegment, type HgmSnapshot } from './cli-graph-hgm.ts'
import { yamlLoad } from './yaml.ts'

export const ONTOLOGY_CHECK_PROFILE = 'spec-wave-shacl-subset/v1'
export const ONTOLOGY_SHAPES = [
  'ClassShape',
  'RelationShape',
  'AxiomShape',
  'GateShape',
  'VersionShape',
] as const

export type OntologySeverity = 'Violation' | 'Warning' | 'Info'

export type OntologyViolation = {
  shape: string
  where: string
  message: string
  severity: OntologySeverity
}

export type OntologyReport = {
  command: 'graph ontology check'
  ontology: string
  profile: string
  shapes: string[]
  entities: { classes: number; relations: number; axioms: number; gates: number }
  conforms: boolean
  violations: OntologyViolation[]
}

/** fail-closed 出口（F-W3-01）：ontology 不可读 / YAML 解析失败 / 顶层非 mapping → exit 2 */
export class OntologyCheckError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'OntologyCheckError'
  }
}

const CARDINALITY_RE = /^\d+\.\.(\d+|\*)$|^\d+$/
const AXIOM_ID_RE = /^ONTO-[A-Z0-9]+$/

type YamlMap = Record<string, unknown>

function asArray(v: unknown): unknown[] {
  return Array.isArray(v) ? v : []
}

/** 五形状校验（CWA · 缺失即红）。pkgVersion 缺省时读本包 package.json（VersionShape 对照源）。 */
export function checkOntologyDocument(doc: YamlMap, pkgVersion: string): OntologyViolation[] {
  const violations: OntologyViolation[] = []
  const V = (
    shape: string,
    where: string,
    message: string,
    severity: OntologySeverity = 'Violation',
  ) => violations.push({ shape, where, message, severity })

  // 形状 1 · ClassShape：classes[].id 存在（minCount）且唯一
  const classIds = new Set<string>()
  for (const [i, c] of asArray(doc.classes).entries()) {
    const id = (c as YamlMap | null)?.id
    if (!id) V('ClassShape', `classes[${i}]`, 'sh:minCount 1 违反 —— 缺 id')
    if (typeof id === 'string' && classIds.has(id)) {
      V('ClassShape', `classes[${i}]`, `唯一性违反 —— id 重复: ${id}`)
    }
    if (typeof id === 'string') classIds.add(id)
  }

  // 形状 2 · RelationShape：subject/object ∈ classes[].id（sh:class 类比 · CWA 引用完整性）+ cardinality 模式
  for (const [i, r] of asArray(doc.relations).entries()) {
    const rel = (r ?? {}) as YamlMap
    for (const k of ['subject', 'object'] as const) {
      const endpoint = rel[k]
      if (!endpoint) V('RelationShape', `relations[${i}].${k}`, 'sh:minCount 1 违反 —— 缺端点')
      else if (!classIds.has(String(endpoint))) {
        V('RelationShape', `relations[${i}].${k}`, `sh:class 违反 —— 未声明的类: ${String(endpoint)}`)
      }
    }
    if (rel.cardinality && !CARDINALITY_RE.test(String(rel.cardinality))) {
      V('RelationShape', `relations[${i}].cardinality`, `sh:pattern 违反: ${String(rel.cardinality)}`)
    }
  }

  // 形状 3 · AxiomShape：id 用 ONTO- 命名空间（闭词表 / sh:pattern）+ 必有 text（minCount）
  for (const [i, a] of asArray(doc.axioms).entries()) {
    const ax = (a ?? {}) as YamlMap
    if (!AXIOM_ID_RE.test(String(ax.id ?? ''))) {
      V('AxiomShape', `axioms[${i}].id`, `sh:pattern 违反: ${String(ax.id)}`)
    }
    if (!ax.text) V('AxiomShape', `axioms[${i}]`, 'sh:minCount 1 违反 —— 缺 text')
  }

  // 形状 4 · GateShape：human_gates[].blocks_hats ⊆ 已声明帽（sh:class 类比）
  const hatIds = new Set<string>(
    [...asArray(doc.starter_hats), ...asArray(doc.extended_hats)]
      .map((h) => (h as YamlMap | null)?.hat_id)
      .filter((x): x is string => typeof x === 'string'),
  )
  for (const [i, g] of asArray(doc.human_gates).entries()) {
    const gate = (g ?? {}) as YamlMap
    for (const [j, h] of asArray(gate.blocks_hats).entries()) {
      if (!hatIds.has(String(h))) {
        V('GateShape', `human_gates[${i}].blocks_hats[${j}]`, `sh:class 违反 —— 未声明的帽: ${String(h)}`)
      }
    }
  }

  // 形状 5 · VersionShape（恒 Warning · 观察项不咬 exit · 单源划界 see pin-03）
  const semver = typeof doc.product_semver === 'string' ? doc.product_semver : null
  if (semver === null) {
    V('VersionShape', 'product_semver', '缺 product_semver（Warning 观察项 · 强制真值 see pin-03）', 'Warning')
  } else if (semver !== pkgVersion) {
    V(
      'VersionShape',
      'product_semver',
      `product_semver ${semver} 与 package.json version ${pkgVersion} 不一致（Warning 观察项 · 强制真值 see pin-03）`,
      'Warning',
    )
  }

  return violations
}

function readPkgVersion(): string {
  const pkg = JSON.parse(readFileSync(path.join(packageRoot(), 'package.json'), 'utf8')) as {
    version: string
  }
  return pkg.version
}

// ===== 3.0-W3 S4.5-2 · F1 受限统一：HGM 全量适配（实例校验 · TBox 内核单源）=====

/** HGM→TBox 边型映射（单点声明 · 两图校验共用 · HAS_GATE 对应 hasGate 补声明 · BLOCKS 对应 blocks） */
export const HGM_EDGE_TO_TBOX: Record<string, string> = { HAS_GATE: 'hasGate', BLOCKS: 'blocks' }

export const HGM_ONTOLOGY_SHAPES = ['HgmInstanceShape', 'HgmEdgeShape', 'HgmHatVocabShape'] as const

export type HgmOntologyReport = {
  command: 'graph ontology check --hgm'
  ontology: string
  target: string
  profile: string
  shapes: string[]
  entities: { nodes: number; edges: number }
  conforms: boolean
  violations: OntologyViolation[]
}

/**
 * HGM 快照 ⊆ TBox 实例校验（CWA）：
 *  · HgmInstanceShape（Violation）：node.kind ⊆ classes[].id；
 *  · HgmEdgeShape（Violation）：edge.type 经 HGM_EDGE_TO_TBOX 映射 ⊆ relations[].id（未映射边型即 Violation）；
 *  · HgmHatVocabShape（Warning · F-W3-09 不咬 exit）：BLOCKS 边 hat_id 与 TBox 帽词表对照 ——
 *    精确等值或前缀段归一（hatIdMatchesSegment · 与 D2 段边界判同口径单源复用）命中即放行；
 *    归一后仍未命中 → Warning 点名（词汇漂移观察 · 不得静默）。
 */
export function checkHgmAgainstTbox(snapshot: HgmSnapshot, ontologyDoc: YamlMap): OntologyViolation[] {
  const violations: OntologyViolation[] = []
  const V = (
    shape: string,
    where: string,
    message: string,
    severity: OntologySeverity = 'Violation',
  ) => violations.push({ shape, where, message, severity })
  const classIds = new Set(
    asArray(ontologyDoc.classes)
      .map((c) => (c as YamlMap | null)?.id)
      .filter((x): x is string => typeof x === 'string'),
  )
  const relIds = new Set(
    asArray(ontologyDoc.relations)
      .map((r) => (r as YamlMap | null)?.id)
      .filter((x): x is string => typeof x === 'string'),
  )
  const hatIds = new Set(
    [...asArray(ontologyDoc.starter_hats), ...asArray(ontologyDoc.extended_hats)]
      .map((h) => (h as YamlMap | null)?.hat_id)
      .filter((x): x is string => typeof x === 'string'),
  )
  for (const [id, node] of Object.entries(snapshot.nodes)) {
    const kind = String(node.kind ?? '')
    if (!classIds.has(kind)) {
      V('HgmInstanceShape', `nodes[${id}].kind`, `sh:class 违反 —— node.kind 未在 TBox 声明: ${kind}`)
    }
  }
  for (const [i, edge] of snapshot.edges.entries()) {
    const type = String(edge.type ?? '')
    const mapped = HGM_EDGE_TO_TBOX[type]
    if (!mapped) {
      V('HgmEdgeShape', `edges[${i}].type`, `边型未在 HGM→TBox 映射表登记: ${type}`)
    } else if (!relIds.has(mapped)) {
      V('HgmEdgeShape', `edges[${i}].type`, `sh:class 违反 —— 映射关系未在 TBox 声明: ${type}→${mapped}`)
    }
    if (type === 'BLOCKS') {
      const hatId = String(edge.hat_id ?? '')
      // 前缀段归一（与 D2 段边界判同口径 · hatIdMatchesSegment 单源复用）：首段等值即归一命中
      const seg = (h: string) => h.split('-')[0]!
      const hit = hatIds.has(hatId) || [...hatIds].some((v) => hatIdMatchesSegment(seg(hatId), seg(v)))
      if (!hit) {
        V(
          'HgmHatVocabShape',
          `edges[${i}].hat_id`,
          `hat_id 前缀段归一后仍未命中 TBox 帽词表: ${hatId}（词汇漂移观察 · F-W3-09 Warning 不咬 exit）`,
          'Warning',
        )
      }
    }
  }
  return violations
}

/** 读文件 → YAML 解析 → mapping 校验（fail-closed 单点 · checkOntologyFile 与 --hgm TBox 加载共用）。 */
export function loadOntologyDocument(file: string): YamlMap {
  let raw: string
  try {
    raw = readFileSync(file, 'utf8')
  } catch {
    throw new OntologyCheckError(`ontology 不可读或不存在: ${file}`)
  }
  let doc: unknown
  try {
    doc = yamlLoad(raw)
  } catch (err) {
    throw new OntologyCheckError(
      `ontology YAML 解析失败: ${file} :: ${err instanceof Error ? err.message.split('\n')[0] : String(err)}`,
    )
  }
  if (typeof doc !== 'object' || doc === null || Array.isArray(doc)) {
    throw new OntologyCheckError(`ontology 顶层须为 mapping: ${file}`)
  }
  return doc as YamlMap
}

/** 读文件 → YAML 解析 → 五形状校验 → 机读报告。失败一律 OntologyCheckError（exit 2 fail-closed）。 */
export function checkOntologyFile(file: string): OntologyReport {
  const map = loadOntologyDocument(file)
  const violations = checkOntologyDocument(map, readPkgVersion())
  return {
    command: 'graph ontology check',
    ontology: file,
    profile: ONTOLOGY_CHECK_PROFILE,
    shapes: [...ONTOLOGY_SHAPES],
    entities: {
      classes: asArray(map.classes).length,
      relations: asArray(map.relations).length,
      axioms: asArray(map.axioms).length,
      gates: asArray(map.human_gates).length,
    },
    conforms: violations.filter((v) => v.severity === 'Violation').length === 0,
    violations,
  }
}
