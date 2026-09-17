// DEF-003 阶段二 T3/T4：verify / lifecycle dry-run / status 共用的检查实现（单一实现源，不复制逻辑）。
// 本模块由 cli.ts（verify / audit / task lint）· cli-lifecycle.ts（dry-run 守卫 adapter）·
// cli-status.ts（status 投影）三方消费。
// 3.0 W0（E4 · task_3_0_w0_refactor_prep 模块边界定稿表）：实现搬迁至 src/checks/*
//（invoke-hats / close-guards / review-gates / exempt / test-artifacts / lint），
// 本文件降级为纯 barrel——re-export 全部 43 个既有导出，消费者一行不改（D-30-BARREL · 零行为变更）。
export {
  PRE30_HATS,
  extractHatsFromInvokeName,
  resolveRequiredInvokeHats,
  collectInvokeHats,
  missingInvokeHats,
  checkPre30InvokeHats,
} from './checks/invoke-hats.ts'
export {
  UNCHECKED_RE,
  CLOSE_STATUSES,
  taskTargetRoot,
  evalCloseSlug,
  evalCloseSelfCheck,
  evalCloseAcceptance,
  evalCloseStatus,
  evalCloseInvokeHats,
  evalCloseReview,
  evalCloseExecEvidence,
  evalCloseGraphDelta,
  evalCloseKpi,
  evalCloseExperience,
  evalCloseWikiDelta,
  evalCloseWikiPromotion,
  isCloseHubGateEnabled,
  findHubFile,
  resolvePrMergedState,
  evalClosePrMerged,
  evalCloseHubIndex,
  listBareSpecFiles,
  evalCloseGuard,
} from './checks/close-guards.ts'
export type { CloseGuardOutcome } from './checks/close-guards.ts'
export {
  extractSpecSlug,
  shouldSkipSpecAudit,
  findSpecReview,
  evalSpecReviewsRetention,
  findLatestReview,
  findReview,
  evalReviewConclusion,
} from './checks/review-gates.ts'
export { LEGACY_GATE_EXEMPT_REL, loadLegacyGateExempt, resolveExemptEntry } from './checks/exempt.ts'
export type { LegacyGateExemptEntry, LegacyGateExempt } from './checks/exempt.ts'
export { runTestCheck } from './checks/test-artifacts.ts'
export { evalThinkingRoundStructure, PLACEHOLDER_RE, lintTaskFile } from './checks/lint.ts'
export type { LintIssue } from './checks/lint.ts'
