interface RingProps {
  fraction: number
  centerValue: string
  centerLabel: string
  leftValue: string
  leftLabel: string
  rightValue: string
  rightLabel: string
}

/** Semi-anel de progresso (pago no mês) */
export function Ring({
  fraction,
  centerValue,
  centerLabel,
  leftValue,
  leftLabel,
  rightValue,
  rightLabel,
}: RingProps) {
  const length = Math.PI * 80
  const clamped = Math.min(1, Math.max(0, fraction))

  return (
    <div className="ring-wrap">
      <div className="ring">
        <svg viewBox="0 0 200 110" aria-hidden>
          <path
            d="M20 100A80 80 0 0 1 180 100"
            fill="none"
            stroke="var(--line)"
            strokeWidth="14"
            strokeLinecap="round"
          />
          <path
            d="M20 100A80 80 0 0 1 180 100"
            fill="none"
            stroke="var(--g)"
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={`${length * clamped} ${length}`}
          />
        </svg>
        <div className="mid">
          <big>{centerValue}</big>
          <small>{centerLabel}</small>
        </div>
      </div>
      <div className="row3">
        <div className="side">
          {leftValue}
          <small>{leftLabel}</small>
        </div>
        <div className="side" style={{ textAlign: 'right' }}>
          {rightValue}
          <small>{rightLabel}</small>
        </div>
      </div>
    </div>
  )
}
