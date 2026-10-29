import type { AppTab } from '../domain/models'

interface TabsProps {
  tab: AppTab
  onChange: (tab: AppTab) => void
}

export function Tabs({ tab, onChange }: TabsProps) {
  return (
    <div className="tabs" role="tablist" aria-label="Navegação principal">
      <button
        type="button"
        role="tab"
        aria-selected={tab === 'overview'}
        className={tab === 'overview' ? 'on' : undefined}
        onClick={() => onChange('overview')}
      >
        Visão geral
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={tab === 'debts'}
        className={tab === 'debts' ? 'on' : undefined}
        onClick={() => onChange('debts')}
      >
        Dívidas
      </button>
    </div>
  )
}
