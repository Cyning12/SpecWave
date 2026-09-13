# invoke · 10-task · 2.3 W3 安全与可观测性补全 task 起草（SPEC 03 五项转可验收 task）

> **hat_id**：`10-task` · **日期**：2026-09-12  
> **task_slug**：`2-3-wiring-w3-security-observability`  
> **帽条文**：`assets/harness/prompts/10-task-requirements.md`

## 授权来源

维护者 2026-09-12 会话授权（00 委派 W3 实现棒走完整链路）· HG-TASK-DRAFT = approved（00 代签落表）；**HG-AUDIT-R1 = pending**（待 20-task-audit R1 审查文 + 签闸 · 本帽不代签）。

## R0 前提复核（本帽实测 · 全部成立 · 无 STOP 上报）

- `test/cli-verify-observability.test.ts:149` 钉 `payload.target === dir`（绝对路径）属实（SPEC §1 本棒复核一致）；**扩列联改面**：`test/cli-flags.test.ts:147/177` 两处同型绝对断言（verify + gate-check · SPEC 未点名 · 本帽 R0 补入范围⑥联改）。
- JSON `target` 三处绝对值源码定位：`src/cli.ts` verify emitJson :777 · verifySpecMode emitJson :654 · gate-check JSON :559；错误文案泄漏六点：`cli-shared.ts:62`（git 拒止）· `cli-shared.ts:348`（越界 · 插值用户输入）· `cli.ts:552/597`（未找到 --task）· `cli.ts:670/674`（--spec 未找到/目录）。
- exit 1 单点收口 `src/cli.ts:1168` isMain catch → 信封单点落位可行（F-W3-02 参数解析前错误同兜底）。
- `INIT_QUICKSTART`（:180-187）三步全文无 git 前提；README 双语 :101 引用句无 git 前提。
- `npm audit --audit-level=high` 现状 **1 high（js-yaml 4.2.0 · GHSA ×3）**；`npm audit fix --dry-run --json` 实证修复 = **4.3.2（`^4.1.0` 区间内 lockfile-only bump · 非 major）**。
- `ci.yml` / `tech-graph.yml` 无顶层 `permissions:` · 无扫描 job；事实卡 §11 provenance/OIDC 未启用禁称已核。
- pin-13 CHANGELOG 钉面 = regex `^## \[(\d+\.\d+\.\d+)\]` 首命中（非行号钉）→ Unreleased 加条目**不破钉**（`assets/release-pins.yaml:108-117` 核对）。
- 基线实测（干净树）：`npm test` 495/495 · `node bin/specgate.js pins check` 17/17 PASS。

## 动作

1. 起草 `docs/tasks/active/task_2_3_wiring_w3_security_observability.md`（蓝本 SPEC `docs/spec/2_3-wiring-completion/03_w3_security_observability_v1.md` signed）。
2. 预填 Harness 元信息：test_strategy=required / required_invoke_hats=`10,20,30,40,00` / git_branch=main / graph_delta=none / **wiki_delta=none（预填）** / invoke_retention_profile=default / close_pr_policy=exempt。
3. 范围六项：① toRel 相对化（三处 JSON target + 六点错误文案 + :149/flags 两处联改 + CHANGELOG 明示）；② exit 1 JSON 信封（isMain catch 单点）；③ quickstart git 前提（INIT_QUICKSTART 第 0 步提示行 + README 双语一句）；④ C4 CI（顶层 permissions ×2 workflow + audit job fail-closed + secrets-scan job）；⑤ C5 指引文档（docs/guides/ 独立落点 · RELEASING 零改动）；⑥ 测试扩组与联改。
4. **五决策 R2 定稿**：D-23-W3-REL-BASE（JSON 字段 cwd 基 · 错误文案分层基）· D-23-W3-ENVELOPE（单点 catch · stdout 通道 · stderr 人类文案保留 · exit 码不变）· D-23-W3-AUDIT-GATE（`npm audit fix` 修平后 fail-closed · 修漏洞本体非降级非放行）· D-23-W3-GITLEAKS-FORM（二进制钉版 + `--no-git` · 弃 gitleaks-action）· D-23-W3-C5-DOC（独立文档 · 口径「未启用 · 配置仅人」）。
5. 非范围显式列：gate-check/audit 四字段扩展 / C6 / C5 账号配置 / D4 i18n / 键集变更 / assertNotS2Abs·host 面文案 / RELEASING 改动 / gitleaks 历史档 / host schema / S2 CLI 写 / W4–W7 / 发版动作 / --force 禁新增。
6. 验收 9 条全部机械可断言（①–⑦ 对齐 SPEC 03 §7 · ⑧⑨ 纪律增补）+ failure_paths 8 行（F-W3-01..07 + F-T-01）+ R0–R5 思考轮槽 + 控制表（early_stop=R5 · residual_risks ×4）。
7. `node bin/specgate.js task lint --file docs/tasks/active/task_2_3_wiring_w3_security_observability.md` → **PASS**。

## 未做（禁区）

- 未改 `src/` / `test/` / `.github/` / `package*.json` / 任何文档面（30 的事 · 且 HG-AUDIT-R1=pending）
- 未签发 HG-AUDIT-R1（本帽不签发）
- 未执行 `npm audit fix`（改 lockfile · 归 30 第一步）
- 未执行 git tag / push / npm publish（仅人）
- 未扩大范围到 W4–W7 · 未碰 RELEASING.md / host-adapt schema

## 下一棒

20-task-audit R1 书面审 → 审查文落盘 `docs/harness/reviews/` + invoke_\*_20_\* → **签 HG-AUDIT-R1=approved**（2026-09-12 维护者会话授权 00 代签）→ 30/40（`feat(2.3-W3): …` · 禁 git add -A · 禁 tag/push/publish）。30 开工前须 `npx spec-wave verify --target . --task docs/tasks/active/task_2_3_wiring_w3_security_observability.md` 过闸扫描。
