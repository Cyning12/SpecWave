# 审查 · 20-task-audit R1 · 3-0-2-w2-pins-consumer

> **日期**：2026-09-23 · **hat**：20-task-audit  
> **task**：[`docs/tasks/done/task_3_0_2_w2_pins_consumer.md`](../../tasks/done/task_3_0_2_w2_pins_consumer.md)  
> **上游 PLAN**：[`docs/roadmap/PLAN_3_0_2_patch_v1_zh.md`](../../roadmap/PLAN_3_0_2_patch_v1_zh.md) W2 节（HG-NEXT-PLAN=approved）  
> **结论**：**PASS（内容零阻塞）· 流程闸 HG-TASK-DRAFT=approved（00 代签）· HG-AUDIT-R1 由 00 于本审查文落盘后代签**

---

## 核对项（内容）

| # | 核对 | 结果 |
|---|------|------|
| 1 | 范围对齐 PLAN W2（--consumer 旗标 / 回退链 / --truth / 声明源 / 默认钉面 / 复用求值修复 / 文案 / 测试）· 未扩至 release 波 | ✅ |
| 2 | 非范围含 release 模式冻结 · 不新增 extract/expected kind · 锁档/多包/F-1②/F-2 延 3.1 · STOP 上报条款 | ✅ |
| 3 | 验收 A1–A13 全机检（回退链四态 / --truth 三态 / 归一 WARN / 默认钉面闭环 / 零落点提示 / 声明源 / S2 拒写 / 零回归 / 信封 / 输出点名 / 文案 grep / 四门 / gate-check） | ✅ |
| 4 | failure_paths 十一条覆盖闸序、release 漂移、回退链顺序、静默归一、零落点假象、坏声明源回落、S2 写、信封契约、README 字面、顺手扩面、裹挟档 | ✅ |
| 5 | **行为变更类 checklist（K7）· 旧测 grep 影响面**：task 范围⑧末行已列明既有 pins 测试面（pins-consistency / w3-pins-io-failclosed / cli-json-no-abs-path）为零回归对照 · 并允许 pin 计数行机械同步（须注明设计内红） | ✅ |
| 6 | test_strategy=required · 红测先行（新档 pins-consumer.test.ts 先红后绿）· tmp 仓 fixture 样板指明 | ✅ |
| 7 | 行号实钉抽验：`cli-pins.ts:62-83` loadPins failClosed · `:85-106` readTruthVersion（`:104` 缺 version fail）· `:590-594` runPinsCheck · `:676-798` 命令层 · `usage.ts:87-88` | ✅（一致） |
| 8 | 关键取舍入 R2 且可证伪：声明源存在即替代 / 逐文件合成 pin 不扩 schema / ^~ 归一+WARN / --truth 限 --consumer | ✅ |
| 9 | 闸表 4 列 · id 单元格裸 id 无内嵌粗体 | ✅ |
| 10 | 思考轮控制表 R0–R5 回填闭合 · residual_risks 四条具体且均有测试/断言对应 | ✅（见下节） |

## 思考轮审查（阶段 C）

| 轮 | 裁定 |
|----|------|
| R0 证据 | 充分（F-3/F-4 file:line 钉齐 · ops-desk 四面场景可分面映射到验收） |
| R1 范围 | 充分（release 面冻结为硬边界 · 排除项完整） |
| R2 方案 | 充分（四大取舍定案且各自防住了对应风险：双层钉面打架 / schema 膨胀 / 存量 ^ 钉误伤 / 模式语义混淆） |
| R3 边界 | 充分（三大硬边界 + 「需改 release 即 STOP」证伪条件） |
| R4 可测 | 充分（A1–A13 无人工判读项） |
| R5 就绪 | 充分 |

**思考审查结论**：充分，无退回项。

## 流程闸

| 闸 | 状态 | 说明 |
|----|------|------|
| HG-NEXT-PLAN | approved | 2026-09-23 维护者签收 PLAN |
| HG-TASK-DRAFT | approved | 2026-09-23 00 代签 · task lint PASS（W3 占位符提醒为 draft 期合法） |
| HG-AUDIT-R1 | **approved**（本文落盘后 00 代签） | 授权真值：维护者 2026-09-23 本窗「授权00签收所有过程文档」 |

## 非阻塞观察（不拦 30）

- N1：env 文档面（ops-desk 四面之④）属消费仓自建口径，本波不钉——反馈原文亦未要求上游覆盖，记录备 3.1 评估「声明源默认模板」时参考。
- N2：合成 pin 在 workflows 内文件增删时 id 集合随之变化（`--json` 消费方需知悉）；task 已要求 id 稳定可复现（同仓两次运行一致），文件级增删属合理变化，建议 40 自证在 CHANGELOG 素材中注明。
- N3：`--truth` 与声明源 `package_name` 并存时，`--truth` 优先生效（跳过回退链）而 `package_name` 仍作用于默认钉面正则——task 范围②/③已分别覆盖，30 实现时注意二者正交不冲突。

## 签收 / 关闭

本审查 R1 为终轮：**PASS · blocking 0 · 签收**。30 开工前提已满足（task 表 HG-AUDIT-R1=approved 为真值）。注：30 派发须待 W1 波 close 完成后串行进行（同工作区 · 避免测试与 git 态互踩 · 00 编排责任）。
