import { describe, expect, it } from 'vitest'
import { formatBRL, parseReaisToCents } from './money'

describe('money', () => {
  it('formata centavos em BRL', () => {
    expect(formatBRL(600_000)).toMatch(/6\.000,00/)
    expect(formatBRL(0)).toMatch(/0,00/)
  })

  it('parseia valores com vírgula e ponto', () => {
    expect(parseReaisToCents('6000,00')).toBe(600_000)
    expect(parseReaisToCents('6.000,00')).toBe(600_000)
    expect(parseReaisToCents('2400.50')).toBe(240_050)
  })
})
