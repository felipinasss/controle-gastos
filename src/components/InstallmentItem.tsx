import { formatBRL } from '../domain/money'
import type { Debt, Installment, PendenciasGroupBy } from '../domain/models'

interface InstallmentItemProps {
  installment: Installment
  debt?: Debt
  groupBy: PendenciasGroupBy
  onToggle: (id: string) => void
}

export function InstallmentItem({
  installment,
  debt,
  groupBy,
  onToggle,
}: InstallmentItemProps) {
  const debtName = debt?.name ?? '?'
  const card = debt?.card ?? 'Sem cartão'
  const total = debt?.installmentCount ?? 0

  const title = groupBy === 'card' ? card : debtName
  const subtitle =
    groupBy === 'card'
      ? `${debtName} · parcela ${installment.number}/${total}`
      : `${card} · parcela ${installment.number}/${total}`

  return (
    <div className={`item${installment.paid ? ' paid' : ''}`}>
      <div className="t">
        <b>{title}</b>
        <small>{subtitle}</small>
      </div>
      <div className="v">{formatBRL(installment.amountCents)}</div>
      <button
        type="button"
        className="chk"
        aria-label={installment.paid ? 'Desmarcar como paga' : 'Marcar como paga'}
        onClick={() => onToggle(installment.id)}
      >
        {installment.paid ? '✓' : ''}
      </button>
    </div>
  )
}
