# invoke · 00 · 3.3.0 tag + push

| 项 | 内容 |
|----|------|
| **hat_id** | `00` |
| **日期** | 2026-10-11 |
| **触发** | 维护者本窗：「授权push+tag」 |
| **分支** | `task/specwave-3-3-graph-ast` |
| **tag** | `v3.3.0`（annotated · 对准 bump 后 tip · `package.json#version=3.3.0`） |

## 已办 / 将办

1. 回填 **HG-RELEASE-TAG-PUSH=approved**（task W4 · ACCEPTANCE · SPEC `04`）  
2. `git tag -a v3.3.0`  
3. `git push -u origin HEAD` + `git push origin v3.3.0`  
4. 复跑 `pins check` 期望 **17/17**  

## 未办（仅人）

- **HG-RELEASE-PUBLISH** · `npm publish` / `npm deprecate`  

## 禁区

- 本 invoke **不**授权 publish  
