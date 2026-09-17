# 审查文：task_3_0_w3_ontology_graph · R1（20-task-audit）

> **hat_id**：20-task-audit · **轮次**：R1 · **日期**：2026-09-17  
> **审查对象**：`docs/tasks/active/task_3_0_w3_ontology_graph.md`（3.0 W3 本体驱动图谱统一 · HG-TASK-DRAFT=approved（00 代签）· HG-AUDIT-R1=pending）  
> **对照真值**：SPEC `docs/spec/3_0-architecture-leap/04_w3_ontology_graph_unify_v1.md`（signed · 范围 ①–⑦ · 验收 1–9 · F-W3-01–07）· 研究真值 `docs/harness/reviews/w3_ontology_graph_research_20260917.md`（research-final · ONTO-OPEN=不开放 / F1=受限统一 双裁决已批准（2026-09-17 维护者）· §5 axioms 六构造+附录A · §6 三违规 · §8.4 SHACL 设计 · §9 F1 边界）· PLAN `PLAN_3_0_architecture_leap_v1_zh.md` W3 节（:237-257）+ 硬约束 3/13/14/15（:332,:342,:343,:344）· 格式先例 `task_3_0_w2_gates_in_hosts_audit_R1_20260916.md`  
> **审查性质**：书面审查 + 独立复核实测；**未改** task / SPEC / PLAN / src / test / fixtures / `assets/ontology.yaml` 实质内容；**不代签** HG-AUDIT-R1（归 00 代签）

---

## 一、结论摘要

| 维度 | 结论 |
|------|------|
| **内容**（可执行性 / 与 SPEC+研究文+PLAN 一致性） | **PASS-with-issues**：blocking **0** · advisory **4**（A1 闸裁决理由④类比强度注记 · A2 TBox classes 计数 `16±1` 应为 `17±1` 口径注记 · A3 tech-graph 第二硬拷贝面 `KIND_TO_CLASS` :412 须入单源断言口径 · A4 两 ontology 测试件未列既有面清单且 `/未接线/` 断言与 S4.1/S4.6 头注释硬耦合；均不阻塞签闸） |
| **流程闸** HG-AUDIT-R1 | **pending**（真值以 task `### 人工闸` 表为准）；本审查文落盘即满足「20 审查文落盘」前置，签署归 **00 代签**（维护者 2026-09-16 授权模式），**pending 期间 30 拒改码**（本审 `gate-check` + `verify` 双机检实测：HG-AUDIT-R1 pending → ❌ 拒 30 · VERIFY: BLOCKED · `task lint` PASS ✓） |
| 思考轮 R0–R5 | 控制表填全（六轮 early_stop 全 no · residual_risks 七条每条带缓解 · ③⑤ 明示「若 20 审认为另有所指/须改判须 R1 提出」—— 本审均不提出，见重点 2/3）· R5 待本轮裁定——**本轮裁定：充分** |

---

## 二、常规核对（对照 SPEC / 研究文 / PLAN / 硬约束逐项）

