# 05 · 思考轮（R0–R5）

> **状态**：`draft` · 隶属 `3_3-graph-ast-opt-in` · 10-spec 回填

---

## 思考轮控制

| 轮 | 主题 | 结论摘要 | early_stop |
|----|------|----------|------------|
| R0 | 读派发 + 反哺 P4/§11 + 3.2 先例 | 3.2 已交付 IB/indexes；AST 为另 Epic；采纳 P4 opt-in；禁整包/禁默认 verify/禁 indexes v2 | no |
| R1 | 范围 / 非范围 / 角色 | 范围=opt-in ast check（symbol+有界 call）+文档分责+3.3.0；非范围=callgraph/indexes v2/issue-sync/七域/改 3.2 缺省 | no |
| R2 | 方案对比 | 弃整包 Python、弃默认进 verify、弃仅文档；推荐独立 opt-in 命令 + peer 可跳过 | no |
| R3 | 边界 / 失败 / 依赖 | 无 IB 零打扰；无 peer skip/usage；跨 path 不红；依赖 3.2 IB 字段；S2 只读 | no |
| R4 | 验收 / 可测性 | test_strategy=required；正负向+跨 path inform；禁污染 dogfood；零回归 3.2 命令 | no |
| R5 | 签收就绪 | SPEC+PLAN 已落盘；双闸 pending；交 20-spec-audit 或维护者直签 → 00 拆 W1 | no |

**residual_risks（残余风险）**：

1. **peer 策略分叉**：skip=0 vs usage=1 影响非 TS CI → W1 必须测锁并写进手册，避免实现波摇摆。  
2. **有界 call 被误读为 callgraph**：文案与验收专条锁定；跨 path 不红须有 fixture。  
3. **与 ib check 职责重叠**：path 缺失时谁红 → W1/W2 钉一种，避免双命令互相踢皮球。  
4. **消费仓 defer/七域方言**：产品侧若偷运 defer 目录会变政策引擎 → 本版默认不做 defer 或极小配置化。  
5. **indexes v2 压力**：§11 差距真实存在，但并入本 epic 会爆范围 → 已钉非范围，须人另开 epic。  

---

## R0 · 业务目标

00 S0 派发：为 `3_3-graph-ast-opt-in`（拟 `spec-wave@3.3.0`）起草可签收 SPEC+PLAN（draft）。基线 3.2.0；反哺 P4 为动机；政策继承 3.2「另 Epic / 禁整包 / 不进 verify」。

## R1 · 范围与角色

| 角色 | 诉求 |
|------|------|
| TS 消费仓 | symbol/有界 call 可机检；可继续保留本地深方言 |
| 非 TS / 无 peer | 零强迫 |
| 无 IB 仓 | 零打扰 |
| kit 维护者 | minor 兼容；分闸清晰；不夸大 |

## R2 · 方案对比

| 方案 | 优点 | 缺点 | 结论 |
|------|------|------|------|
| A 整包 cp meta AST 工具 | 最快复用 | 七域/defer/双栈 | 弃 |
| B AST 默认进 verify | CI 一条龙 | 强迫非 TS；改 3.2 预期 | 弃 |
| C 只改文档 | 零码 | P4 缺口仍在 | 弃 |
| D opt-in `graph ast check` + 有界语义 + 文档 | 对准 P4、可测、可分档 | 须处理 peer | **推荐** |
| E 顺带 indexes v2 | 补 §11 差距 | 范围爆炸 | 本棒弃 |

## R3 · 边界

见 `00_policy` 与 `03` 失败路径。关键依赖：3.2 可选 `implementedBy`、既有 CLI/`printJson`/`resolveTarget`、可选 TS peer。

## R4 · 验收与测试策略

- `test_strategy=required`  
- 临时目录 fixture；锁 exit 与跨 path 不红  
- 回归：3.2 命令面测试全绿  

## R5 · 签收与下一棒

SPEC 夹与 PLAN 已齐 → **推荐 20-spec-audit**（或维护者直签）→ 人签双闸 → 00 按 `04` 拆 W1（未签前禁改 `src/`）。

---

## 下一棒可复制 Prompt

`````text
你是 20-spec-audit（或维护者本人审）。
必读：
1. docs/spec/3_3-graph-ast-opt-in/README.md 及读序全文
2. docs/roadmap/PLAN_3_3_graph_ast_opt_in_v1_zh.md
3. （背景只读）kimi-code-meta BACKPORT §5 P4 · §11；3.2 SPEC 00_policy 先例
核对：范围/非范围/验收/failure_paths/思考轮控制是否可签收；blocking 项列清单。
重点质疑：
- 无 TS peer / 非 TS / 无 IB 是否真零强迫、零打扰
- 有界 call 是否被写成完整 callgraph
- 是否误把 AST 塞进默认 verify 或改 3.2 缺省
- 是否偷运 indexes schema v2 / 七域 / issue-sync
结论落盘 docs/harness/reviews/spec_3_3_graph_ast_opt_in_audit_R1_<YYYYMMDD>.md
禁止：改 src/；改 kimi-code-meta；代签 HG-SPEC-SIGNOFF / HG-NEXT-PLAN（仅人）。
若 PASS 且人已签双闸：交 00 按 04_execution_waves 拆 W1 task。
`````

## 修订

| 日期 | 摘要 |
|------|------|
| 2026-10-11 | draft · 10-spec · R0–R5 回填 |
