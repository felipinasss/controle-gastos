import { addMonths, currentYearMonth } from '../../domain/dates'
import { createDebtWithInstallments } from '../../domain/installments'
import type { Debt, Installment } from '../../domain/models'

/** Mesmos demos do protótipo HTML */
export function buildDemoData(now: Date = new Date()): {
  debts: Debt[]
  installments: Installment[]
} {
  const current = currentYearMonth(now)
  const notebook = createDebtWithInstallments(
    {
      name: 'Notebook',
      card: 'Cartão Nubank',
      totalCents: 600_000,
      installmentCount: 6,
      firstDueMonth: current,
    },
    1,
  )
  const fridge = createDebtWithInstallments(
    {
      name: 'Geladeira',
      card: 'Cartão Itaú',
      totalCents: 240_000,
      installmentCount: 4,
      firstDueMonth: addMonths(current, -1),
    },
    2,
  )

  return {
    debts: [notebook.debt, fridge.debt],
    installments: [...notebook.installments, ...fridge.installments],
  }
}
