import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'
import { parseHarnessMeta, resolveTaskPath } from '../cli-shared.ts'

function walkFiles(dir: string, depth: number, acc: string[]): void {
  if (depth < 0 || !existsSync(dir)) return
  let names: string[]
  try {
    names = readdirSync(dir)
  } catch {
    return
  }
  for (const name of names) {
    if (name === 'node_modules' || name.startsWith('.')) continue
    const full = path.join(dir, name)
    acc.push(full)
    try {
      if (statSync(full).isDirectory()) walkFiles(full, depth - 1, acc)
    } catch {
      // 忽略瞬时文件
    }
  }
}

// D5 CI 测试步骤匹配模式（DEF-014）：workflow 文本命中任一模式才算「CI 含 test 步骤」
const CI_TEST_STEP_PATTERNS: RegExp[] = [
  /\bpytest\b/,
  /\bvitest\b/,
  /\bjest\b/,
  /\bnpm\s+(run\s+)?test\b/,
  /\bpnpm\s+(run\s+)?test\b/,
  /\byarn\s+test\b/,
  /\bnode\s+--test\b/,
  /\bgo\s+test\b/,
  /\bcargo\s+test\b/,
  /\btox\b/,
  /\bunittest\b/,
  /^\s*-?\s*name\s*:.*\btest\b/im,
]

function workflowHasTestStep(text: string): boolean {
  return CI_TEST_STEP_PATTERNS.some((re) => re.test(text))
}

function listWorkflowFiles(ciDir: string): string[] {
  try {
    return readdirSync(ciDir).filter((f) => f.endsWith('.yml') || f.endsWith('.yaml'))
  } catch {
    return []
  }
}

// 收紧后的 D5 探测（DEF-014）：强信号探针 + 测试文件名 + CI 含 test 步骤
function hasTestArtifacts(target: string): boolean {
  const probes = [
    'test',
    'tests',
    'spec',
    'specs',
    '__tests__',
    'jest.config.js',
    'jest.config.ts',
    'vitest.config.js',
    'vitest.config.ts',
    'playwright.config.js',
    'playwright.config.ts',
    'cypress.config.js',
    'pytest.ini',
  ]
  for (const p of probes) {
    if (existsSync(path.join(target, p))) return true
  }
  const found: string[] = []
  walkFiles(target, 3, found)
  const testName = /\.(test|spec)\.(js|ts|mjs|cjs)$|_test\.py$|^test_.*\.py$/
  if (found.some((f) => testName.test(path.basename(f)))) return true
  const ciDir = path.join(target, '.github', 'workflows')
  if (existsSync(ciDir)) {
    for (const f of listWorkflowFiles(ciDir)) {
      try {
        if (workflowHasTestStep(readFileSync(path.join(ciDir, f), 'utf8'))) return true
      } catch {
        // 忽略不可读 workflow，继续检查其余文件
      }
    }
  }
  return false
}

// 1.5.0 硬化（DEF-014 过渡结束）：旧启发式（pyproject.toml / setup.py / 任意 workflow 存在）
// 不再放行 —— 新探测失败即 FAIL（verify BLOCKED exit 2 · audit FAIL exit 2）。
export function runTestCheck(
  target: string,
  taskFile: string | undefined,
): { ok: boolean; reason: string } {
  if (!taskFile) return { ok: true, reason: '未指定 --task，跳过 D5' }
  const abs = resolveTaskPath(target, taskFile)
  if (!existsSync(abs)) return { ok: true, reason: 'task 文件不存在，跳过 D5' }
  const content = readFileSync(abs, 'utf8')
  const meta = parseHarnessMeta(content)
  const strategy = (meta.test_strategy || '').trim()
  if (strategy !== 'required') {
    return { ok: true, reason: `test_strategy=${strategy || 'unset'}，无需 D5 强检查` }
  }
  if (hasTestArtifacts(target)) {
    return { ok: true, reason: 'test_strategy=required 且检测到测试/CI 制品' }
  }
  return {
    ok: false,
    reason: 'D5: test_strategy=required 但目标仓未声明测试路径或 CI 引用',
  }
}
