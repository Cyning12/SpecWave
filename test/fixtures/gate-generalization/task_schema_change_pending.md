# Task：闸泛化 fixture · HG-SCHEMA-CHANGE pending（3.0 W1 验收 #5① 双锁之一）

> fixture：test/w1-gate-generalization.test.ts · 白名单外闸 pending 且 blocks_hats 含 30 → 拒 30 并点名（S2.6 声明式全闸扫描）。

### 人工闸

| human_gate_id | status | blocks_hats | 说明 |
|---------------|--------|-------------|------|
| HG-AUDIT-R1 | approved | 30 | fixture · 锚闸先行通道前提（缺行即拒恒先 · audit approved 后才轮到泛化扫描点名） |
| HG-SCHEMA-CHANGE | pending | 30 | fixture · 泛化目标行：白名单外闸 pending ∧ blocks 30 → may_start_30=false · reason='HG-SCHEMA-CHANGE pending' |