| 核对项 | 结论 | 证据 |
|--------|------|------|
| 范围 ①–⑦ 与 SPEC §3 | ✅ 逐项对应且规格化 | SPEC 范围①（研究文落盘）已销（SPEC 头部 ✅ 注记 + task 验收 #9 登记清偿）；②–⑦ 转写为 S4.1–S4.7 可实施规格（五形状+VersionShape 单源划界 / 三悬空类逐处处置表+对账硬步骤 / F2 三层解析 / 判据六项逐条定稿 / F1 受限统一四面 / ONTO-OPEN 登记双落点 / 零新依赖机检）；SPEC §3-③「真修（补齐声明）」、§3-⑥「不开放则零实施成本仅落口径」、§5.3 降级授权均被正确引用且未越权 |
| 非范围与 SPEC §4 | ✅ 全继承 + 合规增益 | SPEC 八条全在（OWL/RDF/SPARQL · 导出器 · 重写本体 · 臆造消费者内容 · 可视化 UI · S2 · _tech_graph 不随包 · 新运行时依赖 · W3C 声称）+ 本棒明示五条（tech 词汇不入 classes · axioms exit 不变 · D3/S2 接真不做 · 发布四动作仅人 · S2 只新增）——与研究文 §9.1/§7.3 批准边界同向，无扩权 |
| 验收标准与 SPEC §7 | ✅ 1–9 全覆盖 + 机械化加强 | #1↔1（双向 fixture ≥4+键集钉死）· #6↔2（HGM PASS+恒等 fixture+单源 grep）· #8↔3（六构造附录 A 机械复现+逐项二选一留痕）· #4↔4（deep-equal+来源正误 fixture）· #5↔5（正负 grep）· #2↔6（3→0 回归锁+三态留痕）· #7↔7（deps diff 空+lock 计数 2）· #9↔8（已清偿+波末复核）· #10↔9（typecheck+全绿+pins）；新增 #3/#11–#14（对账留痕 / 既有面零意外 / 文案红线 / task lint / 执行粒度）为加强项，命令+fixture+期望输出全落验收节 |
| failure_paths 与 SPEC §8 | ✅ F-W3-01–07 全继承 | 逐条对应且行为列更具体；新增 F-W3-08–14（对账阻塞 / HGM 词汇漂移 / tech 误标 / VersionShape 越权 / 浅登记破消费 / 裹挟 / 越权发布）逐条必要（08 是私仓不可达的硬阻塞通道 · 09–12 对应本棒四个新行为面） |
| 依赖 / 必读列表 | ✅ 充分（附 A4 补列项） | 研究文全文+SPEC+PLAN W3/硬约束+现码行号（本审抽核约 40 处全中 · 见下）+资产锚点+既有测试面+W0/W1/W2 先例+RELEASING/README 落点；**唯**既有测试面清单漏列两件直接断言 `assets/ontology.yaml` 的测试（见 A4） |
| 思考轮控制表 R0–R5 | ✅ 填全 | R0 含基线全量复跑+行号复核+两处新发现（hasGate 缺口 · 短帽 id 漂移——本审均实证在案，见重点 1/6）；R1–R3 闭合；R4 验收 14 条全机械+红测先行面明示+对账留痕机械化（唯一非机械点的正确处置）；R5 待本轮（裁定充分） |
| `### 人工闸` 表可机检性（硬约束 15/3） | ✅ | 闸表在 `### 人工闸` 节；本审实测 `npx spec-wave gate-check --task …` 渲染两行闸（HG-TASK-DRAFT approved / HG-AUDIT-R1 pending → ❌ 拒 30）· `npx spec-wave verify --target . --task …` 首输出闸扫描表 + `VERIFY: BLOCKED · HG-AUDIT-R1 pending` · `task lint` PASS；不设 HG-SCHEMA-CHANGE 行的裁决见重点 1 |
| test_strategy 与硬约束 6（修严配负向 fixture） | ✅ 适配正确 | 本波为校验接线波（声明→机检真值）：负 fixture 面全列（ontology-check ≥4 件红 · 六构造附录 A · F2 来源正误 · 恒等 fixture）+ 红测先行写进测试策略节 + 既有面恒等/回归锁三重兜住（恒等 fixture · 登记纪律 · pins 17/17） |
| 硬约束 13/14/15 落位 | ✅ | #13：零新依赖证明入验收 #7（本审实测 dependencies 仅 js-yaml · lock 非 dev 顶层=2）+ 不声称 W3C（F-W3-06 + 验收 #12 负向 grep）；#14：研究文+探针已 tracked（git ls-files 命中 · 探针复跑 conforms:false/exit 2 逐字一致）+ 对账问答留档义务；#15：闸落 task 表且机检咬住（上行实测） |
| 基线节数字独立复跑 | ✅ 全中 | 本审复跑（HEAD `fb280df` · 工作区仅本 task 文件 untracked 与声称一致）：`npm test` **726 tests / 140 suites / 725 pass / 0 fail / 1 skip**（duration 94.3s · 与基线 ≈94s 一致）· `npm run typecheck` **0 错** · `node bin/specgate.js pins check` **17/17 PASS** · 探针复跑 `conforms: false` / 3 处 VIOLATION（DisciplinePackage/BusinessRepository/TraceArtifact）/ **exit 2** 逐字一致 · dependencies = 仅 `js-yaml` · lock 非 dev 顶层 = **2**（argparse · js-yaml）· W2 done 锁终态（726/140/725/0/1）交叉一致 |
| 现码行号抽核（约 40 处 · W0/W1/W2 后新布局现值） | ✅ 全中 | `cli-graph.ts`（cmdGraph :19 · help 用法串 :21-31 · 缺省 `docs/_tech_graph` :77 · axioms exit 2 :202）· `cli-graph-hgm.ts`（HgmEvent :15-23 · buildSnapshot :237-296 · BusinessRepository kind :255 ✓ · HAS_GATE 边 :269 ✓ · BLOCKS hats :271-276 · checkRejectedToDraft :298-333 · TaskStatusChanged(draft) :317-322 ✓ · checkAxioms :335-392 · **D2 `.includes('30')` 裸子串 :346 逐字在案** · D3 :357-371 · S2 :373-387 · idempotencyKey :404-409）· `cli-graph-yaml.ts`（SCHEMA_VERSION inform_graph.v3 :6 · validateGraphYaml :53-120 · **kind 硬编码枚举 :87 逐字在案** · contentStamp :188-191 · classifyLabel :201-207 · edgeToGraphV2 :209）· `cli-lifecycle.ts`（assetsHarnessFile 硬读 packageRoot :36-38 ✓ · loadLifecycle :40-53 · loadDiscipline :55-68 · 缺件 fail :57 ✓ · formatDisciplineShow :91 · SoT 注行 :121 ✓ · show 分派 :370-378/:447-455 · `--target` takeOption :389 ✓）· `cli-shared.ts:143` KIT_LAYOUT_DIR `.coding-kit` ✓ · `cli/main.ts`（graph :3,:96 · discipline/lifecycle :6,:72-76）· `ontology.yaml`（113 行 · 头注释 :1-4 含「未接线」自述 :4 ✓ · classes :10-41 实测 15 项 ✓ · embedsInto 两端悬空 :44-46 ✓ · blocks :48-51 ✓ · produces 客体悬空 :56-58 ✓ · axioms :62-74 · hats :77-99 实测 8 帽 V2 全形 ✓ · gates :101-111 实测 blocks_hats 用 V2 全形 ✓）· `release-pins.yaml`（pin-03 :27-32 product_semver required+fixable ✓ · pin-04 :33-38 ✓ · pin-05/06 = README 双文件 `spec-wave@x.y.z` regex-all 钉 ✓）· `onto-probe.mts`（77 行 · 四形状种子 :29-58 · exit 2 :77）· 测试锚点（cli-g1g7 :354-380 PASS/FAIL 冒烟 ✓ · cli-json-no-abs-path :377-381 ✓ · pins-consistency :168/:514 区 ✓）· discipline-coverage.yaml（325 行 · gaps :18 · statements :85 ✓）· `docs/_tech_graph/` git ls-files 实测 **14 份**（5×.graph.yaml ✓） |
| 行为变更类「旧测 grep 影响面」提醒（K7） | ✅ 已覆盖（附 A3/A4 补列） | S4.4「既有面保护」+ 验收 #11 + F-W2-13 同式登记纪律在案；本审独立 grep 复核：`grep checkAxioms test/` = **0** ✓ · `validateGraphYaml` 在 test/ 零直接单测 ✓ · axioms 断言面 = cli-g1g7:382 `/FAIL|violations|D2/`（FAIL fixture 用短形 `30` 精确命中 · D2 段边界判后仍触发 ✓ 预期零改动）· graph yaml 断言面 = cli-g1g7:313 / cli-graph-yaml-export:101,103（mark→type 派生 · 边型 Warning 钩不触碰）—— 影响面小且登记纪律兜住；**但**发现两处清单漏项（A3 :412 第二硬拷贝 · A4 两 ontology 测试件），走 advisory |
| W2 前置兑现 | ✅ | W2 done（三闸 approved · 锁终态 726/140/725/0/1 与本审复跑逐字一致）· 研究文+探针入库（SPEC 验收 8 已销） |

