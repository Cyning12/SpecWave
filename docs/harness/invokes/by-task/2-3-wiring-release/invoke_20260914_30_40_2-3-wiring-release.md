# invoke · 30+40 · 2.3.0 release bump 闭环（GATE_VERIFY → 实现 → 四门自证）

> **hat_id**：`30-implement` + `40-verify`（同棒闭环）· **日期**：2026-09-14  
> **task_slug**：`2-3-wiring-release`  
> **授权**：task 人工闸表 HG-TASK-DRAFT / HG-AUDIT-R1 均 approved（2026-09-12 维护者会话授权 00 代签）· GATE_VERIFY 首输出实测 `VERIFY: PASS · exit 0` 后开工

## 执行序列（真实命令 · 逐条自证）

1. `package.json` version 2.2.1 → 2.3.0（唯一手工版本改动点 · 不用 npm version）
2. CHANGELOG `## [2.3.0] - 2026-09-14` 节**先落盘**（pin-13 首个命中语义 · F-R-09 防历史头回写）· 发布状态=待发版口径
3. docs/spec/README.md `2_3-wiring-completion` 行 → signed · IMPLEMENTED · 2.3.0 待发版（pin-08 严化双判兼容）
4. `node bin/specgate.js pins check`（10 偏差/17）→ `pins fix --yes`（写入 9 处 · 8 文件 · 同文件聚合一次收敛）→ 复跑 **16/17 + pin-10 设计红**（git tag v2.3.0 缺失 · 待人打）
5. 叙事漂移巡修改回真值 ×4：RELEASING :13 · README 双语 :375 · MIGRATION :3 描述；未钉引用联改：README 双语 ×8 · MIGRATION :17 · host-adapt kit_semver :41
6. 断言联改 perl 双模式 ×8 测试文件（含 `2\.2\.1` 转义形态 · 一轮清零 grep -c 全 0）· 历史标题保留 ×2
7. RELEASING：人 checklist 2.3.0 待办节（九步区之后）+ 台账行 ×4（验收/task/规划 SPEC/下一主线）——九步顺序测一轮全绿
8. `docs/roadmap/ACCEPTANCE_2_3_wiring_completion_2_3_0_zh.md` 落盘（七波台账 + 门禁基线 + 已知残余 + 人 checklist 待执行）+ PLAN_2_3 波次总表 W1–W7→DONE + release 行
9. assets manifest 伴生：`assets manifest rebuild --yes`（~3 变更）→ `assets verify` → **110/110 PASS**

## 40 自证（真实输出摘要）

| 命令 | 结果 |
|------|------|
| `npm run typecheck` | 0 错 0 警 · exit 0 |
| `npm test` | 535 例：**532 pass + 2 fail + 1 门控 skip**；2 红均 tag-gated 设计红（release-tag-identity「tag v2.3.0 存在」· pins-consistency A 组真实仓 pins check 因 pin-10 exit 2）；打 tag 后复跑须 534/534 |
| `npm run build` | exit 0 |
| `npm run test:lib` | 6/6 pass · fail 0 |
| `node bin/specgate.js pins check` | 16/17 · 唯一偏差 pin-10（设计红 · F-A1-05） |
| `node bin/specgate.js assets verify` | 110/110 PASS · exit 0 |
| F-R-09 反向验证 | `grep '^## \[2.2.1\] - 2026-09-12'` → CHANGELOG :39 历史头未被回写 |
| 叙事残留 grep | `spec-wave@2.2.1` 全仓 0；2.3.0 邻近 published 叙事仅 3 行真值口径 |
| `npx spec-wave gate-check --task …` | 闸检查未发现阻塞 · exit 0 |

## 禁区遵守

未执行 git tag / git push / npm publish / npm deprecate（仅人）· 未用 --force/--allow-* · S2 只新增不覆写 · host-adapt schema 零触 · .workbuddy/ 未碰 · `.bak`×8 留本机未入库。

## 移交

→ task close --yes → `chore(release): bump to 2.3.0 — wiring completion` 独立提交 → 交付报告（§6 格式 + 移交清单）。
