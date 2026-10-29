/** Formata centavos como moeda BRL */
export function formatBRL(cents: number): string {
  return (cents / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

/**
 * Interpreta texto de valor em reais e devolve centavos.
 * Aceita "6000,00", "6.000,00" ou "6000.00".
 */
export function parseReaisToCents(input: string): number {
  const s = String(input).trim()
  if (!s) return NaN
  const normalized = s.includes(',')
    ? parseFloat(s.replace(/\./g, '').replace(',', '.'))
    : parseFloat(s)
  if (!Number.isFinite(normalized)) return NaN
  return Math.round(normalized * 100)
}
