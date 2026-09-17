import assert from 'node:assert/strict'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import path from 'node:path'
import { describe, it } from 'node:test'
import { fileURLToPath } from 'node:url'

const KIT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

// 3.0 W3 · S4.6 ONTO-OPEN 不开放登记 + 验收 #5/#12 文案机检（正负 grep · 词表+路径豁免清单）。
// 豁免清单（裁决/登记/历史叙述语境 · task S4.6 口径）：docs/harness/reviews · docs/harness/invokes ·
// docs/tasks · docs/spec（含 self-tech-graph/reference 历史版本快照）· docs/roadmap · delivery（历史交付物）。
// 扫描面 = 对外现行文案：README 双入口 · docs/ontology · docs/coding_wiki · GLOSSARY/MIGRATION · src · assets。

const EXEMPT_PREFIXES = [
  'docs/harness/reviews/',
  'docs/harness/invokes/',
  'docs/tasks/',
  'docs/spec/',
  'docs/roadmap/',
  'delivery/',
  '.workbuddy/', // 本地起草工作区（gitignored · 非对外发布面 · 研究文雏形来源）
  'test/onto-open-docs.test.ts', // 本机检词表定义文件（自引用豁免）
]

function* walk(dir: string): Generator<string> {
  for (const ent of readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, ent.name)
    if (ent.isDirectory()) {
      if (['node_modules', '.git', 'lib'].includes(ent.name)) continue
      yield* walk(abs)
    } else if (/\.(md|ya?ml|ts)$/.test(ent.name)) {
      yield abs
    }
  }
}

function scanFiles(): { rel: string; body: string }[] {
  const out: { rel: string; body: string }[] = []
  for (const abs of walk(KIT)) {
    const rel = path.relative(KIT, abs).split(path.sep).join('/')
    if (EXEMPT_PREFIXES.some((p) => rel.startsWith(p))) continue
    out.push({ rel, body: readFileSync(abs, 'utf8') })
  }
  return out
}

// 暗示词负向词表（task S4.6）：「自定义本体」须处否定语境（不提供/不得/不开放/不暗示）才算登记句而非暗示
const HINT_RES: { re: RegExp; negateGuard?: RegExp }[] = [
  { re: /可扩展本体/ },
  { re: /extensible ontology/i },
  { re: /custom ontology/i },
  { re: /自定义本体/, negateGuard: /不提供|不得|不开放|非开放|勿暗示/ },
  { re: /自定义 schema/i, negateGuard: /不提供|不得|不开放|勿暗示/ },
]

describe('3.0-W3 S4.6 · ONTO-OPEN 登记 + 验收 #5/#12 文案机检', { concurrency: 1 }, () => {
  it('正向（验收 #5）：README 双入口含「不提供自定义本体能力」登记句 + 图能力开放分述 + 复议触发指向', () => {
    for (const f of ['README.md', 'README.zh-CN.md']) {
      const body = readFileSync(path.join(KIT, f), 'utf8')
      assert.match(body, /不提供自定义本体能力/, `${f} 缺 ONTO-OPEN 登记句`)
      assert.match(body, /graph yaml compile\|check\|export/, `${f} 缺图能力开放句`)
      assert.match(body, /ONTO-OPEN/, `${f} 缺裁决指向`)
      assert.match(body, /HG-SCHEMA-CHANGE/, `${f} 缺复议闸指向`)
      // 图能力 vs 本体层分开陈述（同段两述）
      assert.match(body, /校验器开放 ≠ 本体内容开放|validator open ≠ ontology content open/, `${f} 缺分述句`)
    }
  })

  it('正向：ontology.yaml 头注释登记行在案（自用元模型定位 + 不开放 + 复议触发指向研究文）', () => {
    const body = readFileSync(path.join(KIT, 'assets', 'ontology.yaml'), 'utf8')
    assert.match(body, /自用元模型/)
    assert.match(body, /不提供自定义本体能力/)
    assert.match(body, /ONTO-OPEN 裁决/)
    assert.match(body, /w3_ontology_graph_research_20260917/)
  })

  it('负向（验收 #5）：扫描面零本体开放暗示（词表 + 否定语境守卫 + 路径豁免清单）', () => {
    const violations: string[] = []
    for (const { rel, body } of scanFiles()) {
      for (const [i, line] of body.split('\n').entries()) {
        for (const { re, negateGuard } of HINT_RES) {
          if (!re.test(line)) continue
          if (negateGuard && negateGuard.test(line)) continue // 否定语境 = 登记句非暗示
          violations.push(`${rel}#${i + 1}: ${line.trim().slice(0, 80)}`)
        }
      }
    }
    assert.deepEqual(violations, [], `本体开放暗示词命中（非否定语境）:\n${violations.join('\n')}`)
  })

  it('负向（验收 #12）：扫描面零 W3C 一致性声称（W3C 命中仅限豁免清单的否决/边界叙述）', () => {
    const hits: string[] = []
    for (const { rel, body } of scanFiles()) {
      for (const [i, line] of body.split('\n').entries()) {
        if (/W3C/.test(line)) hits.push(`${rel}#${i + 1}: ${line.trim().slice(0, 80)}`)
      }
    }
    assert.deepEqual(hits, [], `扫描面 W3C 命中（应仅在豁免清单内）:\n${hits.join('\n')}`)
    // 反向钉：src 校验器 profile 声明面在案（不声称标准合规）
    const onto = readFileSync(path.join(KIT, 'src', 'cli-graph-ontology.ts'), 'utf8')
    assert.match(onto, /spec-wave-shacl-subset\/v1/)
    assert.equal(onto.includes('W3C'), false)
  })

  it('负向（验收 #12 · S4.4-C2）：无「axioms check 保护 S2」叙事（D3/S2 移除后文案零残留旧判据叙事）', () => {
    const RES = [/axioms check[^\n]{0,50}保护/, /axioms check[^\n]{0,30}S2/, /S2 保护[^\n]{0,30}axioms/]
    const NEGATE = /不得|禁止|勿|无「|不再/ // 禁止性登记/否定语境非叙事声称（如 hgm 码注释的禁止登记行）
    const hits: string[] = []
    for (const { rel, body } of scanFiles()) {
      for (const [i, line] of body.split('\n').entries()) {
        if (NEGATE.test(line)) continue
        if (RES.some((re) => re.test(line))) hits.push(`${rel}#${i + 1}: ${line.trim().slice(0, 80)}`)
      }
    }
    assert.deepEqual(hits, [], `axioms-S2 叙事残留:\n${hits.join('\n')}`)
  })

  it('docs/ontology 陈旧自述清退（阶段一偏差①清偿）：零「未接线」残留 · 现行命令面在案', () => {
    for (const f of ['docs/ontology/CURRENT_CAPABILITY.md', 'docs/ontology/DISCIPLINE_ALIGNMENT.md']) {
      const body = readFileSync(path.join(KIT, f), 'utf8')
      assert.equal(body.includes('未接线'), false, `${f} 残留未接线陈旧自述`)
    }
    const cap = readFileSync(path.join(KIT, 'docs/ontology', 'CURRENT_CAPABILITY.md'), 'utf8')
    assert.match(cap, /graph ontology check/)
    assert.match(cap, /F5=B|第二钉点/, 'ontology-shallow 钉锚保留')
    assert.match(cap, /ontology\.yaml/, 'ontology-shallow 钉锚保留')
  })
})
