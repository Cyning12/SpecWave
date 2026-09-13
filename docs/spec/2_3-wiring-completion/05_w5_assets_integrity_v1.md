# 05 · W5 · A2 资产完整性校验（assets integrity）

> **状态**：`signed`（HG-SPEC-SIGNOFF=approved · 2026-09-12 维护者会话授权 00 代签）· 隶属 `2_3-wiring-completion`  
> **test_strategy**：`required`（篡改负向 exit 2 + 修复收敛 + tarball 含 manifest）  
> **上游**：路线 §2.5 T-03（仅纸面 · 提示词供应链投毒不可检测）· §4 A2（价值 9 · 代价 3）· §5 2.3.0 · 事实卡 §11 禁称行 · PROMPT §3 W5 行

---

## 1. 背景

路线研究 T-03：**资产完整性校验缺失（仅纸面）**——本包分发的核心价值是 `assets/` 下的提示词/模板/适配表资产，但无 sha256 清单、无 `assets verify`，**提示词供应链投毒完全不可检测**（npm 包被篡改、镜像污染、本地资产被意外改写三种场景均无机制发现）。

事实卡 §11 现行列禁称：「`assets` sha256 完整性清单 + `assets verify` · 仅纸面，未实现 · 只能说『规划中』」——本波落地后方可解禁。

## 2. 目标

`assets/` 资产完整性可机检：构建期生成清单，运行时一键校验（failClosed exit 2），偏差一键修复（防持续报红），CI/发版门禁强制。

## 3. 范围

| # | 项 | 内容 |
|---|----|------|
| ① | `assets/sha256.manifest` | 构建期生成：`assets/` 下全部文件 → 相对路径 + sha256（确定性排序 · 格式随 task 定：json 或逐行 `<hash>  <path>`）；manifest 自身不入清单 |
| ② | `spec-wave assets verify` | 新子命令：逐文件比对 manifest → 一致 exit 0 · 任一偏差（篡改/缺失/新增未登记）**exit 2**（failClosed · 与 pins 同门禁语义）；`--json` 输出每文件 status |
| ③ | 修复命令配套 | `assets verify --fix` 或 `assets manifest rebuild`（形态 task 定）：重生成 manifest；默认 dry-run · `--yes` 才写（沿袭 pins fix 语义）；S2 不涉及（assets 非 S2）但沿用「真值源不反向改」原则——修复对象是 manifest 不是资产 |
| ④ | CI / 发版接线 | `prepublishOnly` 链尾 + CI test job（与 pins 同点位）；npm pack tarball 含 manifest（files 白名单 `assets` 已覆盖 · 验证即可） |

## 4. 非范围

| 项 | 理由 |
|----|------|
| 签名 / 密钥体系（Sigstore · GPG） | 本波只做 sha256 完整性；签名属 C5/供应链轨 |
| 外部遥测 / 在线比对 | 零云纪律 |
| `src/` `bin/` 代码完整性 | 对象是提示词资产（投毒主面）；代码面由 npm 包哈希与 tag 溯源覆盖 |
| manifest 覆盖消费者仓 `.coding-kit/` 落盘物 | 本波校验对象是**包内 assets**（分发源）；消费者侧校验归后续评估 |
| npm publish / provenance | 仅人 / W3⑤ 仅文档 |

## 5. 设计

### 5.1 manifest 生成口径

- 遍历 `assets/`（排除 manifest 自身 · 排除 `.bak` / 临时文件），相对路径（posix 化 `/`）排序后逐行 `<sha256>  <relpath>` 或 JSON 数组。
- 生成时机：**构建期**（`npm run build` 或 prepublish 链内生成脚本）；工作树内 manifest 须与 assets 同步——这正是门禁存在的意义（改了 assets 没重生成就红）。

### 5.2 verify 判定

- 读 manifest → 逐行 `sha256(file)` 比对：`ok` / `mismatch`（内容变）/ `missing`（登记但文件无）/ `extra`（文件有但未登记）。
- 任一非 ok → exit 2 · 输出指出路径与类别；`--json` 同口径。
- assets 目录本身缺失 → failClosed exit 2（不静默）。

### 5.3 修复

- 重生成 manifest（修复对象 = manifest，**永不反向改资产内容**——与 pins「真值源不反向改」同构：资产是真值，manifest 是声明）。
- 默认 dry-run（打印将更新的条目数）· `--yes` 写盘 · 幂等。

### 5.4 与 pins 的关系

