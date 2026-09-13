# invoke · 30+40 · 2.3 W2 钉面维度扩展实现与自证（pin-16/17 两新 kind + 前置修复 + 测试扩组）

> **hat_id**：`30-execute-code` / `40-self-check`（同 Agent 闭环）· **日期**：2026-09-12  
> **task_slug**：`2-3-wiring-w2-pin-dimensions`  
> **蓝本**：`docs/tasks/active/task_2_3_wiring_w2_pin_dimensions.md`（HG-AUDIT-R1=approved · 2026-09-12 维护者会话授权 00 代签）

## GATE_VERIFY 首输出（30 开工前）

```
$ node bin/specgate.js verify --target . --task docs/tasks/active/task_2_3_wiring_w2_pin_dimensions.md
| HG-TASK-DRAFT | approved | 22, 30 | — |
| HG-AUDIT-R1 | approved | 30 | ✅ 可 30 |
VERIFY: PASS · task_2_3_wiring_w2_pin_dimensions.md · EXIT=0
```

## 实现清单（path:line）

1. **前置修复**（SPEC 02 §5.1 授权 · 30 第一步）：`package.json:34` files[] 增 `"MIGRATION.md"`（npm pack --dry-run 实证：183 → 184 文件 · MIGRATION.md packed=true · 安装后真死链消除）。
2. **`src/cli-pins.ts`**：
   - `PinExtract` 类型扩展 readmes/host_hits/known_gaps（:19-33）；
   - `readdirSync/statSync` 导入（:9）；
   - kind `files-whitelist-link` 求值器（pin-16 · 仓根级 + npm 自动入包并集白名单 · 缺失 files 条目跳过 · 不存在目标不判 F-W2-07）；
   - kind `readme-host-row` 求值器（pin-17 · host_hits 双语分侧判定 · F-W2-06 映射缺失数据债 · known_gaps 豁免 + F-W2-05 失陈债机检自执行）；
   - **调试留痕**：首版 `path.join(dir, target)` 未相对化导致全量目标含 `/` 被跳过（钉面永不触发）——W2-B2/B5 fixture 真失败擒获，改 `path.relative(root, path.resolve(dir, target))` 后收敛（测试先行的实证价值）。
3. **`assets/release-pins.yaml`**：pin-16（files-whitelist-link · semantics 数据声明）+ pin-17（readme-host-row · readmes 双语 + host_hits 7 宿主逐核对映射 + known_gaps 三条 until_wave: W7）· 钉面 15 → 17 · 均 fixable=false。
4. **`test/pins-consistency.test.ts`**：W2 fixture（makeW2Fixture + W2_PINS_YAML/W2_PINS_YAML_HOSTS）+ W2-B1..B10 用例 + C 组 TEST-LOCK 联改（ids 15→17 · fixable 面 +pin-16/17:false · 新增 pin-16/17 数据形态断言含 YAML 正则逐字核对）。

## 验收自证（逐条 · 全部真实命令）

### ① 校验①负向（真实仓破坏-修复-还原链）

```
# 构造：printf '# FOO' > FOO.md · README.md 尾部加 [FOO](FOO.md)（不入 files）
$ node bin/specgate.js pins check
[mismatch] pin-16 package.json · actual="1 处仓根级文档未入白名单" · README.md:375 -> FOO.md · 建议: package.json#files 加白 or 移除链接
PINS: BLOCKED · 1 偏差 / 17 落点 · exit=2
# FOO.md 入 files → 转绿
PINS: PASS · 17/17 落点一致 · exit=0（扫描 97 个 markdown · 0 失配）
# 还原（git checkout README.md · rm FOO.md · package.json 保留 MIGRATION.md 前置修复）→ exit=0
```

### ② 校验②负向（真实仓 · dummy host 构造链）

```
# 构造：mvp-hosts.yaml 加 host_id: dummy9 + release-pins.yaml host_hits 加 dummy9: ['DummyHost9']
[mismatch] pin-17 ...mvp-hosts.yaml · actual="2 项偏差（失配/数据债/豁免失陈）" · dummy9 · 缺 README.md（EN 侧） · dummy9 · 缺 README.zh-CN.md（ZH 侧）
PINS: BLOCKED · exit=2
# 还原双文件 → PINS: PASS 17/17 · exit=0
```

### ③ 前置修复后 PASS

- `pins check` 17/17 PASS：pin-16 `扫描 96 个 markdown · 0 失配`（MIGRATION.md 入 files 后）· pin-17 `7 宿主校验 · 4 双语命中 · 过渡豁免 copilot@W7,codex@W7,windsurf@W7`。
- 反误报用例钉死：W2-B3（files 未列 README.zh-CN.md 但被链接 → pin-16 ok · npm README* 自动入包口径）。
- `npm pack --dry-run`：184 文件 · MIGRATION.md packed=true。

### ④ 接线点位实测命中

- 零新接线点（D-23-W2-CHECK-FORM）：pin-16/17 挂载既有 `pins check`。
- `package.json:42` prepublishOnly 链尾 = `node bin/specgate.js pins check` · `.github/workflows/ci.yml:30` test job 同一命令（grep 留证）。
- 「改动触发即红」实证 = 验收①② 破坏态下该命令 exit 2。
- 波末 `npm run prepublishOnly` 全链实测：见交付报告（typecheck → test → build → test:lib → pins check 全链）。

### ⑤ 四门

| 命令 | exit | 结果 |
|------|------|------|
| `npm run typecheck` | 0 | 0 错 |
| `npm test` | 0 | **495/495 pass**（基线 484 + 新增 11 · 2m34s） |
| `node bin/specgate.js pins check` | 0 | PINS: PASS · 17/17（基线 15/15 → 17/17） |
| `npm run test:lib` | 0 | 随 prepublishOnly 全链实测 |

### ⑥ 豁免失陈债机检负向（fixture · W2-B10）

- (a) 豁免宿主 delta 双语 README 双双命中 → exit 2 · `delta（双语已双双命中 · W7① 落地 · 豁免失陈债 F-W2-05 · 须移除豁免条目）`；
- (b) known_gaps 含适配表外 host → exit 2 · `delta（已不在适配表 · 须移除豁免条目）`。

### ⑦ TEST-LOCK 联改清单

`test/pins-consistency.test.ts` C 组：钉面 15→17（ids 列表 + Set size）· fixable 面 +pin-16/17:false · PinRow 类型扩展 · 新增 pin-16/17 数据形态断言（kind/path/expected.kind/readmes/host_hits 7 宿主键集/cursor 正则逐字/known_gaps 封闭三条 until_wave=W7）。grep 留证：无残留 `size, 15` / 旧 ids 断言。

### ⑧⑨ gate-check / close / 提交边界

见 task 修订记录与交付报告（逐路径 add · 无 git add -A）。

## 未做（禁区遵守）

- 未碰 RELEASING.md / host-adapt schema / 根 README 宿主行（W7① 职责）/ docs/ 全深度口径（D-23-W2-ROOTSCOPE）
- 未新增 --force/--allow-* 参数 · 未写 S2 以外过程档以外的 S2 覆写 · 未 tag/push/publish
- 破坏性自证后全量还原再跑 npm test（R3 纪律）
