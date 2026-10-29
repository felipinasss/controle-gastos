import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  computeGlobalSummary,
  computeMonthSummary,
  groupPendencias,
} from '../domain/calculations'
import { currentYearMonth } from '../domain/dates'
import type {
  AppTab,
  CreateDebtInput,
  Debt,
  Installment,
  PendenciasGroupBy,
  YearMonth,
} from '../domain/models'
import { expenseRepository } from '../data'

export function useExpenseStore() {
  const [debts, setDebts] = useState<Debt[]>([])
  const [installments, setInstallments] = useState<Installment[]>([])
  const [month, setMonth] = useState<YearMonth>(() => currentYearMonth())
  const [tab, setTab] = useState<AppTab>('overview')
  const [groupBy, setGroupBy] = useState<PendenciasGroupBy>('card')
  const [ready, setReady] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const nowMonth = useMemo(() => currentYearMonth(), [])

  const refresh = useCallback(async () => {
    const [nextDebts, nextInstallments] = await Promise.all([
      expenseRepository.listDebts(),
      expenseRepository.listInstallments(),
    ])
    setDebts(nextDebts)
    setInstallments(nextInstallments)
  }, [])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        await expenseRepository.ensureSeeded()
        if (cancelled) return
        await refresh()
      } catch (err) {
        console.error(err)
        if (!cancelled) setError('Não foi possível carregar os dados locais.')
      } finally {
        if (!cancelled) setReady(true)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [refresh])

  const monthSummary = useMemo(
    () => computeMonthSummary(installments, month),
    [installments, month],
  )

  const globalSummary = useMemo(
    () => computeGlobalSummary(installments, nowMonth),
    [installments, nowMonth],
  )

  const unpaid = useMemo(() => installments.filter((p) => !p.paid), [installments])

  const pendencias = useMemo(
    () => groupPendencias(unpaid, debts, groupBy),
    [unpaid, debts, groupBy],
  )

  const monthInstallments = useMemo(() => {
    return installments
      .filter((p) => p.dueMonth === month)
      .sort((a, b) => Number(a.paid) - Number(b.paid))
  }, [installments, month])

  const cardSuggestions = useMemo(
    () => [...new Set(debts.map((d) => d.card))].sort(),
    [debts],
  )

  const debtById = useMemo(() => new Map(debts.map((d) => [d.id, d])), [debts])

  const shiftMonth = useCallback((delta: number) => {
    setMonth((current) => {
      const [y, m] = current.split('-').map(Number) as [number, number]
      const d = new Date(y, m - 1 + delta, 1)
      const yy = d.getFullYear()
      const mm = String(d.getMonth() + 1).padStart(2, '0')
      return `${yy}-${mm}`
    })
  }, [])

  const togglePaid = useCallback(
    async (installmentId: string) => {
      await expenseRepository.toggleInstallmentPaid(installmentId)
      await refresh()
    },
    [refresh],
  )

  const addDebt = useCallback(
    async (input: CreateDebtInput) => {
      await expenseRepository.createDebt(input)
      await refresh()
      setTab('overview')
      const now = currentYearMonth()
      setMonth(input.firstDueMonth > now ? input.firstDueMonth : now)
    },
    [refresh],
  )

  const removeDebt = useCallback(
    async (debtId: number) => {
      await expenseRepository.deleteDebt(debtId)
      await refresh()
    },
    [refresh],
  )

  const resetAll = useCallback(async () => {
    await expenseRepository.clearAll()
    await refresh()
  }, [refresh])

  return {
    ready,
    error,
    debts,
    installments,
    month,
    tab,
    setTab,
    groupBy,
    setGroupBy,
    nowMonth,
    monthSummary,
    globalSummary,
    pendencias,
    monthInstallments,
    cardSuggestions,
    debtById,
    shiftMonth,
    togglePaid,
    addDebt,
    removeDebt,
    resetAll,
    refresh,
  }
}

export type ExpenseStore = ReturnType<typeof useExpenseStore>
