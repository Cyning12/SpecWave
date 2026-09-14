# 03 · W3 · 输出层统一相对化（output relativization unified exit）

> **状态**：`signed`（HG-SPEC-SIGNOFF=approved · 2026-09-14 维护者本窗授权 00 代签）· 隶属 `2_4-gate-strength`  
> **test_strategy**：`required`（机械断言全命令面 + V2 泄漏清单逐项转相对）  
> **上游**：PLAN_2_4 W3 · 验收报告 §6「建议 2.4」N12 · 证据 §3.M（V2 实测四处泄漏清单）

---

## 1. 背景

C3「绝对路径零泄漏」在 2.2-W2 起接线、2.3-W3 补了 `target` 字段与错误文案（D-23-JSON-TARGET-REL）。V2 实测**仍在泄漏**（§3.M · 「修了主字段，漏了旁字段」）：

| 命令 | 泄漏字段 | 本棒复核现值 |
|------|----------|--------------|
| `task lint --json` | `file`（绝对） | `src/cli.ts:1017-1037`（`lintTaskFile` 结果 :1025 JSON 直出 · `result.file` 未相对化） |
| `task close --json` | `dest` · `done_snapshot.path`（绝对） | `src/cli.ts:1148-1164`（dest 解析 :1106-1114 为绝对 · JSON 直出） |
| `verify --task` / `gate-check --json` | `task`（用户传绝对路径时泄漏） | `src/cli.ts:571` / `:899`（`task: taskFile` 原值入 JSON） |
| `task close`（人类输出） | `moved:` · `dest:` · `done_snapshot·path`（绝对） | `src/cli.ts:1136` / `:1167` / `:1171` |
| `status --json`（干净对照） | `task_path` 已相对化 | `src/cli-status.ts:111`（toRel 先例） |

根因：相对化是**逐字段打补丁**，没有统一出口——新字段/新命令天然漏网。

## 2. 目标

相对化收敛为**输出层统一出口**：所有 CLI 输出（`--json` 信封与人类输出）经统一 toRel 处理；补「任何 `--json` 输出不得含绝对路径」**机械断言**兜底全命令面。

## 3. 范围

| # | 项 | 形态 | 出处 |
|---|----|------|------|
| ① | 输出层统一出口：JSON 序列化出口与人类输出行打印统一过 toRel（识别仓内绝对路径 → 相对化；仓外/非路径串不动） | `src/cli-shared.ts` toRel 既有实现复用 + `src/cli.ts` 各命令出口收敛 | §3.M · D-24-OUTPUT-REL-EXIT |
| ② | V2 清单四处泄漏逐项修复（上表四行） | 随 ① 出口收敛覆盖 · 逐项实测留证 | §3.M |
| ③ | 机械断言：「任何 `--json` 输出不得含绝对路径」（测试套件级 · 遍历主要命令 `--json` 面 · 含传绝对路径入参与 /tmp 靶场） | `test/` 新增断言组 | §3.M 建议原文 |

## 4. 非范围

| 项 | 理由 |
|----|------|
| exit code 语义变更 | 不动（0/1/2 口径保持） |
| `--json` 信封键集变更 | 契约「只增不改」（2.2.0 既定）· 本波只改值 |
| 错误文案内容改写 | 只相对化 · 文案措辞不动（RELEASING 等敏感面见 00 §5） |
| 日志/审计落盘（C6） | 3.0 |
| W1/W2/W4–W6 任何实现项 | 各自独立 task |

## 5. 设计

### 5.1 统一出口形态（task 定稿 · 候选）

- **方案 A（荐）**：JSON 出口包装——所有 `console.log(JSON.stringify(...))` 统一经 `printJson(obj, target)` 助手（内部深遍历字符串值 · 命中「仓内绝对路径前缀」即 toRel）；人类输出同理经 `printLine` 或对既有 `toRel(process.cwd(), x)` 调用点补齐。
- **方案 B（备）**：维持逐字段调用 toRel，仅补漏四处 + 机械断言兜底。弃选理由：即 N12 病根本身（补丁式收窄）。
- 仓外路径（如 `/tmp` 靶场内 target）口径：toRel 对仓外路径的行为沿用 `src/cli-shared.ts` 既有实现语义，机械断言以「输出不含 **仓根绝对前缀**」为判据（断言口径 task 定稿写清）。

### 5.2 机械断言

