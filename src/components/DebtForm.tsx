import { useState, type FormEvent } from 'react'
import { currentYearMonth } from '../domain/dates'
import { parseReaisToCents } from '../domain/money'
import type { CreateDebtInput } from '../domain/models'

interface DebtFormProps {
  cardSuggestions: string[]
  onSubmit: (input: CreateDebtInput) => Promise<void>
}

export function DebtForm({ cardSuggestions, onSubmit }: DebtFormProps) {
  const [name, setName] = useState('')
  const [card, setCard] = useState('')
  const [total, setTotal] = useState('')
  const [count, setCount] = useState('6')
  const [firstDue, setFirstDue] = useState(() => currentYearMonth())
  const [busy, setBusy] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const totalCents = parseReaisToCents(total)
    const installmentCount = parseInt(count, 10)
    if (!name.trim() || !(totalCents > 0) || !(installmentCount > 0)) {
      alert('Preencha descrição, valor total e número de parcelas.')
      return
    }

    setBusy(true)
    try {
      await onSubmit({
        name: name.trim(),
        card: card.trim() || 'Sem cartão',
        totalCents,
        installmentCount,
        firstDueMonth: firstDue || currentYearMonth(),
      })
      setName('')
      setCard('')
      setTotal('')
      setCount('6')
      setFirstDue(currentYearMonth())
    } finally {
      setBusy(false)
    }
  }

  return (
    <form className="card" onSubmit={handleSubmit}>
      <div className="sec">
        <span>Nova dívida</span>
      </div>

      <label htmlFor="f-n">Descrição</label>
      <input
        id="f-n"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Ex.: Notebook"
        autoComplete="off"
      />

      <label htmlFor="f-c">Cartão</label>
      <input
        id="f-c"
        list="cl"
        value={card}
        onChange={(e) => setCard(e.target.value)}
        placeholder="Ex.: Cartão Nubank"
        autoComplete="off"
      />
      <datalist id="cl">
        {cardSuggestions.map((c) => (
          <option key={c} value={c} />
        ))}
      </datalist>

      <div className="two">
        <div>
          <label htmlFor="f-t">Valor total (R$)</label>
          <input
            id="f-t"
            inputMode="decimal"
            value={total}
            onChange={(e) => setTotal(e.target.value)}
            placeholder="6000,00"
          />
        </div>
        <div>
          <label htmlFor="f-p">Parcelas</label>
          <input
            id="f-p"
            type="number"
            min={1}
            max={120}
            value={count}
            onChange={(e) => setCount(e.target.value)}
          />
        </div>
      </div>

      <label htmlFor="f-m">Primeiro vencimento</label>
      <input
        id="f-m"
        type="month"
        value={firstDue}
        onChange={(e) => setFirstDue(e.target.value)}
      />

      <button className="btn" type="submit" disabled={busy}>
        Adicionar dívida
      </button>
    </form>
  )
}
