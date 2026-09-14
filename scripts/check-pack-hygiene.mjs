#!/usr/bin/env node
// 2.3.1 N1 [P1] · 发布卫生机械断言（验收报告-SpecWave-2.3.0 §3.B / §6 建议 2.3.1）
// 断言 npm pack --dry-run 产物清单不得含非交付物：*.bak / *~ / .DS_Store（failClosed exit 2）。
// 根因教训：「未入库 ≠ 不发布」—— npm publish 读工作树而非 git 索引；.gitignore 不挡发布面。
// 接线：package.json prepublishOnly 末端。--ignore-scripts 防 prepare 递归构建（发布链路此前已完成 build）。
import { spawnSync } from 'node:child_process'

const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm'
const r = spawnSync(npmCmd, ['pack', '--dry-run', '--json', '--ignore-scripts'], {
  encoding: 'utf8',
  cwd: process.cwd(),
})
if (r.status !== 0) {
  console.error('PACK HYGIENE: FAIL · npm pack --dry-run 执行失败（exit ' + r.status + '）')
  process.exit(2)
}
let files
try {
  const data = JSON.parse(r.stdout)
  files = (Array.isArray(data) ? data[0] : data).files.map((f) => f.path)
} catch (e) {
  console.error('PACK HYGIENE: FAIL · npm pack --dry-run --json 输出不可解析: ' + e.message)
  process.exit(2)
}
const bad = files.filter((p) => /\.bak$/i.test(p) || /~$/.test(p) || /(^|\/)\.DS_Store$/.test(p))
if (bad.length > 0) {
  console.error('PACK HYGIENE: FAIL · 包内含非交付物（*.bak/*~/.DS_Store）→ 拒绝发布:')
  for (const p of bad) console.error('  - ' + p)
  process.exit(2)
}
const must = ['GLOSSARY.md', 'MIGRATION.md']
const missing = must.filter((m) => !files.includes(m))
if (missing.length > 0) {
  console.error('PACK HYGIENE: FAIL · 应交付文档缺包: ' + missing.join(', '))
  process.exit(2)
}
console.log(
  'PACK HYGIENE: PASS · ' + files.length + ' files · 无 *.bak/*~/.DS_Store · 含 ' + must.join(' / '),
)
