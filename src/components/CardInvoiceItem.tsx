import { formatBRL } from '../domain/money'
import type { CardMonthInvoice } from '../domain/calculations'

interface CardInvoiceItemProps {
  invoice: CardMonthInvoice
  onToggle: (installmentIds: string[], currentlyAllPaid: boolean) => void
}

function cardSubtitle(invoice: CardMonthInvoice): string {
  const parts: string[] = []
  if (invoice.parcelCount === 1) parts.push('1 parcela')
  else if (invoice.parcelCount > 1) parts.push(`${invoice.parcelCount} parcelas`)
  if (invoice.hasSubscription) parts.push('assinatura')
  return parts.length ? parts.join(' · ') : 'no mês'
}

/** Linha agregada por cartão (modo "Por cartão") — soma todas as dívidas do cartão no mês */
export function CardInvoiceItem({ invoice, onToggle }: CardInvoiceItemProps) {
  return (
    <div className={`item${invoice.paid ? ' paid' : ''}`}>
      <div className="t">
        <b>{invoice.card}</b>
        <small>{cardSubtitle(invoice)}</small>
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
