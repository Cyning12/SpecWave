# 03 · Waves 与验收（2.1.1）

> **状态**：`signed` · 隶属 `2_1_1-host-tools-ux` · W0–W4 DONE（**HG-PUBLISH** pending）

---

## W0 · 签收

- [x] `HG-NEXT-211=approved`  
- [x] `HG-SPEC-SIGNOFF=approved`（B-*；**UPDATE-DEFAULT=A 已冻**）  
- [x] UPDATE-DEFAULT **A**（维护者 2026-09-10）  
- [x] 拆 W1–W4 task  

## W1 · 粘性 + `--tools all`

- [x] `.coding-kit/host-tools.json` 读写  
- [x] apply/update 成功写粘性  
- [x] `--tools all` 测  
- [x] `HG-AUDIT-R1`（2026-09-10 · 00 代签） 

## W2 · update 缺省 = **A**

- [x] 有粘性：`host update --yes` 只用粘性 host_ids  
- [x] 无粘性 + 无 `--tools` → **exit 1**  
- [x] CHANGELOG 标明 vs 2.1.0「无参=全表」BREAKING 小  
- [x] `HG-AUDIT-R1`（2026-09-10 · 00 代签 · W1 CLOSE 后） 

## W3 · init 询问

- [x] TTY 询问测（可用 mock stdin）  
- [x] 非 TTY 无 `--tools` → exit 1  
- [x] `--tools none` 跳过物化  
- [x] `HG-AUDIT-R1`（2026-09-10 · 00 代签 · W2 CLOSE 后） 

## W4 · 文档完整更新 + 发版

- [x] **完整更新** [`assets/ide/host-adapt/README.md`](../../../assets/ide/host-adapt/README.md)（CLI · 粘性 · 子案 A · init · dogfood；**行为落地后再写**）  
- [x] 仓根 README / Demo「升包后 update」对齐  
- [x] bump `2.1.1` · 四门 · tag · **HG-PUBLISH** 仅人  
- [x] `HG-AUDIT-R1`（2026-09-10 · 00 代签 · W1–W3 CLOSE 后）  

---

## 产品验收

| # | 条款 |
|---|------|
| A1 | 升包后 `host update --yes` 能刷**已选**平台副本（粘性） |
| A2 | init 对齐 OpenSpec：交互或 `--tools` |
| A3 | 无 postinstall 静默写盘 |
| A4 | S2 / local / 跳过 30/40 保持 |
| A5 | `host-adapt/README.md` 与 2.1.1 行为 **全文一致**（非脚注补丁） |

---

## 修订

| 日期 | 摘要 |
|------|------|
| 2026-09-10 | draft |
| 2026-09-10 | 冻结 A；W4/A5 强制完整更新 host-adapt README |
