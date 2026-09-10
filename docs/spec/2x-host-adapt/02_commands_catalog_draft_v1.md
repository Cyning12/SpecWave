# 02 · Commands 目录草案（kit 动词）

> **状态**：`draft` · 隶属 `2x-host-adapt`  
> **命名**：建议统一前缀 `kit-`（Cursor 文件名 / Claude 路径按宿主适配）；**禁止**冒充 `/opsx-*`。  
> **正文纪律**：薄 POINTER + 必跑 CLI；不复制 L1/L2/hat 全文。

---

## 1. Core profile（默认）

| command_id | 用户可见名（示意） | 动作 | CLI / 工具真值 | 禁区 |
|------------|-------------------|------|----------------|------|
| `kit-apply-standards` | Apply coding standards | 指导调用注入 / 读 `.coding-kit` | DSH：`apply_coding_standards`；非 DSH：读 standards POINTER + 可选粘贴摘要 | 不静默改 S2 |
| `kit-verify` | Verify task gate | 编排跑 verify | `npx dsh-coding-kit verify --task …`；解释 exit **0/1/2** | 不得在对话里宣称「已通过」若 CLI≠0 |
| `kit-gate-status` | Gate / status | 扫人工闸与 status | `status` / 读 task 闸表 | 声称与闸表冲突 → STOP |
| `kit-init-guide` | Init kit in repo | 分清双入口 | 插件 `init_coding_kit` **或** CLI `init --preset harness-only` | 禁止混用两入口文案 |
| `kit-hat-reanchor` | Re-anchor hat | 长对话丢帽 | skill `harness-hat-reanchor` | 不替代 30 授权 |

---

## 2. Expanded profile（可选）

| command_id | 映射 | 说明 |
|------------|------|------|
| `kit-hat-10-spec` | skill `harness-10-spec` | 起草/修订 SPEC |
| `kit-hat-10-task` | skill `harness-10-task` | 起草/修订 task |
| `kit-hat-20-spec-audit` | skill `harness-20-spec-audit` | 审查落 `docs/harness/reviews/` |
| `kit-hat-20-task-audit` | skill `harness-20-task-audit` | 同上 |
| `kit-hat-00-delegate` | skill `harness-00-delegate-only` | 00 只委派 |
| `kit-graph-check` | `graph yaml check` / compile 指引 | 结构变更后 |
| `kit-sync-prompts-guide` | `sync prompts` dry-run 纪律 | 默认 dry-run；conflict 不覆盖 |
| `kit-onboard` | 端到端导览 | 对标 OpenSpec `/opsx:onboard`：**教学用**，不绕闸 |

### 明确不做（expanded 也禁止）

| 伪 command | 原因 |
|------------|------|
| `kit-execute` / `kit-30` 无闸版 | 绕过 `HG-AUDIT-R1`；30 进默认分发须过 T1 |
| `kit-publish` | 仅人 |
| `kit-archive-change`（OpenSpec 语义） | 非本产品主流程；消费者若并用 OpenSpec，各用各的前缀 |

---

## 3. Command 文件骨架（示意）

```markdown
---
description: Run dsh-coding-kit verify (failClosed exit 2)
---

你是 ops 编排助手，不是门禁本身。

1. Open Folder = 消费者仓根
2. 确认 task 路径（默认 docs/tasks/active/…）
3. 运行：
   npx dsh-coding-kit verify --task <path>
4. 按退出码汇报：0 通过 / 1 用法或非阻断 / 2 门禁阻断（硬停）
5. 禁止在 CLI 未跑或 exit≠0 时宣称闸已通过
6. 规范真值 POINTER：docs/standards/ · AGENTS.md · 勿粘贴全文
```

---

## 4. 物化与升级

| 课题 | 草案 |
|------|------|
| 安装 | `npx dsh-coding-kit host apply --tools cursor,claude --profile core`（命令名待 freeze） |
| 升级 | 对标 OpenSpec `update`：按 manifest 刷新 **产品块**；local 块永不覆写 |
| marker | 可延续 begin/end；commands 文件建议带 frontmatter `kit_command_id` + `kit_semver` |
| 与 refresh-ide-blocks | 仍管 **旧 marker 字面**；commands 树另册，避免混扫 |

---

## 5. 验收钩子（草案）

- [ ] core 五条在 Cursor 命令面板可见（物化后）  
- [ ] `kit-verify` 文档/命令明示 exit 2  
- [ ] 单测或 fixture：command 资产无 L1 全文拷贝（体积/漂移守卫）  
- [ ] DSH host 行允许 commands=空且 dogfood 不失败  

---

## 6. 修订记录

| 日期 | 摘要 |
|------|------|
| 2026-09-10 | 初稿：core/expanded 目录 + 禁区 |
