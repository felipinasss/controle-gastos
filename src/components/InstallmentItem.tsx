import { formatBRL } from '../domain/money'
import type { Debt, Installment } from '../domain/models'

interface InstallmentItemProps {
  installment: Installment
  debt?: Debt
  onToggle: (id: string) => void
}

/** Linha de fatura por dívida (modo "Por dívida") */
export function InstallmentItem({ installment, debt, onToggle }: InstallmentItemProps) {
  const debtName = debt?.name ?? '?'
  const card = debt?.card ?? 'Sem cartão'
  const total = debt?.installmentCount ?? 0

  return (
    <div className={`item${installment.paid ? ' paid' : ''}`}>
      <div className="t">
        <b>{debtName}</b>
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
