# invoke · 30+40 · 2.3 W3 安全与可观测性补全 实现与验收闭环

> **hat_id**：`30` + `40`（同 Agent 闭环）· **日期**：2026-09-12  
> **task_slug**：`2-3-wiring-w3-security-observability`  
> **前置闸**：GATE_VERIFY PASS（HG-TASK-DRAFT / HG-AUDIT-R1 均 approved · 2026-09-12 维护者会话授权 00 代签）

## 实现清单（path:line · 终态）

| 文件 | 变更 |
|------|------|
| `package-lock.json` | js-yaml 4.2.0→4.3.2（`npm audit fix` · 区间内 lockfile-only · D-23-W3-AUDIT-GATE · package.json 未动） |
| `src/cli-shared.ts` | resolveTarget 拒止消息 `${target}` → `toRel(cwd, target)`；resolveTaskPath 越界消息绝对输入 → `toRel(target, taskFile)`（D-23-W3-REL-BASE） |
| `src/cli.ts` | 三处 --json `target` → `toRel(process.cwd(), target)`（gate-check :563 · verifySpecMode emitJson :658 · cmdVerify emitJson :789 终态行）· 未找到 --task/--spec 文件 ×3 + --spec 目录消息 → `toRel(target, abs)` · `exitWithCliError` 导出（信封单一实现源 · D-23-W3-ENVELOPE）· INIT_QUICKSTART 第 0 步 git 前提（:183-184） |
| `bin/specgate.js` · `bin/dsh-coding-kit.js` | 错误出口改接 `exitWithCliError`（bin 接线） |
| `.github/workflows/ci.yml` | 顶层 `permissions: contents: read` · 新增 `audit` job（`npm audit --audit-level=high` fail-closed）· 新增 `secrets-scan` job（gitleaks 8.28.0 钉版 + `--no-git` · D-23-W3-GITLEAKS-FORM） |
| `.github/workflows/tech-graph.yml` | 顶层 `permissions: contents: read` |
| `README.md` :101 · `README.zh-CN.md` :101 | quickstart 引用句补 git 前提（双语） |
| `docs/guides/provenance_oidc_trusted_publishing_guide_v1_zh.md` | C5 指引新增（首行「未启用 · 配置仅人」· 事实卡 §11 口径） |
| `CHANGELOG.md` Unreleased | 契约值变更明示（Changed · D-23-JSON-TARGET-REL）+ Added ×4 + Fixed ×2 |
| `test/cli-verify-observability.test.ts` | :149 联改（toRel + isAbsolute + absTokenHit）+ W3-B 组 ×5（两档相对化 / 三面零泄漏 / 信封 ×2 / 无信封回归） |
| `test/cli-flags.test.ts` | :147/:177 联改相对口径 |
| `test/init.test.ts` | ③ quickstart git 前提 + 三步骤结构 + 命令集合不膨胀断言 |
| `test/ci-workflow-security.test.ts` | 新增 ×4（顶层 permissions ×2 workflow + audit job + secrets-scan job） |
| `test/lib-smoke/cli-lib-smoke.test.ts` | S4 新增（bin 面信封钉面）+ RunResult.stdout |

## 验收自证（逐条 · 真实命令）

①–⑨ 全部实测通过，命令与输出摘详见 task 自检结论表（/tmp 靶场 bin 面终态：①a–e 零泄漏五面 · ②a–c 信封三档 · ④a/b quickstart 走通 · gitleaks 8.28.0 本地 0 泄漏 · npm audit 1 high→0 · typecheck 0 错 · npm test 505/505 · pins 17/17 · prepublishOnly 全链 exit 0）。

## 实现期擒获（留痕）

1. **bin 面信封缺口**：首版信封落 `isMain()` —— `bin/*.js` 自带 catch 不经 isMain，真实命令验收 ②a 当场擒获（src 测试全绿但 bin 无信封）→ `exitWithCliError` 单一实现源 + 双 bin 接线 + lib-smoke S4 钉面。（W2「负向 fixture 先行」教训的第二次实证：真实命令验收补齐了 fixture 的 bin 盲区。）
2. **lib 新鲜度副作用**：仓内 `npm pack` 类测试经 `prepare` 钩子副作用重建 lib/（src 套件不消费 lib · S0 漂移哨兵 + S4 守 bin 面真值）。
3. 负向先行：四测试文件实现前 12 fail（钉面真触发）→ 实现后 38/38。

## 门禁终态

`npm run typecheck` 0 错 · `npm test` 505/505（基线 495 + 新增 10）· `npm run build` + `npm run test:lib` 5/5 · `node bin/specgate.js pins check` 17/17 · `npm run prepublishOnly` 全链 exit 0 · RELEASING.md 零改动（git diff 0 行）。

## 下一棒

gate-check → task close --yes → 独立 commit `feat(2.3-W3): …`（逐路径 add · 禁 git add -A · 禁 tag/push/publish）→ 交付报告回 00。
