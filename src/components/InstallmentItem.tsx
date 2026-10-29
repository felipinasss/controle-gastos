import { formatBRL } from '../domain/money'
import type { Debt, Installment } from '../domain/models'

interface InstallmentItemProps {
  installment: Installment
  debt?: Debt
  onToggle: (id: string) => void
}

export function InstallmentItem({ installment, debt, onToggle }: InstallmentItemProps) {
  const name = debt?.name ?? '?'
  const card = debt?.card ?? ''
  const total = debt?.installmentCount ?? 0

  return (
    <div className={`item${installment.paid ? ' paid' : ''}`}>
      <div className="t">
        <b>{name}</b>
        <small>
          {card} · parcela {installment.number}/{total}
        </small>
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