**常规核对结论：无 blocking。**

---

## 三、六条重点逐条结论（5+1 · 含本审独立复核证据）

### 重点 1 · 闸行裁决（W3 不设 HG-SCHEMA-CHANGE 行 · 四理由 + 升级条款）——✅ 裁决成立 · 兜底够（理由④附强度注记 advisory A1）

- **理由①（ontology.yaml 结构零变更 · 补声明=数据行）成立**：本审实读 `ontology.yaml` 全文结构（classes/relations/axioms/starter_hats/extended_hats/human_gates 六键 · 字段集 id/domain/subclasses·id/subject/object/cardinality·id/text·hat_id/role·id/blocks_hats/note）；S4.2/S4.5 的全部改动 = 在既有列表结构内增数据行（2~3 个 class 项 + 1 个 relation 项），键形态与字段集零触碰；硬约束 3 的闸对象 = schema（结构格式）变更，格式未变即闸不触发 ✓；
- **理由②（缺陷修复非 schema 演进）成立**：SPEC §3-③ 明示「真修（补齐声明）」为既定处置选项、验收 6 硬要求「接线后 0 处」——补声明是 SPEC 已批准范围内的既定动作，非本棒自创语义；研究文 §6.2 处置倾向（BusinessRepository/DisciplinePackage 补声明）与 task 定稿逐字一致 ✓；
- **理由③（hasGate 补声明 = 活边型追认登记）成立 · 未越出「缺陷修复」范畴**：本审实证 `cli-graph-hgm.ts:269` `addEdge(..., 'HAS_GATE', ...)` 活边型在先、`:255` BusinessRepository 活实例在先 —— 登记是**追认代码里已活用的词汇**进 TBox，非创造新语义；且 hasGate 是 F1 已批准边界（「HGM 全量适配 · edge.type ⊆ relations」· 研究文 §9.1 候选一原文即含此校验方向）的**必要前提**——不做它则 HGM 适配对自身仓内真实事件轨必红，已批准的 F1 裁决不可兑现 ⇒ 补声明落在批准裁决的内涵面内，非范畴外扩；
- **理由④（tech-graph-vocab 新档自有格式）成立 · 附注记**：新 artifact 自有格式（`version: "1"` 自描述 · 不改 inform_graph.v3 读法）论自足；但「历史上新 artifact 自有格式从未触发 schema 闸」的类比**部分平凡**——HG-SCHEMA-CHANGE 为 3.0 新增闸（W1 首创），可援引的历史窗口极短，「从未触发」非强先例（与 W2 R1 审查文 A1 同型注记）。**裁决结论不变**（operative 论据 = 闸对象限定为结构格式变更 + 缺陷修复既定处置 + 新 artifact 自有格式），类比降级为旁证（advisory A1）；
- **升级条款（STOP 兜底）足够**：触发条件客观可判（新建带 subclasses 层级的伞类 / 改类层次 / 改 relations 基数语义 / 删除或改名既有类或关系）· 通道明确（STOP → 评审文 → HG-SCHEMA-CHANGE 式人闸 → 才改码）· 与硬约束 3 顺序兼容；且 S4.2 对 TraceArtifact 另设更严的硬阻塞（F-W3-08 未得答不得二选一）—— 双通道叠加，逃逸面已闭合。**本审不判定须补闸行**。

