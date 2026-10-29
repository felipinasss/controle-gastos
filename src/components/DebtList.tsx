import { debtProgress } from '../domain/calculations'
import { formatBRL } from '../domain/money'
import type { Debt, Installment } from '../domain/models'

interface DebtListProps {
  debts: Debt[]
  installments: Installment[]
  onDelete: (debtId: number) => Promise<void>
}

export function DebtList({ debts, installments, onDelete }: DebtListProps) {
  if (debts.length === 0) {
    return <div className="empty">Cadastre sua primeira dívida acima.</div>
  }

  return (
    <>
      {debts.map((debt) => {
        const progress = debtProgress(installments, debt)
        return (
          <div className="item" key={debt.id}>
            <div className="t">
              <b>{debt.name}</b>
              <small>
                {debt.card} · {formatBRL(debt.totalCents)} · {progress.paidCount}/
                {debt.installmentCount} pagas
              </small>
              <div className="bar" style={{ marginTop: 8 }} aria-hidden>
                <i style={{ width: `${progress.fraction * 100}%` }} />
              </div>
            </div>
            <button
              type="button"
              className="del"
              aria-label="Excluir dívida"
              onClick={async () => {
                if (!confirm('Excluir esta dívida e suas parcelas?')) return
                await onDelete(debt.id)
              }}
            >
              ✕
            </button>
          </div>
        )
      })}
    </>
  )
}
