import { PENDENCIA_COLORS } from '../constants/colors'
import type { PendenciaSlice } from '../domain/calculations'
import type { PendenciasGroupBy } from '../domain/models'
import { Donut } from './Donut'

interface PendenciasProps {
  parts: PendenciaSlice[]
  groupBy: PendenciasGroupBy
  onGroupByChange: (value: PendenciasGroupBy) => void
}

export function Pendencias({ parts, groupBy, onGroupByChange }: PendenciasProps) {
  return (
    <div className="card">
      <div className="sec">
        <span>Pendências</span>
        <div className="pills">
          <button
            type="button"
            className={groupBy === 'card' ? 'on' : undefined}
            onClick={() => onGroupByChange('card')}
          >
            Por cartão
          </button>
          <button
            type="button"
            className={groupBy === 'debt' ? 'on' : undefined}
            onClick={() => onGroupByChange('debt')}
          >
            Por dívida
          </button>
        </div>
      </div>
      {parts.length === 0 ? (
        <div className="empty">Nada pendente.</div>
      ) : (
        <div className="donut">
          <Donut parts={parts} />
          <div className="leg">
            {parts.map((part, i) => (
              <div key={part.key}>
                <i
                  style={{
                    background: PENDENCIA_COLORS[i % PENDENCIA_COLORS.length],
                  }}
                />
                {part.key}
                <span>{part.percent}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
