# 02 · Waves 与验收（SpecGate 改名）

> **状态**：`draft` · 隶属 `rename-specgate`

---

## W0 · 签收

- [ ] `HG-RENAME=approved`  
- [ ] `HG-SPEC-SIGNOFF=approved`（`spec-wave` · B-REPO · B-SEMVER）  
- [ ] 拆 W1–W4 task  

## W1 · 包身份双轨

- [ ] `package.json` name=`spec-wave` · 三 bin（`spec-wave` + `specgate` + `dsh-coding-kit`）  
- [ ] help/version/测钉  
- [ ] `HG-AUDIT-R1`  

## W2 · 文档与资产

- [x] README 双文件 · RELEASING · MIGRATION · assets/prompts/skills  
- [x] refresh 映射旧 `npx dsh-coding-kit` / `npx specgate` → `npx spec-wave`  
- [x] `HG-AUDIT-R1`  

## W3 · GitHub

- [ ] Rename → `SpecGate`（或备案新仓）  
- [ ] 旧 URL 浏览器可达新仓  
- [ ] CI / remote 核对  

## W4 · 发版

- [ ] `spec-wave` **HG-PUBLISH**（仅人）  
- [ ] `dsh-coding-kit` **HG-DEPRECATE**（仅人）  
- [ ] ACCEPTANCE 归档  

---

## 产品验收

| # | 条款 |
|---|------|
| A1 | `npm view spec-wave` 有版本 |
| A2 | 旧 GitHub URL 在 Rename 方案下可打开新仓 |
| A3 | 过渡期 `npx dsh-coding-kit` / `npx specgate` 仍可用（多 bin） |
| A4 | 旧包 deprecate 文案指向 `spec-wave` |
| A5 | 叙事：多宿主 CLI 为主 · DSH 可选 |

---

## 修订

| 日期 | 摘要 |
|------|------|
| 2026-09-10 | draft |
| 2026-09-10 | 包名 → `spec-wave`（E403 相似拒改签） |
