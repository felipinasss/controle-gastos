import { DebtForm } from '../components/DebtForm'
import { DebtList } from '../components/DebtList'
import type { ExpenseStore } from '../hooks/useExpenseStore'

interface DebtsScreenProps {
  store: ExpenseStore
}

export function DebtsScreen({ store }: DebtsScreenProps) {
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
