# 留证 · 3.0.1 W1 A6 双向兼容（sticky table_source）

> **日期**：2026-09-18 · **hat**：30/40 · **对照**：审查文 [`task_3_0_1_w1_sticky_table_source_audit_R1_20260918.md`](./task_3_0_1_w1_sticky_table_source_audit_R1_20260918.md) §3.2 B

## 结论

**PASS（parse 等价留证）**：3.0.1 写入含 `table_source` 的 `.coding-kit/host-tools.json`，经 **3.0.0 读路径语义**不报错。

## 方法与限制

- **限制**：本机未执行 `npx spec-wave@3.0.0` 旧 CLI 读粘性烟测（无强制下载旧 tarball）。
- **等价留证**：`test/host-adapt-sticky-table-source.test.ts` · A6 用 `parseStickyLike300` 只取 3.0.0 已知字段（`version/host_ids/profile/updated_at/kit_semver?`），对 `table_source` **忽略且不校验**——与 3.0.0 `parseHostToolsSticky`「未知根字段不拒」行为一致。
- 正向：新解析路径仍可读 `table_source`；反向：旧解析不因新字段失败。

## 修订记录

| 日期 | 说明 |
|------|------|
| 2026-09-18 | A6 留证短注落盘 |
