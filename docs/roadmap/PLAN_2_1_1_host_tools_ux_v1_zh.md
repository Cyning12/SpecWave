# 规划 · 2.1.1 · host tools 安装/更新 UX（对齐 OpenSpec init）

> **状态**：`signed` · **CLOSED**（W0–W4 DONE · **HG-PUBLISH=approved** · `2.1.1` **published** · 2026-09-10）  
> **目标发版**：`dsh-coding-kit@2.1.1`（**patch** · UX / 入口）  
> **基线**：`2.1.0` **published**（技能+编排 parity）  
> **系列 SPEC**：[`docs/spec/2_1_1-host-tools-ux/`](../spec/2_1_1-host-tools-ux/)（`signed` · IMPLEMENTED）  
> **对标**：[OpenSpec `init --tools`](https://github.com/Fission-AI/OpenSpec)（交互选平台 · `all`/`none`/列表 · `update` 刷已选）  
> **Open Folder**：`dsh-coding-kit/`  
> **npm**：`latest=2.1.1`（人 publish · tag `v2.1.1`）

---

## 一句话

补齐「装完就能用、升级后好刷新」：**init 默认询问 IDE/宿主选型（对齐 OpenSpec）**；**记住上次 tools**；**`host update` / `--tools all` 更省事**——升包后一键刷落点，不必每次手抄 `cursor,claude,dsh`。

---

## 动机（2.1.0 dogfood）

| 痛点 | 2.1.0 | 2.1.1 目标 |
|------|-------|-----------|
| 首次物化 | 必须手敲 `host apply --tools …` | **`init` 询问/非交互 `--tools`**，可顺带 host apply |
| 升到 2.2 改了 assets | 包内真值变了，仓内副本不变，须再 `host update` | **文档说清** + **粘性 tools** 使 `host update --yes` 只刷**已选**宿主 |
| 省略 `--tools` 的 update | = 适配表**全量**（含 agents，易误伤） | 有粘性则刷粘性列表；无粘性时行为 freeze（见 B-*） |
| OpenSpec | `openspec init` 选 tools · `update` 刷新 | **对齐 UX**，不抄 OpenSpec delta 主流程 |

---

## 版本切分

| 版本 | 定位 |
|------|------|
| **2.1.0** | Skills + Commands parity · **published** |
| **2.1.1** | **本规划**：tools 安装/更新 UX · init 选平台 |
| **2.1.x+ / 2.2** | workspaces · ontology-check · onboard（另闸） |

---

## 采纳冻结（维护者已选）

| ID | 决议 | 说明 |
|----|------|------|
| **B-INIT-TOOLS** | **采纳** | `init` 增加宿主选型：TTY **默认询问**；CI/非交互须 `--tools LIST\|all\|none`（对齐 OpenSpec） |
| **B-STICKY** | **采纳** | apply/update/init 成功后写入 `.coding-kit/host-tools.json`（host_ids + profile + as_of 包版本可选）；**local 不覆写**纪律外文件 |
| **B-UPDATE-DEFAULT** | **采纳 = A** | `host update` 无 `--tools`：有粘性 → 用粘性；**无粘性 → exit 1** + 提示先 apply/init 或显式 `--tools` / `--tools all`（**BREAKING 小** vs 2.1.0「无参=全表」· CHANGELOG 必写） |
| **B-TOOLS-ALL** | **采纳** | `--tools all` = 适配表全部 host_id；`--tools none` 仅 init 跳过物化 |
| **B-INIT-SCOPE** | **采纳** | `init --preset harness-only` **可**附带 host apply（选了 tools 且非 none）；过程根与 host 落点一次完成可选 |
| **B-HOST-ADAPT-README** | **采纳** | **W4 强制**：实现与行为测通过后，对 [`assets/ide/host-adapt/README.md`](../../assets/ide/host-adapt/README.md) 做 **完整更新**（CLI / 粘性 / 子案 A / init / dogfood），禁止只改脚注一行 |
| **B-DELTA** | **拒绝** | 仍不做 OpenSpec change/delta 主流程 |
| **B-POSTINSTALL** | **拒绝（本版）** | npm `postinstall` 静默写盘（安全/可重复性差） |

### B-UPDATE-DEFAULT = **A**（已冻结 · 2026-09-10）

| 子案 | 行为 | 状态 |
|------|------|------|
| **A** | 无粘性 + 无 `--tools` → **exit 1** + 提示 | **已接受** |
| B | 无粘性时仍全表 | 未选 |
| C | 无粘性时全表 + WARN | 未选 |

---

## Waves（草案）

| Wave | 覆盖 | 人闸 | 状态 |
|------|------|------|------|
| **W0** | 本规划 + SPEC 签收 · **UPDATE-DEFAULT=A 已冻** · 拆 task | **`HG-NEXT-211`** · **`HG-SPEC-SIGNOFF`** | **DONE** |
| **W1** | 粘性文件 schema + apply/update 读写 · `--tools all` | `HG-AUDIT-R1` | **DONE** |
| **W2** | `host update` 子案 **A** + 测 + CHANGELOG 破坏说明 | `HG-AUDIT-R1` | **DONE** |
| **W3** | `init`：TTY 询问 · `--tools`/`--profile` · 可选联动 apply | `HG-AUDIT-R1` | **DONE** |
| **W4** | **完整更新** `assets/ide/host-adapt/README.md` + 仓根 README/Demo · bump **2.1.1** | **`HG-PUBLISH`**（仅人） | **DONE（git/tag · publish pending）** |

---

## 明确非范围（2.1.1）

- OpenSpec / spec-kit 前缀或主流程  
- 默认分发 30/40 · Agent publish  
- npm postinstall 静默物化  
- 云 Policy / 自研 IDE  

---

## 人工闸

| human_gate_id | status | blocks |
|---------------|--------|--------|
| **HG-NEXT-211** | **approved** | 开 2.1.1 实现 · 2026-09-10 |
| **HG-SPEC-SIGNOFF** | **approved** | SPEC 定稿 · UPDATE-DEFAULT=A · 2026-09-10 |
| **HG-AUDIT-R1** | **approved**（W1–W4） | 各波已代签 |
| **HG-PUBLISH** | **approved** | `2.1.1` · 2026-09-10 人 · `npm view`=`2.1.1` |

---

## 验收一句话

```bash
# 非交互（对齐 OpenSpec）
npx dsh-coding-kit@2.1.1 init --preset harness-only --tools cursor,claude,dsh --yes

# 升级包后
npx dsh-coding-kit@2.1.1 host update --yes   # 使用粘性 tools，不必再抄 LIST
```

TTY 下 `init` 无 `--tools` 时出现平台多选（cursor / claude / dsh / agents / all / none）。

---

## 读序

1. 本文件  
2. [`../spec/2_1_1-host-tools-ux/README.md`](../spec/2_1_1-host-tools-ux/README.md)  
3. Task：`docs/tasks/active/task_2_1_1_host_tools_ux_w0_planning.md`

---

## 修订记录

| 日期 | 摘要 |
|------|------|
| 2026-09-10 | 立项：维护者要求 2.1.1 优化 tools 安装/更新 + init 询问 IDE（**对齐** OpenSpec） |
| 2026-09-10 | 维护者 **接受方案 A**；W4 **强制完整更新** `assets/ide/host-adapt/README.md` |
| 2026-09-10 | **签收** HG-NEXT-211 / HG-SPEC-SIGNOFF · W0 CLOSE · 拆 W1–W4 · 派 W1 三十 |
| 2026-09-10 | W0–W4 **IMPLEMENTED** · 验收档立 · **HG-PUBLISH** 待人 |
| 2026-09-10 | **HG-PUBLISH=approved** · registry `2.1.1` · 根 README 补全 2.1.1 UX |
