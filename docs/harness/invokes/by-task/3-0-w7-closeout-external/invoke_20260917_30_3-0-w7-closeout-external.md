# Invoke · 30 · 3-0-w7-closeout-external

| 字段 | 值 |
|------|-----|
| task_slug | `3-0-w7-closeout-external` |
| hat_id | `30` |
| opened | 2026-09-17 |
| status | **closed**（实现四阶段完成 · 待 40 复核 · **不 close**） |
| notes | 00 派发 · HG-TASK-DRAFT / HG-AUDIT-R1 = approved · pre-30 invoke 三件套（10/20）齐 · GATE_VERIFY VERIFY: PASS · 本棒范围 = 阶段一→阶段四 |

## 关棒摘要（≤10 行）

1. **阶段一（F3+E3）**：`da1a4e4`+`7e9ee37` · F3 wiki 双向/增量/冲突（键只增）· E3 spawn **671→270**（`scripts/e3-spawn-count.mjs` · makeCore harness）。
2. **阶段二（术语+A3+K）**：`2243489`+`5473319`+`33ae2b4` · 术语判红面残留 0 · A3 claims boundary · K-1~K-4 区间+as_of。
3. **阶段三（迁移+链接+证据）**：`0d06c1f`+`d2d1c1e`+`7c5f2c9` · MIGRATION 定稿 + 真实 v2.4.1 演练（无兼容洞）· 链接非 S2 (i)/(ii)=0 · 4 镜像 + 7 登记。
4. **阶段四（bump+探针+备料）**：bump 3.0.0 九件套 · 探针 6 项 · ACCEPTANCE 素材 · 本 invoke。
5. **锁**：841→845→855→859（纯加性）· typecheck/build/test:lib 6/6 · **pins 16/17**（pin-10 tag-gated 设计红）· assets 113/113 · terminology/claims/links 三 checker PASS。
6. **未执行**：tag / push / publish / deprecate（**全仅人** · HG-RELEASE=pending）· 不 close（待 40 复核）。
7. **已知未测项**：tag `v3.0.0` 待人打（pin-10 设计红 · `release-tag-identity` 同因）· npm publish 仅人 · 打 tag 后复跑须 17/17 + 全绿。

## 开棒 Prompt（00 派发 · 摘要）

Open Folder = 本仓根。读 task + SPEC `08_w7_closeout_external_v1.md`。四阶段：

- 阶段一：F3 wiki（S7.1 · 验收 #11）+ E3 spawn 下沉（S7.2 · 验收 #7 · ≤300）。
- 阶段二：术语机检（S7.3 #1）+ A3 口径边界（S7.4 #3）+ K-1~K-4（S7.5 #5）。
- 阶段三：MIGRATION 定稿 + 2.4.1 演练（S7.6 #2）+ 链接两级（S7.7 #4）+ 证据清偿（S7.8 #6）+ 2.4.2 零残留（S7.9 #8）。
- 阶段四：3.0.0 bump + 探针（S7.10 #9/#10）+ 收官备料。**tag/publish 仅人 · Agent 禁**。

## 修订

| 日期 | 摘要 |
|------|------|
| 2026-09-17 | 开棒 · GATE_VERIFY PASS |
| 2026-09-17 | 关棒 · 四阶段 commit（da1a4e4/7e9ee37/2243489/5473319/33ae2b4/0d06c1f/d2d1c1e/7c5f2c9）· 终态 bump 3.0.0 · pins 16/17（pin-10 设计红）· 待 40 |
