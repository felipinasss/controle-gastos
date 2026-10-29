import { addMonths } from './dates'
import type { CreateDebtInput, Debt, Installment, YearMonth } from './models'

/** Gera id numérico estável o bastante para uso local */
export function createDebtId(nowMs: number = Date.now()): number {
  return nowMs + Math.random()
}

/**
 * Cria dívida e suas parcelas.
 * A última parcela absorve o resto da divisão em centavos.
 */
export function createDebtWithInstallments(
  input: CreateDebtInput,
  id: number = createDebtId(),
): { debt: Debt; installments: Installment[] } {
  const { name, card, totalCents, installmentCount, firstDueMonth } = input
  const debt: Debt = {
    id,
    name,
    card,
    totalCents,
    installmentCount,
    firstDueMonth,
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
