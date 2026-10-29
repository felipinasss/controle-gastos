import { debtProgress } from '../domain/calculations'
import { formatBRL } from '../domain/money'
import { isSubscription, type Debt, type Installment } from '../domain/models'

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
        const subscription = isSubscription(debt)
        const progress = subscription ? null : debtProgress(installments, debt)
        return (
          <div className="item" key={debt.id}>
            <div className="t">
              <b>{debt.name}</b>
              <small>
                {subscription ? (
                  <>
                    {debt.card} · {formatBRL(debt.totalCents)}/mês · assinatura
                  </>
                ) : (
                  <>
                    {debt.card} · {formatBRL(debt.totalCents)} · {progress!.paidCount}/
                    {debt.installmentCount} pagas
                  </>
                )}
              </small>
              {progress ? (
                <div className="bar" style={{ marginTop: 8 }} aria-hidden>
                  <i style={{ width: `${progress.fraction * 100}%` }} />
                </div>
              ) : null}
            </div>
            <button
              type="button"
              className="del"
              aria-label={subscription ? 'Excluir assinatura' : 'Excluir dívida'}
              onClick={async () => {
                const msg = subscription
                  ? 'Excluir esta assinatura e suas cobranças mensais?'
                  : 'Excluir esta dívida e suas parcelas?'
                if (!confirm(msg)) return
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
