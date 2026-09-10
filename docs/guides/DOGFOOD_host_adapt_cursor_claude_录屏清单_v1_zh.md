# 录屏 / 对照操作清单 · host-adapt（Cursor + Claude Code）

> **用途**：维护者按镜头发录屏或人工对照验收；**不是**产品 SPEC。  
> **包钉**：建议 `npx dsh-coding-kit@2.0.2`（registry 未更新前可用 `2.0.1` 验证能力；叙事以本仓 README 为准）  
> **Open Folder**：干净**临时演示仓**根（勿在 kit 源码仓乱写）  
> **配套 README**：仓根 `README.md` / `README.zh-CN.md`「一包多宿主」节

---

## 0. 开场口播（约 15s）

一句话：**同一 npm 包**可把规范入口物化到 **Cursor 命令面板** 与 **Claude Code slash**；闸的真值仍是终端 CLI exit 2，不是 markdown 假装通过。

展示包版本：

```bash
npm view dsh-coding-kit version
npx dsh-coding-kit --version
```

---

## 1. 准备干净演示仓（镜头 A）

```bash
DEMO=$(mktemp -d /tmp/dsh-kit-dogfood-XXXX)
cd "$DEMO"
git init
echo '# demo' > README.md
git add README.md && git commit -m 'init'
pwd   # 念出路径，证明不是 kit 源码仓
```

可选：先 `npx dsh-coding-kit@2.0.2 init --preset harness-only --yes`（过程根 `.coding-kit/`）；**host apply 不强制先 init**，但 init 利于后续 verify。

---

## 2. 只读校验（镜头 B）

```bash
npx dsh-coding-kit@2.0.2 host validate
# 期望：HOST VALIDATE: PASS · exit 0
```

故意失败（可选，证 failClosed）：

```bash
# 跳过亦可；有则展示 exit 2
```

---

## 3. dry-run 报告（镜头 C · 强调零写入）

```bash
npx dsh-coding-kit@2.0.2 host apply --tools cursor,claude --profile core --json
# 或人类可读：
npx dsh-coding-kit@2.0.2 host apply --tools cursor,claude --profile core
```

**口播核对**：stdout/JSON 中应出现计划路径，例如：

- `.cursor/rules/…mdc`
- `.cursor/commands/kit-verify.md`
- `CLAUDE.md`
- `.claude/commands/kit-verify.md`

然后：

```bash
ls -la .cursor 2>/dev/null || echo '（dry-run 后仍无 .cursor · 正确）'
test ! -f CLAUDE.md && echo 'CLAUDE.md 尚未写入 · dry-run 正确'
```

---

## 4. 写盘 apply（镜头 D）

```bash
npx dsh-coding-kit@2.0.2 host apply --tools cursor,claude --profile core --yes
# 期望：HOST APPLY: PASS · exit 0
```

树形断言（录屏时逐行展开）：

```bash
ls -la .cursor/rules/
ls -la .cursor/commands/
ls -la .claude/commands/
test -f CLAUDE.md && head -20 CLAUDE.md
test -f .cursor/commands/kit-verify.md && head -15 .cursor/commands/kit-verify.md
test -f .claude/commands/kit-init-guide.md && head -20 .claude/commands/kit-init-guide.md
```

**口播**：

- `kit-verify`：须跑 CLI，解释 exit **0/1/2**，禁止口头宣称闸过。  
- `kit-init-guide`：插件 `init_coding_kit` ≠ CLI `init`。

---

## 5. Cursor 侧（镜头 E · 本机 GUI）

1. Cursor → **Open Folder** = `$DEMO`  
2. 命令面板（⌘/Ctrl+Shift+P 或 Commands）搜 **`kit-verify`** / **`kit-gate-status`**  
3. 点开 `kit-verify`：念出「须跑 `npx dsh-coding-kit verify`」与 exit 2  
4. （可选）终端跑：

```bash
cd "$DEMO"
npx dsh-coding-kit@2.0.2 verify --task docs/tasks/active/无.md || true
# 无 task 时用法/阻断均可；重点是命令存在且 exit 语义可读
```

---

## 6. Claude Code 侧（镜头 F · 本机 GUI）

1. Claude Code → Open 同一 `$DEMO`  
2. 展示 `.claude/commands/` 下 `kit-*.md`（或 slash 列表中的 kit-*）  
3. 打开 `kit-hat-reanchor` / `kit-verify`：强调 POINTER、不贴 L1 全文  
4. 打开 `CLAUDE.md`：指出 `<!-- cyning-harness:begin -->` 产品块；若有 local 块则说明 **apply 不覆写 local**

---

## 7. local 不覆写（镜头 G · 可选 30s）

在 demo 仓：

```bash
cat >> CLAUDE.md <<'EOF'

<!-- cyning-harness-local:begin -->
LOCAL-MARKER-DO-NOT-TOUCH
<!-- cyning-harness-local:end -->
EOF

npx dsh-coding-kit@2.0.2 host apply --tools claude --profile core --yes
grep -n 'LOCAL-MARKER-DO-NOT-TOUCH' CLAUDE.md
# 期望：仍在
```

---

## 8. DSH 行不强迫 slash（镜头 H · 可选）

```bash
npx dsh-coding-kit@2.0.2 host apply --tools dsh --profile core --yes
test ! -d .cursor/commands && echo '未写 Cursor commands · 正确'
ls -la .dsh/skills 2>/dev/null | head
```

---

## 9. update / conflict（镜头 I · 可选）

```bash
echo 'user edited' >> .cursor/commands/kit-verify.md
npx dsh-coding-kit@2.0.2 host update --tools cursor --yes
# conflict：默认不覆盖
npx dsh-coding-kit@2.0.2 host update --tools cursor --yes --force
# --force 才覆盖（有备份目录可一闪）
ls .coding-kit/backups/host-update 2>/dev/null | tail
```

---

## 10. 收束口播（约 20s）

| 点 | 说辞 |
|----|------|
| 多平台 | Cursor + Claude Code **同一包** `host apply --tools cursor,claude` |
| 真值 | 闸 = CLI exit；command 只编排 |
| 双入口 | DSH 插件面 ≠ CLI `init` |
| 禁区 | 不默认装 30/40；不 Agent publish |

清理：

```bash
# 录屏结束后可删
# rm -rf "$DEMO"
```

---

## 对照勾选（人）

- [ ] dry-run 零写入  
- [ ] `--yes` 后 Cursor commands + Claude commands + CLAUDE.md 均存在  
- [ ] Cursor GUI 可见 kit-*  
- [ ] Claude Code GUI 可见 kit-*  
- [ ] local 块（若演示）仍在  
- [ ] README「一包多宿主」与本清单步骤一致  

## 修订

| 日期 | 摘要 |
|------|------|
| 2026-09-10 | 初版：配合 README 多宿主叙事 + 2.0.x 录屏 |
