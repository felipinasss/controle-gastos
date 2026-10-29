interface SummaryCardProps {
  label: string
  value: string
  /** Progresso 0–100 da barrinha */
  progressPercent: number
}

export function SummaryCard({ label, value, progressPercent }: SummaryCardProps) {
  const width = Math.min(100, Math.max(0, progressPercent))
  return (
    <div className="stat">
      <small>{label}</small>
      <b>{value}</b>
      <div className="bar" aria-hidden>
        <i style={{ width: `${width}%` }} />
      </div>
    </div>
  )
}
