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
  const [monthly, setMonthly] = useState(false)
  const [busy, setBusy] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const totalCents = parseReaisToCents(total)
    if (!name.trim() || !(totalCents > 0)) {
      alert(
        monthly
          ? 'Preencha descrição e valor mensal.'
          : 'Preencha descrição, valor total e número de parcelas.',
      )
      return
    }

    if (!monthly) {
      const installmentCount = parseInt(count, 10)
      if (!(installmentCount > 0)) {
        alert('Preencha descrição, valor total e número de parcelas.')
        return
      }
    }

    setBusy(true)
    try {
      await onSubmit({
        name: name.trim(),
        card: card.trim() || 'Sem cartão',
        totalCents,
        installmentCount: monthly ? 0 : parseInt(count, 10),
        firstDueMonth: firstDue || currentYearMonth(),
        kind: monthly ? 'subscription' : 'installment',
      })
      setName('')
      setCard('')
      setTotal('')
      setCount('6')
      setFirstDue(currentYearMonth())
      setMonthly(false)
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
        placeholder={monthly ? 'Ex.: Academia' : 'Ex.: Notebook'}
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

      <label className="check-row" htmlFor="f-sub">
        <input
          id="f-sub"
          type="checkbox"
          checked={monthly}
          onChange={(e) => setMonthly(e.target.checked)}
        />
        <span>
          Pendência mensal (assinatura)
          <small>Cobra todo mês até você excluir — ex.: academia</small>
        </span>
      </label>

      {monthly ? (
        <>
          <label htmlFor="f-t">Valor mensal (R$)</label>
          <input
            id="f-t"
            inputMode="decimal"
            value={total}
            onChange={(e) => setTotal(e.target.value)}
            placeholder="149,90"
          />
        </>
      ) : (
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
      )}

      <label htmlFor="f-m">{monthly ? 'Começa em' : 'Primeiro vencimento'}</label>
      <input
        id="f-m"
        type="month"
        value={firstDue}
        onChange={(e) => setFirstDue(e.target.value)}
      />

      <button className="btn" type="submit" disabled={busy}>
        {monthly ? 'Adicionar assinatura' : 'Adicionar dívida'}
      </button>
    </form>
  )
}