### 重点 2 · F2「消费者资产」语义（三层优先级 + fallback 诚实口径）——✅ 满足 SPEC ⑤ 原意 · 不提出改动

- SPEC ⑤ 原文「改读消费者资产（O3 真口径）」+ 验收 4「输出与 discipline-coverage.yaml 逐项一致（机检）」。task 定稿三层解析（`<target>/assets/harness/` → `<target>/.coding-kit/assets/harness/` → packageRoot 兜底+来源标注）是对「消费者资产」的**消费者优先解析**实现；
- **严读「只读消费者资产」不成立**：本审实证 `src/cli/init.ts` 零物化 `assets/harness/` 入消费者仓（grep 无 assets 物化面 · 现状面与 task 声称一致）⇒ 今日全部真实消费者无消费者资产可读，严读会使命令对全部真实用户 exit 2 —— 显然非 SPEC 原意（O3 真口径的对立面是「自述口径冒充消费者现状」，非「包内兜底本身」）；
- **fallback 诚实口径即原意的正确兑现**：命中兜底层时输出 `source: package-fallback（消费者资产未找到 · 显示包内自述口径）` 标注行 + SoT 尾注按实际来源改写 —— 「真口径」的语义核心（不假装读到了消费者资产）由此满足；坏资产即红不回退（exit 2 点名路径）守住 fail-closed，避免「坏消费者资产被静默替换为包内件」的第二谎言面；
- **机检断言闭环**：--json deep-equal 所读 yaml + 来源正误 fixture（临时 target 放篡改版 coverage → 输出反映消费者版）证明优先级真生效 —— 验收 #4 机械化充分。residual_risks ③ 明示「若 20 审认为另有所指须 R1 提出」——**本审不提出**，定稿成立。

