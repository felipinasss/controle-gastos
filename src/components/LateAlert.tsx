import { formatBRL } from '../domain/money'

interface LateAlertProps {
  lateCents: number
}

export function LateAlert({ lateCents }: LateAlertProps) {
  if (lateCents <= 0) return null
  return <div className="card late">Em atraso: {formatBRL(lateCents)}</div>
}
