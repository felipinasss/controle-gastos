import { describe, expect, it } from 'vitest'
import {
  addMonths,
  currentYearMonth,
  formatMonthLabel,
  formatMonthShort,
  toYearMonth,
} from './dates'

describe('dates', () => {
  it('converte e soma meses', () => {
    expect(toYearMonth(new Date(2026, 9, 15))).toBe('2026-10')
    expect(addMonths('2026-10', 1)).toBe('2026-11')
    expect(addMonths('2026-10', -1)).toBe('2026-09')
    expect(addMonths('2026-12', 1)).toBe('2027-01')
  })

  it('formata rótulos em português', () => {
    expect(formatMonthLabel('2026-10')).toBe('outubro de 2026')
    expect(formatMonthShort('2027-03')).toBe('mar/27')
  })

  it('currentYearMonth usa a data fornecida', () => {
    expect(currentYearMonth(new Date(2026, 0, 1))).toBe('2026-01')
  })
})