### 重点 3 · D3/S2「移除+登记」定稿 ——✅ 选移除得当 · 无需升级请示

- 研究文 §5.3 给「移除或接真」二选一且**未表态倾向**（D3「要么删除该公理，要么…产 CHECKED 边」· S2「要么删除，要么定义 sync 事件来源」）⇒ task 选移除落在研究文 sanction 的选项集内，非自创新径；
- **移除的事实基础本审复核成立**：CHECKED/SYNCED 边在 buildSnapshot（:237-296）零产出 case（研究文 §5.2 根因归簇 · 本审实读 :251-285 事件 case 面一致）⇒ D3 恒 warn 空转（噪声）· S2 恒绿死判据（假安全感）—— 两者皆「公理语义面超出快照构造面」的畸形物，移除+登记是诚实处置；
- **S2 的「移除」不等于放弃 S2 保护**：task 登记口径「S2 真保护在 sync 拒绝面」—— 本审实证 `isS2RelPath` 真实存在且被 `cli-shared.ts` 导出、`host/materialize.ts:259` / `host/schema.ts:24` / `cli-pins.ts:11` 执行侧拦截在案；且验收 #12 文案红线（对外不得声称 `graph axioms check` 保护 S2 · 负向 grep）消除假安全感叙事 —— 研究文 §5.3 警示（「恒绿的 S2 保护叙事不得在对外口径中声称」）逐字兑现 ✓；
- **接真 = 范围膨胀的判断正确**：接真须设计 GateCheckRun/sync 事件源（与 W6 G7 执行证据面协同）—— 属新事件类型+新边型+新 ingest 面的系统设计，超出「判据加固」范畴；task 将其列为非范围并留 3.x 通道（接真须 20/00 批准扩范围）分寸得当。**本审不认为须升级请示维护者改判**——移除是可逆的（公理文本+登记在案 · 接真随时可另议），而接真的范围膨胀不可逆地挤占本波已批边界。residual_risks ② 已登记改判可能性 · 本审不提出改判。

### 重点 4 · tech-graph 浅登记零 breaking 证明链 ——✅ 证明链够 · 附两个补列项（advisory A3/A4）

