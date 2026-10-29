import { describe, expect, it } from 'vitest'
import {
  computeGlobalSummary,
  computeMonthSummary,
  debtProgress,
  groupMonthInvoicesByCard,
  groupPendencias,
} from './calculations'
import { createDebtWithInstallments } from './installments'
import type { Debt, Installment } from './models'

function seed(): { debts: Debt[]; installments: Installment[] } {
  const a = createDebtWithInstallments(
    {
      name: 'Notebook',
      card: 'Cartão Nubank',
      totalCents: 600_000,
      installmentCount: 6,
      firstDueMonth: '2026-10',
    },
    1,
  )
  const b = createDebtWithInstallments(
    {
      name: 'Geladeira',
      card: 'Cartão Itaú',
      totalCents: 240_000,
      installmentCount: 4,
      firstDueMonth: '2026-09',
    },
    2,
  )
  return {
    debts: [a.debt, b.debt],
    installments: [...a.installments, ...b.installments],
  }
}

describe('computeMonthSummary', () => {
  it('calcula total, pago e a pagar do mês a partir das parcelas', () => {
    const { installments } = seed()
    const summary = computeMonthSummary(installments, '2026-10')
    // Notebook 100000 + Geladeira 60000
    expect(summary.monthTotalCents).toBe(160_000)
    expect(summary.monthPaidCents).toBe(0)
    expect(summary.monthUnpaidCents).toBe(160_000)
    expect(summary.paidFraction).toBe(0)
  })

  it('recalcula imediatamente após marcar parcela como paga', () => {
    const { installments } = seed()
    const target = installments.find(
      (p) => p.debtId === 1 && p.dueMonth === '2026-10',
    )!
    target.paid = true
    const summary = computeMonthSummary(installments, '2026-10')
    expect(summary.monthPaidCents).toBe(100_000)
    expect(summary.monthUnpaidCents).toBe(60_000)
    expect(summary.paidFraction).toBeCloseTo(100_000 / 160_000)
  })
})

describe('computeGlobalSummary', () => {
  it('total a pagar = soma das parcelas não pagas', () => {
    const { installments } = seed()
    const g = computeGlobalSummary(installments, '2026-10')
    expect(g.totalUnpaidCents).toBe(840_000)
    expect(g.allInstallmentsCents).toBe(840_000)
    expect(g.unpaidCount).toBe(10)
    expect(g.totalCount).toBe(10)
  })

  it('marca parcelas de meses anteriores como atraso', () => {
    const { installments } = seed()
    const g = computeGlobalSummary(installments, '2026-10')
    // Geladeira set/2026 = 60000
    expect(g.lateCents).toBe(60_000)
  })

  it('quita em = último mês com parcela em aberto', () => {
    const { installments } = seed()
    const g = computeGlobalSummary(installments, '2026-10')
    expect(g.payoffMonth).toBe('2027-03')
    expect(g.payoffLabel).toBe('mar/27')
  })
})

describe('groupPendencias', () => {
  it('agrupa por cartão ou por dívida', () => {
    const { debts, installments } = seed()
    const unpaid = installments.filter((p) => !p.paid)

    const byCard = groupPendencias(unpaid, debts, 'card')
    expect(byCard.map((s) => s.key)).toEqual(['Cartão Nubank', 'Cartão Itaú'])
    expect(byCard[0]?.amountCents).toBe(600_000)
    expect(byCard[0]?.percent).toBe(71)

    const byDebt = groupPendencias(unpaid, debts, 'debt')
    expect(byDebt.map((s) => s.key)).toEqual(['Notebook', 'Geladeira'])
  })
})

describe('debtProgress', () => {
  it('calcula progresso da dívida', () => {
    const { debts, installments } = seed()
    installments.filter((p) => p.debtId === 1).slice(0, 2).forEach((p) => {
      p.paid = true
    })
    const progress = debtProgress(installments, debts[0]!)
    expect(progress).toEqual({ paidCount: 2, total: 6, fraction: 2 / 6 })
  })
})

describe('groupMonthInvoicesByCard', () => {
  it('soma dívidas distintas no mesmo cartão em uma linha', () => {
    const a = createDebtWithInstallments(
      {
        name: 'Notebook',
        card: 'Cartão Nubank',
        totalCents: 600_000,
        installmentCount: 6,
        firstDueMonth: '2026-10',
      },
      1,
    )
    const b = createDebtWithInstallments(
      {
        name: 'Fone',
        card: 'Cartão Nubank',
        totalCents: 300_000,
        installmentCount: 3,
        firstDueMonth: '2026-10',
      },
      2,
    )
    const month = [...a.installments, ...b.installments].filter(
      (p) => p.dueMonth === '2026-10',
    )
    const grouped = groupMonthInvoicesByCard(month, [a.debt, b.debt])
    expect(grouped).toHaveLength(1)
    expect(grouped[0]?.card).toBe('Cartão Nubank')
    expect(grouped[0]?.amountCents).toBe(200_000)
    expect(grouped[0]?.count).toBe(2)
    expect(grouped[0]?.paid).toBe(false)
  })
})
