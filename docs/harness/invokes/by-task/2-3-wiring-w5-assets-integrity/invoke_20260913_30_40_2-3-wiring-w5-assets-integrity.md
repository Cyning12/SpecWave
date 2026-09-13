# invoke · 30+40 · 2.3 W5 A2 资产完整性校验实现与验收闭环

> **hat_id**：`30-execute-code` + `40-verify` · **日期**：2026-09-13  
> **task_slug**：`2-3-wiring-w5-assets-integrity`  
> **帽条文**：`assets/harness/prompts/30-execute-code.md` / `40-verify.md`

## 授权来源

维护者 2026-09-12 会话授权（00 委派 W5 实现棒走完整链路）· HG-AUDIT-R1 = approved（00 代签 · 20 R1 pass 零阻塞）。开工前 GATE_VERIFY 实测：`node bin/specgate.js verify --target . --task docs/tasks/active/task_2_3_wiring_w5_assets_integrity.md` → 闸扫描全 approved · VERIFY: PASS · exit 0（W4 G2 结论级审查文闸通过 · dogfood 自证）。

## 动作（30）

1. **`src/cli-assets.ts` 新增**（单一实现源）：collectAssets（排除清单 D-23-W5-EXCLUDE 单一常量 · posix 路径 · 确定性排序）· sha256File · renderManifest（`<sha256>  <path>` sha256sum 行格式）· loadManifest（缺失/语法坏/重复/越界 failClosed exit 2）· runAssetsVerify（四态 ok/mismatch/missing/extra · F-W5-02 目录缺失优先判）· verify（--json status/manifest/counts/files）· manifest rebuild（dry-run 默认 · --yes 写 manifest 唯一对象 · 幂等 · 无 .bak）。
2. **`src/cli.ts`**：import + runCli `assets` 分发 + usage 两行。
3. **`assets/sha256.manifest`** 首版落盘（110 条 · posix 排序 · 自身不入清单）。
4. **门禁接线（verify-only · D-23-W5-GEN-CMD）**：package.json prepublishOnly 链尾 pins check 后追加 `&& node bin/specgate.js assets verify`；ci.yml test job pins 步后同名步。
5. **测试**：新增 `test/cli-w5-assets-integrity.test.ts` 9 用例（正向+JSON 键集/篡改/missing/extra/F-W5-01 三档+越界/F-W5-02 双命令/修复收敛+幂等/排除清单双侧/用法错+信封）；lib-smoke 增 S5 bin 面钉面。
6. **CHANGELOG**：Unreleased Added 一条（未发布口径）；README/事实卡/RELEASING 零改动（`git status` 留证）。
7. 实现期修正：verify 判序调整（assets 目录缺失优先于 manifest 缺失 · 测试擒获报文指错对象）。

## 动作（40 · 验收自证）

全部经 `node bin/specgate.js` 真实命令（W3 教训 · 非仅 src 套件）：/tmp/w5-acc 靶场 exit 码硬断言——rebuild 0 · verify PASS 0 · 篡改 2（mismatch）· missing 2 · extra 2 · dry-run 零写盘（md5 前后一致 fdec84af…）· --yes 后 0 · 二次幂等；本仓篡改 assets/README.md 一字节 → bin verify 2 → git checkout 恢复 PASS 110/110（资产为真值不反向改）；prepublish 链逐步前五步全绿 → 注入篡改 → 链尾 assets verify 2 断红 → 恢复 0；`npm run prepublishOnly` 全链真跑 exit 0；`npm pack --dry-run --json` 188 文件含 manifest 无泄漏；红→绿自证（分发禁用 9 fail → 恢复 9 pass）；typecheck 0 错 · npm test 522/522 · build + test:lib 6/6 · pins 17/17 · task lint PASS。逐项证据入 task 自检结论表。

## 未做（禁区）

- 未 tag / push / npm publish（仅人）· 未 bump 版本号（release 波）
- 未动 README 双语/事实卡/RELEASING.md/host-adapt schema（对外宣称口径归维护者 · RELEASING 双重敏感）
- 未用 --force/--allow-* 绕门禁 · 未 git add -A · S2 仅手写新增无覆写
- 未挂 build/prepare 自动生成钩子（D-23-W5-GEN-CMD · 防门禁消解）· 未并 pins · 未反向改任何资产

## 下一棒

00：task close --yes 归档 → 独立 commit `feat(2.3-W5): …`（逐路径 add）→ 交付报告。