- **恒等 fixture 判据成立**：本审实证 kind 枚举校验唯一落点 = `cli-graph-yaml.ts:87` `['flow','struct','external'].includes(n.kind)` 逐字在案；既有语料 = `docs/_tech_graph/` 5 份 .graph.yaml（git ls-files 实测）+ 测试 fixture —— 「registry 驱动 ≡ 硬编码旧行为逐字」可机械断言 ✓；
- **边型钩 Warning 不咬 exit 与表现层开放惯例一致**：`classifyLabel` :201-207 实证 `::label` 派生自定义 type 合法（mark 驱动类型派生是公开行为 · cli-graph-yaml-export.test.ts:101,103 断言在案）—— 登记≠封闭的裁决与既有公开语义自洽 ✓；
- **既有断言影响面本审 grep 抽核**：`validateGraphYaml` 在 test/ **零直接单测**（grep 0 命中）；graph yaml 系断言面 = cli-g1g7:313（compile/check/export 冒烟 · check 有 diff 非 0）+ cli-graph-yaml-export.test.ts（mark→type）+ cli-docs-graph-templates / cli-p0 / pins-consistency（间接面）—— 面小、恒等 fixture + F-W2-13 同式登记纪律**够用**；
- **但发现两处清单漏项**（不阻塞 · 登记纪律机械兜住 · 落 advisory）：① `cli-graph-yaml.ts:412` `KIND_TO_CLASS = { flow:'phase', struct:'doc', external:'infra' }` 是 src 内**第二份** flow/struct/external 硬拷贝（导出 graph_v2 的 class 映射），task S4.5-3 只点名 :87 —— 验收 #6 的 grep 单源断言（「src 内 flow/struct/external 仅出现于登记档加载点」）会机械咬住它，30 须同迁或按断言词表口径登记（A3）；② `test/ontology-shallow.test.ts` 与 `test/assets-ontology.test.ts` 两件**直接断言 `assets/ontology.yaml` 内容**的既有测试未列入必读 6 既有面清单 —— 其中 assets-ontology ③ 断言 `body` 含 `/graph axioms check/` 且含 `/未接线/`（「须明示 ontology-check 本包未接线」），与 S4.1 接线 + S4.6 头注释登记行**硬耦合必破须登记更新**（A4）。两处均有 fail-closed 机械兜底（grep 断言 / npm test 全绿硬条），属执行期登记义务补列，无需改 task。

### 重点 5 · VersionShape 单源划界 ——✅ F-W3-11 判据可机检成立

- **pin-03 强制钉地位本审实证**：`release-pins.yaml:27-32` pin-03 = `product_semver ↔ package-version` · `required: true` · `fixable: true` · 本审 pins check 17/17 PASS 含 pin-03 —— 唯一强制真值源事实成立；
- **「恒 Warning」可机检**：验收 #1 已含「仅 Warning 件 exit 0 含警示行」fixture 形态 —— VersionShape 漂移样本（product_semver 与 package version 不一致）→ exit **0** + 警示行 + 报告注 `see pin-03` 即可机械断言「不咬 exit / 不修复 / 注源」三要素；F-W3-11「越权升级为 Violation/修复面 → 打回」有此 fixture 即非空言；
- **双份真值防线的逻辑闭合**：pin-03 咬 exit（强制面唯一）· VersionShape 只做 ontology-check 报告内观察项（可见性面）· 分歧时以 pin-03 为准（裁决规则写明）—— 三面各有机检或明文，「不得形成双份强制真值」（研究文 §8.4 警示）成立 ✓。

### 重点 6（另请复核）· 短帽 id 漂移降级（HGM hat 词汇仅 Warning + 前缀段归一 · F-W3-09）——✅ 降级安全 · 真漂移可见性兜住

