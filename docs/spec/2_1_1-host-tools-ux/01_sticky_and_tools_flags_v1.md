# 01 · 粘性与 `--tools` 旗标（2.1.1）

> **状态**：`draft` · 隶属 `2_1_1-host-tools-ux`

---

## 1. 粘性文件

路径（建议）：`.coding-kit/host-tools.json`

```json
{
  "version": 1,
  "host_ids": ["cursor", "claude", "dsh", "agents"],
  "profile": "core",
  "updated_at": "2026-09-10T00:00:00.000Z",
  "kit_semver": "2.1.1"
}
```

- apply / update / init（含物化）成功后 **写入/更新**  
- 属过程根 `.coding-kit/`（与 init preset 一致）；**可入库**便于团队同选型  
- schema 校验失败 → 见 `00` failure_paths  

---

## 2. `--tools` 词表

| 值 | 含义 |
|----|------|
| `cursor,claude,dsh` | 逗号列表（现有） |
| `all` | 适配表全部 `host_id` |
| `none` | **仅 init**：跳过 host 物化（只做过程根等） |

`host apply`：**仍须** `--tools`（或 init 传入的等价选择）；禁止静默全表（与 OpenSpec 非交互须显式 tools 同精神）。

---

## 3. `host update` 解析序（**B-UPDATE-DEFAULT = A · 已冻结**）

1. 若 CLI 给了 `--tools` → 用 CLI（含 `all`）  
2. 否则若粘性存在且 `host_ids.length≥1` → 用粘性  
3. 否则 → **exit 1**（提示：先 `apply`/`init`，或传 `--tools LIST` / `--tools all`）

相对 2.1.0「省略 `--tools` = 适配表全量」为 **BREAKING 小**；CHANGELOG 与 W4 文档须明示。

升包后推荐：

```bash
npx dsh-coding-kit@2.1.1 host update --yes
```

---

## 4. 文档债（W4 · 强制）

实现合并前须 **完整更新**（非脚注补丁）：

- [`assets/ide/host-adapt/README.md`](../../../assets/ide/host-adapt/README.md) — CLI 形状、粘性、`update` 解析序 A、`init --tools`、dogfood 最短路径  

**W4 DONE（2026-09-10）**：全文已对齐 2.1.1（删除 2.1.0「无参=全表」与预告脚注）。

---

## 5. 修订

| 日期 | 摘要 |
|------|------|
| 2026-09-10 | draft |
| 2026-09-10 | 冻结子案 A；注明 host-adapt README W4 完整更新 |
