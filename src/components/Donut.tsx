import { PENDENCIA_COLORS } from '../constants/colors'
import type { PendenciaSlice } from '../domain/calculations'

interface DonutProps {
  parts: PendenciaSlice[]
}

/** Donut SVG de pendências agrupadas */
export function Donut({ parts }: DonutProps) {
  const total = parts.reduce((acc, part) => acc + part.amountCents, 0)
  let offset = 0

  return (
    <svg viewBox="0 0 42 42" aria-hidden>
      {parts.map((part, i) => {
        const f = total ? (part.amountCents / total) * 100 : 0
        const circle = (
          <circle
            key={part.key}
            r="15.9155"
            cx="21"
            cy="21"
            fill="none"
            stroke={PENDENCIA_COLORS[i % PENDENCIA_COLORS.length]}
            strokeWidth="7"
            strokeDasharray={`${f} ${100 - f}`}
            strokeDashoffset={-offset}
            transform="rotate(-90 21 21)"
          />
        )
        offset += f
        return circle
      })}
    </svg>
  )
}
