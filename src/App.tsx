import { Tabs } from './components/Tabs'
import { useExpenseStore } from './hooks/useExpenseStore'
import { DebtsScreen } from './screens/DebtsScreen'
import { OverviewScreen } from './screens/OverviewScreen'

export default function App() {
  const store = useExpenseStore()

  return (
    <div className="app">
      <header>
        <div className="av" aria-hidden>
          R
        </div>
        <h1>
          Meus <b>gastos</b>
        </h1>
        <div style={{ width: 40 }} aria-hidden />
      </header>

      <Tabs tab={store.tab} onChange={store.setTab} />

      {!store.ready ? (
        <p className="empty">Carregando…</p>
      ) : store.error ? (
        <p className="empty">{store.error}</p>
      ) : store.tab === 'overview' ? (
        <OverviewScreen store={store} />
      ) : (
        <DebtsScreen store={store} />
      )}
    </div>
  )
}
