import { useRef, useState } from 'react'
import { expenseRepository } from '../data'
import type { ExpenseStore } from '../hooks/useExpenseStore'
import {
  buildBackup,
  downloadJson,
  parseBackup,
  serializeBackup,
} from '../utils/backup'

interface BackupActionsProps {
  store: ExpenseStore
}

export function BackupActions({ store }: BackupActionsProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)

  function handleExport() {
    const payload = buildBackup(store.debts, store.installments)
    const stamp = new Date().toISOString().slice(0, 10)
    downloadJson(`controle-gastos-backup-${stamp}.json`, serializeBackup(payload))
  }

  async function handleImport(file: File) {
    setBusy(true)
    try {
      const text = await file.text()
      const payload = parseBackup(text)
      if (
        !confirm(
          `Importar backup com ${payload.debts.length} dívida(s)? Os dados atuais serão substituídos.`,
        )
      ) {
        return
      }
      await expenseRepository.replaceAll(payload.debts, payload.installments)
      await store.refresh()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Falha ao importar backup.')
    } finally {
      setBusy(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div className="card backup">
      <div className="sec">
        <span>Backup</span>
      </div>
      <p className="backup-hint">
        Exporte um JSON com suas dívidas e parcelas, ou importe um backup anterior.
      </p>
      <div className="backup-actions">
        <button type="button" className="btn secondary" onClick={handleExport} disabled={busy}>
          Exportar JSON
        </button>
        <button
          type="button"
          className="btn secondary"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
        >
          Importar JSON
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="application/json,.json"
          hidden
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) void handleImport(file)
          }}
        />
      </div>
    </div>
  )
}
