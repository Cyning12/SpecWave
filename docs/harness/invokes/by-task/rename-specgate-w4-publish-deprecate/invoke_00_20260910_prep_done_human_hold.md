# invoke · 00 · W4 准备档 CLOSE · 等人发版

> **hat_id**：`00` · **日期**：2026-09-10

## 结论

[W4 prep specgate release](638ed959-15e5-4a3d-83a9-7d28ef92c1fa) · 四门 exit 0 · ACCEPTANCE 已立  
`HG-PUBLISH` / `HG-DEPRECATE` 仍 **pending** · **禁** Agent publish/deprecate  
task 留 `active` 直至人发版并签闸。

## 维护者下一步

```bash
npm publish
npm deprecate dsh-coding-kit@"*" "Package renamed to spec-wave@2.1.1 — use npm i spec-wave"
```

签后：闸 → approved · 勾 task 验收 · 回填 ACCEPTANCE · 移 `done`。

本窗未改实现码。
