import { describe, expect, it } from 'vitest'
import { createDebtWithInstallments, sumCents } from './installments'

describe('createDebtWithInstallments', () => {
  it('gera N parcelas com a última absorvendo o resto', () => {
    const { debt, installments } = createDebtWithInstallments(
      {
        name: 'Notebook',
        card: 'Cartão Nubank',
        totalCents: 600_000,
        installmentCount: 6,
        firstDueMonth: '2026-10',
      },
      1,
    )

    expect(debt.id).toBe(1)
    expect(installments).toHaveLength(6)
    expect(installments.every((p) => p.amountCents === 100_000)).toBe(true)
    expect(sumCents(installments)).toBe(600_000)
    expect(installments.map((p) => p.dueMonth)).toEqual([
      '2026-10',
      '2026-11',
      '2026-12',
      '2027-01',
      '2027-02',
      '2027-03',
    ])
    expect(installments.every((p) => !p.paid)).toBe(true)
  })

  it('última parcela absorve resto quando a divisão não é exata', () => {
    const { installments } = createDebtWithInstallments(
      {
        name: 'Teste',
        card: 'Visa',
        totalCents: 100_001,
        installmentCount: 3,
        firstDueMonth: '2026-01',
      },
      42,
    )

    expect(installments.map((p) => p.amountCents)).toEqual([33333, 33333, 33335])
    expect(sumCents(installments)).toBe(100_001)
    expect(installments[2]?.id).toBe('42-2')
  })
})
