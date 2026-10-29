import type { ReactNode } from 'react'
import { DebtForm } from '../components/DebtForm'
import { DebtList } from '../components/DebtList'
import type { ExpenseStore } from '../hooks/useExpenseStore'

interface DebtsScreenProps {
  store: ExpenseStore
  /** Slot para ações de backup (export/import) — preenchido na etapa 6 */
  backupActions?: ReactNode
}

export function DebtsScreen({ store, backupActions }: DebtsScreenProps) {
  return (
    <>
      <DebtForm cardSuggestions={store.cardSuggestions} onSubmit={store.addDebt} />

      <div className="sec">
        <span>Minhas dívidas</span>
      </div>

      <DebtList
        debts={store.debts}
        installments={store.installments}
        onDelete={store.removeDebt}
      />

      {backupActions}

      <div className="foot">
        <button
          type="button"
          onClick={async () => {
            if (!confirm('Apagar todos os dados?')) return
            await store.resetAll()
          }}
        >
          Apagar todos os dados
        </button>
      </div>
    </>
  )
}
