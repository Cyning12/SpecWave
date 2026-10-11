# invoke · 00 统筹 · 3.3 W1–W4

| 项 | 内容 |
|----|------|
| **hat_id** | `00`（delegate-only） |
| **日期** | 2026-10-11 |
| **授权** | 维护者：「授权00签收后续所有文档，将W1~W4全部完成后再汇报」 |
| **分支** | 建议同支串行 `task/specwave-3-3-graph-ast`（或按波 `task/specwave-3-3-w*`） |
| **过程闸** | 00 可签各波 `HG-TASK-DRAFT` / `HG-AUDIT-R1`（须 lint + 20 PASS） |
| **禁区** | 本窗不亲自 30 改码；禁 `git add -A`；不 tag/push/`npm publish`（publish 仅人） |

## 编排

| Wave | 主题 | commit 时机 |
|------|------|-------------|
| W1 | 契约 / CLI 面（peer=skip0 · 不进 verify） | 关账后 `feat(3.3-W1): …` |
| W2 | AST symbol + 有界 call + 测 | 关账后 `feat(3.3-W2): …` |
| W3 | 文档分责（禁夸大 callgraph） | 关账后 `docs(3.3-W3): …` |
| W4 | bump 3.3.0 · ACCEPTANCE · CHANGELOG | 关账后 `chore(3.3-W4): …` · **禁** tag/publish |
| 收口 | 短报维护者 | push/PR **仅**当维护者另授 |

## 钉死契约（W1）

- 无 TS peer → **skip exit 0** + `skipped_reason`（不用 usage=1）  
- AST **不**注册进默认 `verify`  
- stub 波不得假绿假装已做深检  

## 本窗未改实现码

仅统筹 · 拆派 · 签过程闸 · 关账文档 · 适时 commit · 终态短报。
