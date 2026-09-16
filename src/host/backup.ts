import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  renameSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs'
import path from 'node:path'
import { kitLayoutJoin, toRel } from '../cli-shared.ts'

const BACKUP_KEEP = 5

export type BackupFamily = 'host-apply' | 'host-update'

export function backupsRoot(target: string, family: BackupFamily): string {
  return kitLayoutJoin(target, 'backups', family)
}

export function backupFile(target: string, genDir: string, rel: string): string {
  const src = path.join(target, rel)
  const dest = path.join(genDir, rel)
  mkdirSync(path.dirname(dest), { recursive: true })
  copyFileSync(src, dest)
  return dest
}

export function atomicWrite(abs: string, body: string): void {
  mkdirSync(path.dirname(abs), { recursive: true })
  const tmp = `${abs}.tmp-host-apply-${process.pid}`
  writeFileSync(tmp, body, 'utf8')
  renameSync(tmp, abs)
}

export function pruneBackups(target: string, family: BackupFamily): void {
  const root = backupsRoot(target, family)
  if (!existsSync(root)) return
  const gens = readdirSync(root)
    .filter((n) => statSync(path.join(root, n)).isDirectory())
    .sort()
  for (const old of gens.slice(0, Math.max(0, gens.length - BACKUP_KEEP))) {
    rmSync(path.join(root, old), { recursive: true, force: true })
  }
}

export function ensureBackupGen(
  target: string,
  family: BackupFamily,
  genDir: string | null,
): { genDir: string; backup: string } {
  if (genDir) return { genDir, backup: toRel(target, genDir) }
  const ts = new Date().toISOString().replace(/[:.]/g, '-')
  const next = path.join(backupsRoot(target, family), ts)
  mkdirSync(next, { recursive: true })
  return { genDir: next, backup: toRel(target, next) }
}
