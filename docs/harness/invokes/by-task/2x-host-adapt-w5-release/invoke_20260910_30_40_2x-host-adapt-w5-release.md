# Invoke · 30/40 · 2x-host-adapt-w5-release

> **hat**：30-execute → 40-self-check  
> **task**：`docs/tasks/active/task_2x_host_adapt_w5_release.md`  
> **日期**：2026-09-10  
> **HG-AUDIT-R1**：approved（00 代签）  
> **HG-PUBLISH**：pending（仅人）

---

## 30 执行要点

dogfood 临时仓 apply cursor+claude；四门绿；CHANGELOG 2.0.0；F5 钉点；bump + tag `v2.0.0`。**禁止 npm publish / git push。**

## 30 结果（2026-09-10）

### Dogfood

临时仓：`/tmp/dsh-kit-dogfood-2.0.0.8ALdYn`（干净 git init · 未改本仓工作树）

    node --experimental-strip-types src/cli.ts host apply --tools cursor,claude --profile core --yes --target <tmpdir>

- exit **0** · `HOST APPLY: PASS` · planned/written **26** · skipped 0 · conflict 0
- 断言：
  - OK `.cursor/commands/kit-verify.md`
  - OK `.cursor/rules/05-kit-starter.mdc`
  - OK `.claude/commands/kit-verify.md`
  - OK 产品块 `CLAUDE.md`

### 四门（bump 后复跑）

    npm run typecheck && npm test && npm run build && npm run test:lib

- **全绿**：typecheck OK · `npm test` **369 pass / 0 fail** · build OK · `test:lib` 4 pass
- D30-2 夹具：原 `version=2.0.0`（高于旧包 1.12.1）在本波等于现行包，改为 `2.1.0` 以保持「高于包版本 + kit 线 from_version」语义

### F5 钉点 → `2.0.0`

`package.json` · `ontology#product_semver` · `discipline-coverage#as_of_package_version` · README 双文件全部 `dsh-coding-kit@x.y.z` · 现行包版本硬编码测试同步。CHANGELOG Unreleased 归入 `## [2.0.0] - 2026-09-10`；发布状态 **git/tag 就绪 · 待人 npm publish**。

### pack

    npm pack --dry-run

- filename `dsh-coding-kit-2.0.0.tgz` · **154 files**
- **无** `test/` · `src/` · `docs/` · `SPEC.md` 泄漏（files 白名单）

### Git

- **未** `git push` · **未** `npm publish` · **未** `npm deprecate` · **未 CLOSE** task
- HG-PUBLISH 仍 pending（人 npm publish 未勾）

## 40 自检（`04` §W5）

- [ ] 四门绿 · F5 钉点 → `2.0.0`  
- [ ] dogfood：干净仓 apply cursor+claude  
- [ ] **人** `npm publish`（本棒不执行；闸仍 pending）  
- [ ] task 过程档关账（publish 项标「待人」）

## 修订记录

| 日期 | 摘要 |
|------|------|
| 2026-09-10 | 00 开棒 · 待 30 |
| 2026-09-10 | 30 bump/tag 就绪 · 待 40；**禁止 publish/push**；未 CLOSE |
