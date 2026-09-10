# Host-adapt · skills 落点矩阵

> 适配表示例：[`examples/mvp-hosts.yaml`](./examples/mvp-hosts.yaml)  
> Schema：[`host-adapt.schema.json`](./host-adapt.schema.json)

`host apply` / `host update` 按表物化 **skills**（源 `assets/skills/*`）。默认**跳过** `harness-30-execute` / `harness-40-self-check`（与 `skills install` 同一套 `EXECUTE_HAT_DIRS` / `isExecuteHatSkipped`，禁止 `--with-execute-hats`）。

| host_id | skills 落点 | 与 skills install |
|---------|-------------|-------------------|
| dsh | `.dsh/skills` | 与 `skills install --target` 默认 dest 一致 |
| cursor | `.cursor/skills` | host-adapt 额外 IDE 落点 |
| claude | `.claude/skills` | 同上 |
| agents | `.agents/skills` | 同上 |

- **apply**：缺失则写入；内容相同 skip；commands 不同则覆写（W2 纪律）。W3 起同时物化 skills。
- **update**：刷新产品 commands + skills（always_on 产品块按 apply 同纪律刷新，local 永不覆写）。目标已存在且内容不同 → **conflict，默认 skip**；`--force` 才覆盖（先备份 `.coding-kit/backups/host-update/<UTCts>/`，保留 5 代）。
