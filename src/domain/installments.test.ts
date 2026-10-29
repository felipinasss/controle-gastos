import { describe, expect, it } from 'vitest'
import {
  createDebtWithInstallments,
  missingSubscriptionInstallments,
  sumCents,
} from './installments'

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

    expect(debt.kind).toBe('installment')
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

  it('cria assinatura mensal até throughMonth', () => {
    const { debt, installments } = createDebtWithInstallments(
      {
        name: 'Academia',
        card: 'Cartão Nubank',
        totalCents: 15_000,
        installmentCount: 0,
        firstDueMonth: '2026-09',
        kind: 'subscription',
      },
      7,
      '2026-11',
    )

    expect(debt.kind).toBe('subscription')
    expect(debt.installmentCount).toBe(0)
    expect(installments).toHaveLength(3)
    expect(installments.map((p) => p.dueMonth)).toEqual([
      '2026-09',
      '2026-10',
      '2026-11',
    ])
    expect(installments.every((p) => p.amountCents === 15_000)).toBe(true)
    expect(installments[1]?.id).toBe('7-2026-10')
  })
})

describe('missingSubscriptionInstallments', () => {
  it('só cria meses que ainda não existem', () => {
    const { debt, installments } = createDebtWithInstallments(
      {
        name: 'Academia',
        card: 'Nubank',
        totalCents: 10_000,
        installmentCount: 0,
        firstDueMonth: '2026-10',
        kind: 'subscription',
      },
      9,
      '2026-10',
    )
    const missing = missingSubscriptionInstallments([debt], installments, '2026-12')
    expect(missing.map((p) => p.dueMonth)).toEqual(['2026-11', '2026-12'])
  })
})
