import { useMemo } from 'react'
import { CardInvoiceItem } from '../components/CardInvoiceItem'
import { InstallmentItem } from '../components/InstallmentItem'
import { LateAlert } from '../components/LateAlert'
import { MonthNav } from '../components/MonthNav'
import { Pendencias } from '../components/Pendencias'
import { Ring } from '../components/Ring'
import { SummaryCard } from '../components/SummaryCard'
import { groupMonthInvoicesByCard } from '../domain/calculations'
import { formatBRL } from '../domain/money'
import type { ExpenseStore } from '../hooks/useExpenseStore'

interface OverviewScreenProps {
  store: ExpenseStore
}

export function OverviewScreen({ store }: OverviewScreenProps) {
  const { monthSummary: m, globalSummary: g } = store
  const paidProgress = g.allInstallmentsCents
    ? ((g.allInstallmentsCents - g.totalUnpaidCents) / g.allInstallmentsCents) * 100
    : 0
  const installmentProgress = g.totalCount
    ? ((g.totalCount - g.unpaidCount) / g.totalCount) * 100
    : 0

  const cardInvoices = useMemo(
    () => groupMonthInvoicesByCard(store.monthInstallments, store.debts),
    [store.monthInstallments, store.debts],
  )

  return (
    <>
      <div className="card">
        <MonthNav month={store.month} onShift={store.shiftMonth} />
        <Ring
          fraction={m.paidFraction}
          centerValue={formatBRL(m.monthUnpaidCents)}
          centerLabel="a pagar no mês"
          leftValue={formatBRL(m.monthPaidCents)}
          leftLabel="Pago"
          rightValue={formatBRL(m.monthTotalCents)}
          rightLabel="Total do mês"
        />
      </div>

      <div className="stats">
        <SummaryCard
          label="Total a pagar"
          value={formatBRL(g.totalUnpaidCents)}
          progressPercent={paidProgress}
        />
        <SummaryCard
          label="Parcelas"
          value={`${g.unpaidCount} de ${g.totalCount}`}
          progressPercent={installmentProgress}
        />
        <SummaryCard
          label="Quita em"
          value={g.payoffLabel}
          progressPercent={g.payoffMonth ? 0 : 100}
        />
      </div>

      <LateAlert lateCents={g.lateCents} />

      <Pendencias
        parts={store.pendencias}
        groupBy={store.groupBy}
        onGroupByChange={store.setGroupBy}
      />

      <div className="sec" style={{ marginTop: 16 }}>
        <span>Faturas do mês</span>
      </div>

      {store.monthInstallments.length === 0 ? (
        <div className="empty">Nenhuma fatura neste mês.</div>
      ) : store.groupBy === 'card' ? (
        cardInvoices.map((invoice) => (
          <CardInvoiceItem
            key={invoice.card}
            invoice={invoice}
            onToggle={store.toggleCardMonthPaid}
          />
        ))
      ) : (
        store.monthInstallments.map((installment) => (
          <InstallmentItem
            key={installment.id}
            installment={installment}
            debt={store.debtById.get(installment.debtId)}
            onToggle={store.togglePaid}
          />
        ))
      )}
    </>
  )
}