- **漂移实证在案**：TBox 帽词表 = V2 全形 8 帽（`ontology.yaml:77-99` 本审实读：`10-task/20-task-audit/30-execute-code/40-self-check` + `10-spec/20-spec-audit/00-orchestrator/50-independent-reinspect`）；存量 task 闸表用短形 —— **本 task 自身闸表即实证**（HG-TASK-DRAFT `blocks_hats` = `20, 30` · HG-AUDIT-R1 = `30` · task :41-42）· g1g7 fixture 默认 `'20,30'`（cli-g1g7.test.ts taskMd helper）· W1 起 `blocks_hats=30` 短形为泛化判定的既定口径 —— 短形是**现行机检协议的组成部分**，非脏数据；
- **Warning 是唯一一致选择（零 breaking 红线下的必然）**：若 HGM hat 词汇面咬 exit（Violation），则对本仓**现行合规** task 文件（短形 blocks_hats 被 W1 泛化判定正式消费）自咬 —— 与「公开 CLI 零 breaking / HGM 适配=纯新增校验面」（S4.5-2 边界 · 研究文 §9.1）直接冲突；且 `evaluateMayStart30` 的段首匹配（W1 泛化口径）与 D2 修复后的段边界判（S4.4）同源 —— 前缀段归一（`30` ≡ `30-execute-code` 段首等值）与既有判定语义**对齐而非新造**；
- **真漂移可见性**：归一后仍未命中 → Warning 点名 + 不得静默 + 归一映射单点声明 + F-W3-09 登记 —— 四层叠加，可见性充分；残余风险（Warning 不咬 ⇒ 漂移可累积）由「全量归一化登记 3.x」（residual_risks ⑤ · 存量 task 改写属数据面迁移另议）正确隔离；
- **附带实证**：`ontology.yaml` 自身 human_gates（:101-111）的 blocks_hats 用 V2 **全形**（`20-task-audit`/`30-execute-code`）⇒ S4.1 GateShape 严格 `⊆ hat_id` 对随包件自洽（修复后 0 Violation 可达 · 验收 #2 无内在矛盾）—— 短形漂移仅存在于消费者侧数据面（task 文件/HGM 事件），由 S4.5 Warning 面兜住，两形状口径不冲突 ✓。

---

## 四、发现清单

### Blocking（0 条）

无。

### Advisory（4 条 · 均不阻塞签闸 · 30 执行时落实或自检登记 · 无需改 task）

| # | 级别 | 内容 | 建议落点 |
|---|------|------|----------|
| A1 | 标注级 | 闸行裁决理由④的「历史上新 artifact 自有格式从未触发 schema 闸」类比**部分平凡**（HG-SCHEMA-CHANGE 为 3.0/W1 新增闸 · 可援引历史窗口极短 · 与 W2 R1-A1 同型）；裁决 operative 论据 = 闸对象限定为结构格式变更 + 缺陷修复既定处置（SPEC §3-③）+ 新 artifact 自有格式自描述 —— 该论据自足，**裁决结论不变** | 30/00 引用该裁决时以闸对象论+缺陷修复论为主论据；类比仅作旁证 |
| A2 | 口径级 | S4.5-1「classes（修复后 **16±1** 项）」计数口径偏差：本审实测现状 15 项（Package 域 5 + Instance 域 10 · :10-41）· 已定稿补声明两项（BusinessRepository/DisciplinePackage）⇒ 下限即 **17**；若 TraceArtifact 答=伞类再补一项 ⇒ **18**。正确口径应为 `17±1`（`16±1` 既漏 18 上限又含不可达的 15/16 下限）。relations `5±1` 复核正确（4+hasGate=5 · 改指/豁免均不变数）。不影响验收硬条（#2 的真判据是 0 Violation） | 30 自检引用本审 A2 口径（修复后 classes = 17 或 18 视对账答）· 无需改 task |
| A3 | 登记级 | tech-graph 词汇在 src 内实为**两处**硬拷贝：`cli-graph-yaml.ts:87`（kind 校验枚举 · task 已点名）+ `:412` `KIND_TO_CLASS = {flow:'phase', struct:'doc', external:'infra'}`（导出 graph_v2 class 映射 · task 未点名）。验收 #6 grep 单源断言会机械咬住 :412 —— 30 须将 :412 一并迁入登记档加载口径（或在断言词表/登记项中显式说明其处置）· 恒等 fixture 语料须含 export 面（cli-graph-yaml-export.test.ts 消费面） | 30 执行期盘点登记（F-W2-13 同式）· 单源断言口径以「两图校验只读同一登记档」为准 |
| A4 | 登记级 | 既有测试面清单（必读 6 / S4.4 既有面保护 / 验收 #11）漏列两件**直接断言 `assets/ontology.yaml`** 的测试：`test/ontology-shallow.test.ts`（必填顶栏/classes 含 id/ONTO- 前缀/starter_hats 四帽/投影页）与 `test/assets-ontology.test.ts`（DEF-004 守卫四件）。其中 assets-ontology ③ 断言 ontology.yaml `body` 匹配 `/graph axioms check/` 且匹配 `/未接线/`（「须明示 ontology-check 本包未接线」）—— S4.1 接线后该自述失真、S4.6 头注释增登记行时**必破须登记更新**（典型 F-W2-13 登记项）。两件均 additive 兼容 S4.2 补声明（classes 增行不破其断言）· 唯头注释改动面须登记 | 30 执行期把两件列入既有面登记清单 · 头注释改动与测试更新同 commit 留痕 |

