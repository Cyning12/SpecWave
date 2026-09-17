#!/usr/bin/env node
// 2.3.1 N1 [P1] · 发布卫生机械断言（验收报告-SpecWave-2.3.0 §3.B / §6 建议 2.3.1）
// 断言 npm pack --dry-run 产物清单不得含非交付物：.bak 族（3.0-W5 NEW-6 通配语义）/ *~ / .DS_Store（failClosed exit 2）。
// 根因教训：「未入库 ≠ 不发布」—— npm publish 读工作树而非 git 索引；.gitignore 不挡发布面。
// 接线：package.json prepublishOnly 末端。--ignore-scripts 防 prepare 递归构建（发布链路此前已完成 build）。
//
// 【双控制点声明 · 3.0-W5 NEW-7（案 B 定稿 · 20 审 A3 机检双锚）】
// 本脚本控制点恰为两处，勿默认有额外双保险：
//   ① package.json prepublishOnly 链末端独立实跑本脚本（发布链路）；
//   ② test/pack-hygiene.test.ts 在 npm test 内实跑本脚本（正向 PASS + 负向 trap failClosed 自证 · CI 每 push npm test 覆盖 · .github/workflows/ci.yml）。
// 无第三控制点。机检双锚：锚①=本注释 grep 断言 · 锚②=测试实跑行存在断言（防注释在而实跑被摘）—— 均在 pack-hygiene.test.ts「NEW-7 双锚」用例。
//
// 【.bak 族通配语义 · 3.0-W5 NEW-6（fixture 变体全拦为硬判据 · F-W5-04 白名单口径）】
// 选型 /\.bak(\.|$|[0-9]| )/i（边界扩展式）：拦 .bak/.BAK（大小写）· .bak2 数字续段 · .bak.md 扩展段 · 尾空格「.bak 」· README.md.bak（readme 自动入包面）。
// 偏离 SPEC §5/PLAN 示例 /\.(bak|BAK)(\.|$| )/ 之理由（20 审已裁定口径：验收 binding 优先 · 示例非约束面 · 不回注 SPEC）：
//   示例字符集 (\.|$| ) 不含数字 → 拦不住 .bak2（task S5.1 ⚠️ 起草发现在案）；本选型补 [0-9] 类，fixture 四变体全拦实测在案。
// 误拦面分析（对照候选子串级 /\.bak/i：覆盖最全但误拦面最大 —— 拦 x.bakery / x.bakxt 等「.bak 后接字母」合法名）：
//   本选型命中面 = 「.bak + 点/数字/空格/结尾」= 备份衍生族语义内；合法名枚举（.bakery / .bakxt）不误拦，正向 fixture 钉死；
//   未来若有合法格式命中 → 白名单修正须评审（不通配到语义模糊面）。已知边界登记：目录级「dir.bak/文件」不在变体表内（不拦 · 超 fixture 边界不扩）。
// 与 package.json files 否定项分工（打包面与卫生门不分叉 · npm pack --dry-run 实测在案）：
//   glob 可表达面（打包层先滤）= !**/*.bak（npm glob nocase · 含 .BAK）+ !**/*.bak.*（扩展段）；
//   glob 不可表达面（本脚本通配兜住）= 数字续段 .bak2 · 尾空格「.bak 」· npm readme 自动入包规则面（README*.bak* 恒入包免疫否定项 · 既有 trap 先例）。
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
// 3.0-W5 NEW-6：.bak 族精确后缀 → 边界扩展通配（口径与误拦面分析见本文件头注释 · fixture 变体全拦为硬判据）
const bad = files.filter((p) => /\.bak(\.|$|[0-9]| )/i.test(p) || /~$/.test(p) || /(^|\/)\.DS_Store$/.test(p))
if (bad.length > 0) {
  console.error('PACK HYGIENE: FAIL · 包内含非交付物（.bak 族/*~/.DS_Store）→ 拒绝发布:')
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