- 独立子命令（`assets verify`），**不并入 pins**（pins 是版本/身份钉 · assets 是内容完整性；语义族不同）。门禁接线点位一致。
- 事实卡 §11 解禁口径：落地后该行移入「已解禁」表（发布时随事实卡 2.3.0 版更新 · 非本波文案动作）。

## 6. 方案对比（R2 摘要）

| 方案 | 结论 | 理由 |
|------|------|------|
| 独立 `assets verify` 子命令 | **采纳** | 语义族独立于 pins · 路线原文即此形态 |
| 并入 pins 作为新 extract kind | 弃选 | pins 是「版本对齐」语义；内容哈希集合不是版本钉，硬并入会污染数据模型 |
| manifest 逐行文本（`hash  path`） | **推荐** | 与 `sha256sum` 生态一致 · 人可读可复核 |
| manifest JSON | 备选 | 机读友好但人复核弱 |
| 修复 = 重生成 manifest | **采纳** | 资产为真值 · manifest 为声明（pins 同构） |
| 修复 = 从 npm 重新拉取资产 | 弃选 | 网络绑定 · 超出本波 |

## 7. 验收标准

1. **篡改负向**：改动 `assets/` 任一文件一字节 → `assets verify` exit 2 指出该文件 `mismatch`；贴命令与输出。
2. **missing / extra 两档**：删一个登记文件 → `missing` exit 2；新增未登记文件 → `extra` exit 2。
3. **修复收敛**：修复命令 dry-run 零写盘 · `--yes` 后 verify exit 0 · 二次执行幂等无 diff。
4. **门禁**：prepublishOnly 与 CI 点位实测（破坏后对应步骤红）。
5. **tarball**：`npm pack --dry-run` 含 `assets/sha256.manifest` 且无新泄漏。
6. 新增测试真失败自证；`npm run typecheck` 0 错 · `npm test` 全绿 · `pins check` PASS。

## 8. failure_paths

| ID | 触发 | 行为 |
|----|------|------|
| F-W5-01 | manifest 缺失 / 语法坏 | verify exit 2 · 报错指 manifest 本身（failClosed · F-A1-01 同构） |
| F-W5-02 | assets 目录缺失 | exit 2 · 不静默通过 |
| F-W5-03 | 构建期未重生成致工作树红 | 修复命令收敛（设计内场景 · 非缺陷）；文档写明「改 assets 后必跑修复」 |
| F-W5-04 | 跨平台路径分隔符差异 | manifest 内路径 posix 化；verify 比对前归一 |
| F-W5-05 | 大文件性能 | assets 全量哈希实测耗时入 task 报告（预期秒级 · 超阈值则评审） |
| F-W5-06 | `.bak` / 临时文件混入 | 生成与 verify 双侧排除清单一致（数据化） |

## 9. 思考轮控制（10-spec）

| 轮 | 结论 | early_stop |
|----|------|------------|
| R0 | 证据 = 路线 T-03（仅纸面）+ A2 评分 + 事实卡 §11 禁称行 | no |
| R1 | 范围 = manifest + verify + 修复 + 接线；非范围 = 签名 / 遥测 / 代码面 / 消费者侧 | no |
| R2 | §6 表：独立命令 **荐** / 并入 pins 弃 · 逐行文本 **荐** / JSON 备 · 重生成 **荐** / 拉取 弃 | no |
| R3 | 边界：manifest 自坏 failClosed · posix 路径 · 排除清单一致 · 性能摸底 | no |
| R4 | `test_strategy=required`：篡改/missing/extra 三档负向 + 修复幂等 + tarball | no |
| R5 | **已签收**（2026-09-12 · HG-SPEC-SIGNOFF=approved · 00 代签）· 下一棒：00 拆 W5 task | no |

**residual_risks**：manifest 与 assets 的同步纪律本质上是「又一个要记的关联面」——靠门禁本身强制（改了不修就红），与 pins 同哲学；npm 生命周期（prepublishOnly vs prepare）内生成时机的细节随 task 定稿。

## 10. 人工闸

| human_gate_id | status | blocks |
|---------------|--------|--------|
| **HG-SPEC-SIGNOFF** | **approved**（2026-09-12 维护者会话授权 00 代签 · 与 2.2.0/2.2.1 同模式） | ~~本 SPEC 定稿~~ |
| HG-AUDIT-R1（W5 task） | pending | W5 30 改码前（task 阶段 00 代签） |

## 11. 修订

| 日期 | 摘要 |
|------|------|
| 2026-09-12 | draft · 10-spec · T-03 纸面债落地为 manifest+verify+修复+门禁 |
| 2026-09-12 | signed · HG-SPEC-SIGNOFF approved（00 代签） |
