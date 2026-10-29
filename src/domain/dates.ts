import type { YearMonth } from './models'

const MONTH_NAMES = [
  'janeiro',
  'fevereiro',
  'março',
  'abril',
  'maio',
  'junho',
  'julho',
  'agosto',
  'setembro',
  'outubro',
  'novembro',
  'dezembro',
] as const

/** Converte Date para YYYY-MM */
export function toYearMonth(date: Date): YearMonth {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  return `${y}-${m}`
}

/** Mês atual no fuso local */
export function currentYearMonth(now: Date = new Date()): YearMonth {
  return toYearMonth(now)
}

/** Soma N meses a um YYYY-MM */
export function addMonths(yearMonth: YearMonth, count: number): YearMonth {
  const [y, m] = yearMonth.split('-').map(Number) as [number, number]
  return toYearMonth(new Date(y, m - 1 + count, 1))
}

/** Rótulo "janeiro de 2026" */
export function formatMonthLabel(yearMonth: YearMonth): string {
  const [y, m] = yearMonth.split('-')
  const monthIndex = Number(m) - 1
  return `${MONTH_NAMES[monthIndex]} de ${y}`
}

/** Rótulo curto "jan/26" */
export function formatMonthShort(yearMonth: YearMonth): string {
  const [y, m] = yearMonth.split('-') as [string, string]
  const monthIndex = Number(m) - 1
  const short = MONTH_NAMES[monthIndex]?.slice(0, 3) ?? '—'
  return `${short}/${y.slice(2)}`
}

export { MONTH_NAMES }
