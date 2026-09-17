/**
 * 3.0 W7 TTY 色彩 hotfix · spawn env 单点取真源（唯一取值契约）。
 *
 * TTY 发布链下 node --test 会向测试子进程注入 FORCE_COLOR=1；测试再 spawn 被测脚本时
 * 若继承该变量，数字实参 `console.log('文件数:', 0)` 将被 util.inspect 着色为
 * `文件数: \u001b[33m0\u001b[39m`（A 机制）；若同时存在 ambient NO_COLOR=1，Node 还会向
 * stderr 打互斥警告污染 stdout/stderr 拼接（B 机制）。故凡断言子进程输出的 spawn 面，
 * 均须以本 helper 钉死采样环境，不继承 ambient FORCE_COLOR。
 */
export function plainEnv(): NodeJS.ProcessEnv {
  // 唯一取值（00 裁定 B1）：两键同置 —— FORCE_COLOR:'0' 保零着色且不触发互斥警告 · NO_COLOR:'1' 满足回归锁契约。
  return { ...process.env, FORCE_COLOR: '0', NO_COLOR: '1' }
}

/** 仅用于**断言**：还原被 FORCE_COLOR 注色的 stdout（禁用于采样/落盘）。 */
export function stripAnsi(s: string): string {
  return s.replace(/\u001b\[[0-9;]*[mK]/g, '')
}
