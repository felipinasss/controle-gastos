import { formatBRL } from '../domain/money'
import type { CardMonthInvoice } from '../domain/calculations'

interface CardInvoiceItemProps {
  invoice: CardMonthInvoice
  onToggle: (installmentIds: string[], currentlyAllPaid: boolean) => void
}

/** Linha agregada por cartão (modo "Por cartão") — soma todas as dívidas do cartão no mês */
export function CardInvoiceItem({ invoice, onToggle }: CardInvoiceItemProps) {
  const subtitle =
    invoice.count === 1 ? '1 parcela no mês' : `${invoice.count} parcelas no mês`

  return (
    <div className={`item${invoice.paid ? ' paid' : ''}`}>
      <div className="t">
        <b>{invoice.card}</b>
        <small>{subtitle}</small>
      </div>
      <div className="v">{formatBRL(invoice.amountCents)}</div>
      <button
        type="button"
        className="chk"
        aria-label={
          invoice.paid
            ? 'Desmarcar fatura do cartão como paga'
            : 'Marcar fatura do cartão como paga'
        }
        onClick={() => onToggle(invoice.installmentIds, invoice.paid)}
      >
        {invoice.paid ? '✓' : ''}
      </button>
    </div>
  )
}