- 遍历命令面（verify / gate-check / audit / task lint / task close / status / pins / assets 等 `--json` 支持命令），传绝对路径入参 → 断言 stdout 可 `JSON.parse` 且不含仓根绝对路径形态串。
- `status --json#task_path` 既有相对化（`cli-status.ts:111`）为干净对照 · 不回退。

## 6. 方案对比（R2 摘要）

| 方案 | 结论 | 理由 |
|------|------|------|
| 统一出口（printJson/printLine 包装） | **采纳（D-24-OUTPUT-REL-EXIT）** | 新字段/新命令天然受保护 · 根治补丁式漏网 |
| 逐字段补漏 + 断言兜底 | 弃选 | N12 病根同型 · 下一处泄漏只是时间问题 |
| 值相对化（键集不动） | **采纳**（循 D-23-JSON-TARGET-REL 定性） | 安全泄漏修复 · CHANGELOG 明示 |

## 7. 验收标准（必须自证，不接受「我改完了」）

1. **V2 清单逐项转相对**：四条命令实测（含传绝对路径 `--task` / `--file`）→ 输出无仓内绝对路径 · 贴实际命令与输出。
2. **机械断言全绿**：新增断言组覆盖全部 `--json` 命令面 · 构造任一命令传绝对路径入参 → stdout grep 仓根绝对前缀为空；断言组本身负向自证（人为注入一处绝对路径输出 → 断言真红）。
3. **干净对照不回退**：`status --json#task_path` 相对口径保持；既有 `--json` 信封键集不变（diff 键名断言）。
4. **人类输出**：`task close` 的 `moved:`/`dest:`/`done_snapshot·path` 相对化 · CLOSE: PASS 冻结文案不变。
5. `npm run typecheck` 0 错 · `npm test` 全绿（含新增）· CHANGELOG 2.4.0 节明示值相对化（发版波落地 · 本波留接口说明）。

## 8. failure_paths

| ID | 触发 | 行为 |
|----|------|------|
| F-W3-01 | 命令绕过统一出口直接 print | 机械断言兜底打红（即验收 #2）· 返修出口覆盖 |
| F-W3-02 | 仓外 target（/tmp 靶场）toRel 行为 | 沿用 cli-shared 既有语义 · 断言判据只认仓根绝对前缀 |
| F-W3-03 | JSON 消费者依赖绝对路径值 | 值相对化属安全泄漏修复（2.3-W3 定性延续）· CHANGELOG 明示 |
| F-W3-04 | 深遍历误改非路径字符串（如恰好以前缀开头的文案） | 判据限「存在且位于仓内的路径」· 误改即返修判据 |
| F-W3-05 | close 人类输出冻结文案变动 | `CLOSE: PASS · <slug>` 冻结行不动 · 仅路径值相对化 |

## 9. 思考轮控制（10-spec）

| 轮 | 结论 | early_stop |
|----|------|------------|
| R0 | 证据 = §3.M 四行清单 + 本棒只读复核现值（cli.ts:1017-1037/:1106-1164/:571/:899 · cli-status.ts:111 对照） | no |
| R1 | 范围 = ①–③；非范围 = exit code / 键集 / 文案 / C6 | no |
| R2 | §6 表：统一出口 vs 逐字段补漏 | no |
| R3 | 边界：契约只增不改（键集）· 冻结文案 · 仓外路径口径 | no |
| R4 | `test_strategy=required`：机械断言（含自身负向自证）+ 逐项实测 | no |
| R5 | **已签收**（2026-09-14 · HG-SPEC-SIGNOFF=approved · 00 代签）· 下一棒：00 拆 W3 task → 20-task-audit → HG-AUDIT-R1 → 30/40 | no |

**residual_risks**：① 统一出口深遍历对大型 JSON 输出的性能（本仓输出体量小 · 评估可忽略）；② 断言命令面清单的完备性依赖人工枚举（缓解：清单入测试数据 · 新命令接入时评审）。

## 10. 人工闸

| human_gate_id | status | blocks |
|---------------|--------|--------|
| **HG-SPEC-SIGNOFF** | **approved**（2026-09-14 维护者本窗授权 00 代签） | ~~本 SPEC 定稿~~ · 冻结 D-24-OUTPUT-REL-EXIT |
| HG-AUDIT-R1（W3 task） | pending | W3 30 改码前（20 审查文落盘后 00 代签） |

## 11. 修订

| 日期 | 摘要 |
|------|------|
| 2026-09-14 | draft · 10-spec · V2 清单四处行号经本棒只读复核 |
| 2026-09-14 | signed · HG-SPEC-SIGNOFF approved（00 代签 · 2026-09-14 维护者授权） |
