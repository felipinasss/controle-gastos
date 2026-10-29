import { formatMonthLabel } from '../domain/dates'
import type { YearMonth } from '../domain/models'

interface MonthNavProps {
  month: YearMonth
  onShift: (delta: number) => void
}

export function MonthNav({ month, onShift }: MonthNavProps) {
  return (
    <div className="nav">
      <button type="button" aria-label="Mês anterior" onClick={() => onShift(-1)}>
        ‹
      </button>
      <span>{formatMonthLabel(month)}</span>
      <button type="button" aria-label="Próximo mês" onClick={() => onShift(1)}>
        ›
      </button>
    </div>
  )
}
