import { describe, expect, it } from 'vitest'
import { sumCents } from '../../domain/installments'
import { buildDemoData } from './seed'

describe('buildDemoData', () => {
  it('reproduz os demos do protótipo (Notebook + Geladeira)', () => {
    const { debts, installments } = buildDemoData(new Date(2026, 9, 15))
    expect(debts.map((d) => d.name)).toEqual(['Notebook', 'Geladeira'])
    expect(debts[0]?.firstDueMonth).toBe('2026-10')
    expect(debts[1]?.firstDueMonth).toBe('2026-09')
    expect(installments).toHaveLength(10)
    expect(sumCents(installments)).toBe(840_000)
  })
})
