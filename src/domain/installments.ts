import { addMonths, maxYearMonth, monthsBetween } from './dates'
import type { CreateDebtInput, Debt, Installment, YearMonth } from './models'

/** Gera id numérico estável o bastante para uso local */
export function createDebtId(nowMs: number = Date.now()): number {
  return nowMs + Math.random()
}

function buildSubscriptionInstallment(
  debtId: number,
  monthlyCents: number,
  firstDueMonth: YearMonth,
  dueMonth: YearMonth,
): Installment {
  const number = monthsBetween(firstDueMonth, dueMonth) + 1
  return {
    id: `${debtId}-${dueMonth}`,
    debtId,
    number,
    dueMonth,
    amountCents: monthlyCents,
    paid: false,
  }
}

/**
 * Cria dívida e suas parcelas.
 * - Parcelada: última parcela absorve o resto da divisão em centavos.
 * - Assinatura: gera cobranças mensais de firstDueMonth até throughMonth (inclusive).
 */
export function createDebtWithInstallments(
  input: CreateDebtInput,
  id: number = createDebtId(),
  throughMonth?: YearMonth,
): { debt: Debt; installments: Installment[] } {
  const kind = input.kind === 'subscription' ? 'subscription' : 'installment'
  const { name, card, totalCents, firstDueMonth } = input

  if (kind === 'subscription') {
    const debt: Debt = {
      id,
      name,
      card,
      totalCents,
      installmentCount: 0,
      firstDueMonth,
      kind: 'subscription',
    }
    const end = throughMonth ? maxYearMonth(firstDueMonth, throughMonth) : firstDueMonth
    const installments = buildSubscriptionInstallments(debt, end)
    return { debt, installments }
  }

  const installmentCount = input.installmentCount
  const debt: Debt = {
    id,
    name,
    card,
    totalCents,
    installmentCount,
    firstDueMonth,
    kind: 'installment',
  }

  const base = Math.floor(totalCents / installmentCount)
  const installments: Installment[] = []

  for (let i = 0; i < installmentCount; i++) {
    const isLast = i === installmentCount - 1
    installments.push({
      id: `${id}-${i}`,
      debtId: id,
      number: i + 1,
      dueMonth: addMonths(firstDueMonth, i),
      amountCents: isLast ? totalCents - base * (installmentCount - 1) : base,
      paid: false,
    })
  }

  return { debt, installments }
}

/** Gera (ou re-gera a lista de) cobranças de assinatura até throughMonth */
export function buildSubscriptionInstallments(
  debt: Debt,
  throughMonth: YearMonth,
): Installment[] {
  if (debt.kind !== 'subscription') return []
  const end = maxYearMonth(debt.firstDueMonth, throughMonth)
  const span = monthsBetween(debt.firstDueMonth, end)
  const installments: Installment[] = []
  for (let i = 0; i <= span; i++) {
    const dueMonth = addMonths(debt.firstDueMonth, i)
    installments.push(
      buildSubscriptionInstallment(debt.id, debt.totalCents, debt.firstDueMonth, dueMonth),
    )
  }
  return installments
}

/**
 * Para cada assinatura, devolve parcelas que ainda não existem até throughMonth.
 */
export function missingSubscriptionInstallments(
  debts: Debt[],
  existing: Installment[],
  throughMonth: YearMonth,
): Installment[] {
  const existingIds = new Set(existing.map((p) => p.id))
  const missing: Installment[] = []

  for (const debt of debts) {
    if (debt.kind !== 'subscription') continue
    if (throughMonth < debt.firstDueMonth) continue
    for (const candidate of buildSubscriptionInstallments(debt, throughMonth)) {
      if (!existingIds.has(candidate.id)) missing.push(candidate)
    }
  }

  return missing
}

/** Soma valores em centavos */
export function sumCents(items: { amountCents: number }[]): number {
  return items.reduce((acc, item) => acc + item.amountCents, 0)
}

export function installmentsForDebt(
  installments: Installment[],
  debtId: number,
): Installment[] {
  return installments.filter((p) => p.debtId === debtId)
}

export function installmentsDueInMonth(
  installments: Installment[],
  month: YearMonth,
): Installment[] {
  return installments.filter((p) => p.dueMonth === month)
}