---

## 五、总结论

**PASS-with-issues**（blocking 0 · advisory 4）—— task 内容与 SPEC/研究文/PLAN/硬约束逐项一致，六条重点全部成立（闸行裁决四理由成立且升级条款兜底够 · F2 三层解析+fallback 诚实口径满足 SPEC ⑤ 原意 · D3/S2 移除+登记得当无需升级请示 · tech-graph 零 breaking 证明链够（恒等 fixture+Warning 不咬 exit+登记纪律）· VersionShape 单源划界可机检成立 · 短帽 id 漂移 Warning 降级安全且为零 breaking 下唯一一致选择），关键数字（726/140/725/0/1 · 94.3s · typecheck 0 · pins 17/17 · HEAD fb280df · 探针 conforms:false/3 处/exit 2 · deps 仅 js-yaml · lock 非 dev=2）与约 40 处行号快照经本审**独立复跑/抽核/grep 复现**。**思考轮审查通过，充分性裁定：充分。**

本审**不代签** HG-AUDIT-R1；签署归 00（维护者 2026-09-16 授权模式）。**因 HG-AUDIT-R1 仍为 pending，按纪律不附 30 Prompt**，仅出维护者签闸清单：

## 维护者签闸（20 后 · 30 前）

- [ ] 已读 R1 审查结论（本文 · 含 advisory A1–A4）
- [ ] 在 task 人工闸表将 HG-AUDIT-R1 改为 approved（00 代签 · 维护者 2026-09-16 授权 · 日期）
- [ ] commit task 文档或确认已签（连同本棒交付：本审查文 + `docs/harness/invokes/by-task/3-0-w3-ontology-graph/invoke_20260917_20_3-0-w3-ontology-graph.md` · 逐文件显式 add · 禁 `git add -A`）
- [ ] 再下发 Harness 30 Prompt

30 Agent 将以 task 表为准；pending 时必须拒开工（见 TEMPLATE_30_gate_stop.md）。

---

## 修订记录

| 日期 | 说明 |
|------|------|
| 2026-09-17 | R1 · 20-task-audit：常规核对 12 项全过；六条重点逐条独立复核（闸行裁决四理由+升级条款 · F2 三层解析与 init 不物化实证 · D3/S2 移除裁决与 isS2RelPath 真保护面实证 · tech-graph 恒等 fixture 证明链+两处硬拷贝面 grep · VersionShape/pin-03 单源划界 · 短帽 id 漂移 V2 8 帽 vs 存量短形实证）；独立复跑 npm test 726/140/725/0/1（94.3s）+ typecheck 0 + pins 17/17 + 探针 conforms:false/exit 2 + deps/lock 计数 + HEAD fb280df 全中；约 40 处行号抽核全中；gate-check/verify 双机检咬住 HG-AUDIT-R1 pending · task lint PASS；总结论 PASS-with-issues（blocking 0 · advisory 4：A1 闸裁决④类比强度注记 · A2 classes 计数口径 16±1→17±1 · A3 KIND_TO_CLASS :412 第二硬拷贝 · A4 两 ontology 测试件补列+/未接线/ 断言硬耦合）；不代签 HG-AUDIT-R1 |
