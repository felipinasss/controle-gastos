import { formatMonthShort } from './dates'
import { sumCents } from './installments'
import type {
  Debt,
  Installment,
  PendenciasGroupBy,
  YearMonth,
} from './models'

export interface MonthSummary {
  /** Soma de todas as parcelas do mês */
  monthTotalCents: number
  /** Parcelas pagas do mês */
  monthPaidCents: number
  /** Parcelas em aberto do mês */
  monthUnpaidCents: number
  /** Fração paga no mês (0–1) */
  paidFraction: number
}

export interface GlobalSummary {
  /** Soma de todas as parcelas (histórico) */
  allInstallmentsCents: number
  /** Soma das parcelas não pagas */
  totalUnpaidCents: number
  unpaidCount: number
  totalCount: number
  /** Centavos em atraso (vencimento < mês atual e não pagas) */
  lateCents: number
  /** Último mês com parcela em aberto, ou null */
  payoffMonth: YearMonth | null
  payoffLabel: string
}

export interface PendenciaSlice {
  key: string
  amountCents: number
  percent: number
}

export function computeMonthSummary(
  installments: Installment[],
  month: YearMonth,
): MonthSummary {
  const ofMonth = installments.filter((p) => p.dueMonth === month)
  const monthTotalCents = sumCents(ofMonth)
  const monthPaidCents = sumCents(ofMonth.filter((p) => p.paid))
  const monthUnpaidCents = monthTotalCents - monthPaidCents
  return {
    monthTotalCents,
    monthPaidCents,
    monthUnpaidCents,
    paidFraction: monthTotalCents ? monthPaidCents / monthTotalCents : 0,
  }
}

export function computeGlobalSummary(
  installments: Installment[],
  currentMonth: YearMonth,
): GlobalSummary {
  const unpaid = installments.filter((p) => !p.paid)
  const allInstallmentsCents = sumCents(installments)
  const totalUnpaidCents = sumCents(unpaid)
  const lateCents = sumCents(unpaid.filter((p) => p.dueMonth < currentMonth))
  const payoffMonth = unpaid.length
    ? unpaid.map((p) => p.dueMonth).sort().at(-1) ?? null
    : null

  return {
    allInstallmentsCents,
    totalUnpaidCents,
    unpaidCount: unpaid.length,
    totalCount: installments.length,
    lateCents,
    payoffMonth,
    payoffLabel: payoffMonth ? formatMonthShort(payoffMonth) : '—',
  }
}

export function groupPendencias(
  unpaid: Installment[],
  debts: Debt[],
  groupBy: PendenciasGroupBy,
): PendenciaSlice[] {
  const debtById = new Map(debts.map((d) => [d.id, d]))
  const totals = new Map<string, number>()

  for (const p of unpaid) {
    const debt = debtById.get(p.debtId)
    if (!debt) continue
    const key = groupBy === 'card' ? debt.card : debt.name
    totals.set(key, (totals.get(key) ?? 0) + p.amountCents)
  }

  const totalUnpaid = [...totals.values()].reduce((a, b) => a + b, 0)
  return [...totals.entries()]
    .map(([key, amountCents]) => ({
      key,
      amountCents,
      percent: totalUnpaid ? Math.round((amountCents / totalUnpaid) * 100) : 0,
    }))
    .sort((a, b) => b.amountCents - a.amountCents)
}

/** Progresso de pagamento de uma dívida (parcelas pagas / total) */
export function debtProgress(
  installments: Installment[],
  debt: Debt,
): { paidCount: number; total: number; fraction: number } {
  const ofDebt = installments.filter((p) => p.debtId === debt.id)
  const paidCount = ofDebt.filter((p) => p.paid).length
  const total = debt.installmentCount
  return {
    paidCount,
    total,
    fraction: total ? paidCount / total : 0,
  }
}

export interface CardMonthInvoice {
  card: string
  amountCents: number
  installmentIds: string[]
  count: number
  /** true só se todas as parcelas do cartão no mês estiverem pagas */
  paid: boolean
}

/** Agrupa faturas do mês por cartão, somando valores de dívidas distintas */
export function groupMonthInvoicesByCard(
  monthInstallments: Installment[],
  debts: Debt[],
): CardMonthInvoice[] {
  const debtById = new Map(debts.map((d) => [d.id, d]))
  const groups = new Map<
    string,
    { amountCents: number; installmentIds: string[]; count: number; unpaid: number }
  >()

  for (const p of monthInstallments) {
    const debt = debtById.get(p.debtId)
    const card = debt?.card || 'Sem cartão'
    const current = groups.get(card) ?? {
      amountCents: 0,
      installmentIds: [],
      count: 0,
      unpaid: 0,
    }
    current.amountCents += p.amountCents
    current.installmentIds.push(p.id)
    current.count += 1
    if (!p.paid) current.unpaid += 1
    groups.set(card, current)
  }

  return [...groups.entries()]
    .map(([card, g]) => ({
      card,
      amountCents: g.amountCents,
      installmentIds: g.installmentIds,
      count: g.count,
      paid: g.unpaid === 0,
    }))
    .sort((a, b) => Number(a.paid) - Number(b.paid) || a.card.localeCompare(b.card, 'pt-BR'))
}
