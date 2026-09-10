# invoke · 00 · npm=`spec-wave` 改签 CLOSE · 等人发版

> **hat_id**：`00` · **日期**：2026-09-10

## 结论

[Rename npm to spec-wave](12768b59-c59a-4d2a-b951-3ad1ba595351) · `name=spec-wave@2.1.1` · 三 bin · 四门绿  
`HG-PUBLISH` / `HG-DEPRECATE` 仍 pending · task 留 `active`。

## 维护者

```bash
npm publish
npm deprecate dsh-coding-kit@"*" "Package renamed to spec-wave@2.1.1 — use npm i spec-wave"
```

核验：`npm view spec-wave version` → `2.1.1`；`npx spec-wave --version`。

本窗未改实现码。
