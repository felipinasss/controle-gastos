import { InstallmentItem } from '../components/InstallmentItem'
import { LateAlert } from '../components/LateAlert'
import { MonthNav } from '../components/MonthNav'
import { Pendencias } from '../components/Pendencias'
import { Ring } from '../components/Ring'
import { SummaryCard } from '../components/SummaryCard'
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
      ) : (
        [...store.monthInstallments]
          .sort((a, b) => {
            if (store.groupBy !== 'card') return 0
            const cardA = store.debtById.get(a.debtId)?.card ?? ''
            const cardB = store.debtById.get(b.debtId)?.card ?? ''
            return cardA.localeCompare(cardB, 'pt-BR') || Number(a.paid) - Number(b.paid)
          })
          .map((installment) => (
            <InstallmentItem
              key={installment.id}
              installment={installment}
              debt={store.debtById.get(installment.debtId)}
              groupBy={store.groupBy}
              onToggle={store.togglePaid}
            />
          ))
      )}
    </>
  )
}
