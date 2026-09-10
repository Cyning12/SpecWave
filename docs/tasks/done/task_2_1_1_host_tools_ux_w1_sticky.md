# Task：2.1.1 W1 · 粘性 host-tools + `--tools all`

> **状态**：`done` · **wave**：W1  
> **关联 SPEC**：[`docs/spec/2_1_1-host-tools-ux/`](../../spec/2_1_1-host-tools-ux/) · `01`  
> **PLAN**：[`docs/roadmap/PLAN_2_1_1_host_tools_ux_v1_zh.md`](../../roadmap/PLAN_2_1_1_host_tools_ux_v1_zh.md)  
> **依赖**：W0 签收（`HG-NEXT-211` · `HG-SPEC-SIGNOFF`）  
> **Open Folder**：`dsh-coding-kit/`

---

## Harness 元信息

| 字段 | 值 |
|------|-----|
| **task_slug** | `2_1_1-host-tools-ux-w1-sticky` |
| **test_strategy** | `required` |
| **test_strategy_note** | 先写可失败测：粘性读写 · apply/update 写粘性 · `--tools all`；再改 `src/cli-host.ts` |
| **freeze_id** | 粘性路径 `.coding-kit/host-tools.json`；**不**改 update 无参缺省（W2）；**不**改 init（W3）；跳过 30/40 |
| **required_invoke_hats** | `30,40` |
| **git_branch** | `main` |
| **graph_delta** | `none` |
| **wiki_delta** | `none` |
| **close_pr_policy** | `exempt` |
| **maintainer_release_hold** | `true` |

### 人工闸

| human_gate_id | status | blocks_hats | 说明 |
|---------------|--------|-------------|------|
| HG-NEXT-211 | **approved** | — | 2026-09-10 · 人签收 |
| HG-SPEC-SIGNOFF | **approved** | — | 2026-09-10 · 人签收 · UPDATE-DEFAULT=A |
| HG-TASK-DRAFT | **approved** | 22, 30 | 2026-09-10 · 00 代签（系列签收后拆单） |
| HG-AUDIT-R1 | **approved** | **30** | 2026-09-10 · 00 代签 · R1=`docs/harness/reviews/task_2_1_1_host_tools_ux_w1_sticky_audit_R1_20260910.md` |

---

## 目标

落地粘性文件与 `--tools all`：apply/update（成功写盘）后记住 `host_ids` + `profile`；`--tools all` = 适配表全部 host_id。

## 范围

- [x] Schema：`.coding-kit/host-tools.json`（`version`/`host_ids`/`profile`/`updated_at`/`kit_semver` 可选）  
- [x] `host apply --yes` / `host update --yes` 成功后写入/更新粘性  
- [x] dry-run **不**写粘性  
- [x] `--tools all` 解析为适配表全部 host_id  
- [x] 单测（temp dir）+ CHANGELOG Unreleased 一句（2.1.1 Planned 下 Added）  
- [x] **不**改「无 `--tools` 且无粘性」行为（仍 2.1.0 全表或保持现状至 W2）  

## 非范围

UPDATE-DEFAULT=A · init 询问 · host-adapt README 全文 · bump · publish

## 验收标准

- [x] 对齐 SPEC `03` §W1 勾选  
- [x] 相关 host 单测绿（含粘性 / `--tools all`）  
- [x] dry-run 不写 `.coding-kit/host-tools.json`  
- [x] CHANGELOG Unreleased 有 2.1.1 粘性/`all` 一句  

### 自检结论（执行者）

```text
hat: 30
node --test --experimental-strip-types test/host-adapt-sticky.test.ts test/host-adapt-apply.test.ts test/host-adapt-update.test.ts
→ exit 0（17 pass）
npm run typecheck → exit 0
```

### 实现备忘（30）

- `src/cli-host.ts`：`HostToolsSticky` + `load/parse/writeHostToolsSticky`；`resolveToolsList`（`all`）；apply/update `--yes` 成功后写粘性  
- `test/host-adapt-sticky.test.ts`：写粘性 / dry-run 不写 / `--tools all` / 损坏 exit 2  
- 未做：W2 update 缺省 A、W3 init、W4 README、bump/publish  

## failure_paths

| ID | 触发 | 行为 |
|----|------|------|
| W1-01 | 粘性 JSON 损坏 | exit 2 或明确提示重建（与 SPEC `00` 一致；实现择一并测） |
| W1-02 | dry-run 写出粘性 | 测 FAIL |
| W1-03 | HG-AUDIT-R1 pending 改码 | 拒开工 |
| W1-04 | 默认写出 30/40 | 拒 |

## 给执行帽必读

1. SPEC `00` · `01`  
2. `src/cli-host.ts` · `test/host-adapt-*.test.ts`  
3. 本 task 闸表  

## 修订

| 日期 | 摘要 |
|------|------|
| 2026-09-10 | 开单 · R1 代签可 30 |
| 2026-09-10 | 30：粘性 + `--tools all` · 测 17 绿 |
| 2026-09-10 | **CLOSE** · 00 归档 done · 交 W2 |
