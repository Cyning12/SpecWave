// provenance · 3.0 W7 S7.8 证据镜像（硬约束 14 · F-W7-04）
// 来源（仅本地草稿 · 非 tracked）: .workbuddy/output/_frag/exports_probe_20260916.mjs
// 镜像日期: 2026-09-17 · 文件名带来源+日期 · 内容不改写（仅本头部注记）· 以 tracked 镜像为真值面
const cases = [
  'spec-wave',
  'spec-wave/lib/cli.js',
  'spec-wave/lib/cli-checks.js',
  'spec-wave/lib/cli-host.js',
  'spec-wave/lib/index.js',
  'spec-wave/cordis.patch.yml',
  'spec-wave/package.json',
]
for (const c of cases) {
  try {
    const r = await import.meta.resolve(c)
    console.log('OK        ' + c + '  ->  ' + r)
  } catch (e) {
    console.log('BLOCKED   ' + c + '  (' + (e.code || e.message) + ')')
  }
}
console.log('')
console.log('node=' + process.version)
