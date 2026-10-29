import type { Debt, Installment } from '../domain/models'

export const BACKUP_VERSION = 1 as const

export interface BackupPayload {
  version: typeof BACKUP_VERSION
  exportedAt: string
  debts: Debt[]
  installments: Installment[]
}

export function buildBackup(debts: Debt[], installments: Installment[]): BackupPayload {
  return {
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    debts,
    installments,
  }
}

export function serializeBackup(payload: BackupPayload): string {
  return JSON.stringify(payload, null, 2)
}

export function parseBackup(raw: string): BackupPayload {
  let data: unknown
  try {
    data = JSON.parse(raw)
  } catch {
    throw new Error('Arquivo JSON inválido.')
  }

  if (!data || typeof data !== 'object') {
    throw new Error('Backup sem estrutura válida.')
  }

  const obj = data as Record<string, unknown>
  if (!Array.isArray(obj.debts) || !Array.isArray(obj.installments)) {
    throw new Error('Backup precisa conter debts e installments.')
  }

  return {
    version: BACKUP_VERSION,
    exportedAt: typeof obj.exportedAt === 'string' ? obj.exportedAt : new Date().toISOString(),
    debts: obj.debts as Debt[],
    installments: obj.installments as Installment[],
  }
}

export function downloadJson(filename: string, content: string) {
  const blob = new Blob([content], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
