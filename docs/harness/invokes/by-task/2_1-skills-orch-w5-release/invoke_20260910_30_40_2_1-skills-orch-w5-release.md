# Invoke · 30/40 · 2_1-skills-orch-w5-release

| 字段 | 值 |
|------|-----|
| task_slug | `2_1-skills-orch-w5-release` |
| hat_id | `30（含 40）` |
| opened | 2026-09-10 |
| status | **closed** |
| notes | 00 派发 · HG-AUDIT-R1=approved · **禁 npm publish** · HG-PUBLISH=pending · 30 CLOSE bump+tag |

## 开棒 Prompt

Open Folder = `dsh-coding-kit/`。读 task + R1 freeze。

1. 文档：README / DOGFOOD / `05` 对齐 2.1 能力  
2. bump **2.1.0** 全钉点 + CHANGELOG  
3. 四门绿  
4. git commit（release）+ annotated tag `v2.1.0`（**不 push** 除非另命）  
5. **绝对禁止** `npm publish`  
6. 回填 task；勾 `04` §W5 除 publish 外项  

## 40 自检（2026-09-10）

| 项 | 结果 |
|----|------|
| typecheck | exit 0 |
| test | exit 0（385 pass） |
| build | exit 0 |
| test:lib | exit 0 |
| npm publish | **未执行**（闸 pending） |
| git push | **未执行** |

## 修订

| 日期 | 摘要 |
|------|------|
| 2026-09-10 | 开棒 |
| 2026-09-10 | closed · bump 2.1.0 + tag · 待人 push/publish |
