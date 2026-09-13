# 评估 · 同文件钉面模式重叠 unfixable 误报候选债（2.3-W1 范围⑤ · 机制债 [D]）

> **日期**：2026-09-12 · **task**：`2-3-wiring-w1-pins-hardening`（SPEC 01 §5.5）  
> **结论**：**不修**（登记候选债 · 触发条件当前不存在 · 误报方向 failClosed 无静默错误）

## 评估问题

同文件多钉面 extract 模式重叠（regex-all 覆盖面包含 regex 单点面）时，2.2.1 按文件聚合写盘后是否出现「actual 已正确却被判 unfixable / mismatch」的误报路径。

## 代码路径分析（src/cli-pins.ts）

1. `cmdPinsFix`：偏差判定一次性基于**盘上前态**（`evaluatePin` 全量）；随后同文件钉面基于**累计内容**依序 `planFix`（2.2.1 P1 修复点），写盘只写最终内容一次。
2. 误报路径成立条件：pin A（regex-all）的替换面**完全覆盖** pin B（regex 单点）的 capture span。此时 B 的 `planFix` 在累计内容上重跑模式，capture group 已 === 真值 → `newContent === oldContent` → `planFix` 返回 null → B 落入 `unfixable` → `cmdPinsFix` exit 2「不可修（须人工）」——**但文件内容实际已正确**，复跑 `pins check` 全绿。
3. mismatch 持久误报路径**不存在**：fix 写盘后 check 重读盘求值，actual 正确即 ok；误报仅发生在「fix 当次的退出码与 unfixable 分类」上。

## 现状核对（2026-09-12 实测）

- 现存唯一同文件钉面对 pin-11（regex-all `spec-wave@X`）/ pin-12（regex `落点矩阵与 CLI（X）`）：两模式面**不相交**（标题行无 `spec-wave@` 出现处），B11 测试钉死一次收敛（破坏双钉面 → 单次 fix --yes → 全写回 → check 转绿）。
- 2.3-W1 新增 pin-13/14/15 均为异文件落点，不引入新同文件对。
- 触发条件（regex-all 覆盖面完全包含同文件 regex 单点 capture span）在现行 15 钉面中**不存在**。

## 修 / 不修判定

**不修**，理由：

1. **零触发**：现行钉面无模式重叠，误报路径不可达；为不可达路径加语义分支违反定点修复纪律（SPEC 01 §4 非范围首条：不动引擎架构）。
2. **误报方向 failClosed**：即便未来触发，后果是 fix exit 2 摩擦（可复跑/人工核对消解），不是静默错误；check 语义（正确性真值）不受损。
3. **修复代价与收益不匹配**：修复须引入「已被聚合修复覆盖」第三分类（planFix null 时区分「真不可修」vs「累计内容已收敛」），约 20–30 LoC + 新输出面文案 + 专项测试；收益仅消除一个当前不可达路径的 exit 2 摩擦。
4. **监控缓解已就位**：C组数据形态测试钉住钉面清单（15 行 deepEqual），未来新增同文件钉面必经 task 审查 —— 审查清单加一条「同文件钉面模式面是否重叠」即可在引入时拦截（本评估文即依据）。

## 若未来要修（代价估算备查）

在 `cmdPinsFix` 聚合循环中，`planFix` 返回 null 且 pin 为 regex/regex-all 时，对累计内容重跑 `evaluatePin` 等价判定：若 capture 已全等于真值 → 分类 `covered`（输出「已被同文件聚合修复覆盖」· 不计 unfixable · 不抬 exit 2）；否则保持 unfixable。估 20–30 LoC + 2 测试（覆盖/未覆盖两向）。

## 关联

- SPEC：`docs/spec/2_3-wiring-completion/01_w1_pins_hardening_v1.md` §5.5 / 范围⑤（「实现非必须」· F-W1-07：评估文落盘即关账）
- 2.2.1 P1 修复：`src/cli-pins.ts` planFix 按文件聚合（task `2-2-1-patch`）
- 钉死测试：`test/pins-consistency.test.ts` B11（同文件双钉面一次收敛）/ C组（钉面清单 15 行）
