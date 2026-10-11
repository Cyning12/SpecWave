# invoke · 00 · 3.3.0 tag + push

| 项 | 内容 |
|----|------|
| **hat_id** | `00` |
| **日期** | 2026-10-11 |
| **触发** | 维护者本窗：「授权push+tag」 |
| **分支** | `task/specwave-3-3-graph-ast` |
| **tag** | `v3.3.0` ↔ `197b337`（annotated · `package.json#version=3.3.0`） |

## 已办

1. 回填 **HG-RELEASE-TAG-PUSH=approved**（task W4 · ACCEPTANCE · SPEC `04`）· commit `197b337`  
2. `git tag -a v3.3.0`  
3. `git push -u origin HEAD` + `git push origin v3.3.0`（已上 remote）  
4. `pins check` **17/17** PASS  

## 未办（仅人）

- **HG-RELEASE-PUBLISH** · `npm publish` / `npm deprecate`  

## 禁区

- 本 invoke **不**授权 publish  
