/** Identificador de mês no formato YYYY-MM */
export type YearMonth = string

/** Dívida parcelada fixa ou assinatura mensal recorrente */
export type DebtKind = 'installment' | 'subscription'

export interface Debt {
  id: number
  /** Descrição da dívida */
  name: string
  /** Nome do cartão */
  card: string
  /**
   * Em parcelas: valor total em centavos.
   * Em assinatura: valor mensal em centavos.
   */
  totalCents: number
  /**
   * Quantidade de parcelas (dívida comum).
   * Assinatura: 0 (sem fim definido).
   */
  installmentCount: number
  /** Primeiro vencimento (YYYY-MM) */
  firstDueMonth: YearMonth
  /** Padrão: installment (compatível com dados antigos) */
  kind: DebtKind
}

export interface Installment {
  id: string
  debtId: number
  /** Número da parcela (1-based) */
  number: number
  /** Mês de vencimento (YYYY-MM) */
  dueMonth: YearMonth
  /** Valor em centavos */
  amountCents: number
  paid: boolean
}

export type PendenciasGroupBy = 'card' | 'debt'

export type AppTab = 'overview' | 'debts'

export interface CreateDebtInput {
  name: string
  card: string
  totalCents: number
  installmentCount: number
  firstDueMonth: YearMonth
  kind?: DebtKind
}

export function isSubscription(debt: Pick<Debt, 'kind'>): boolean {
  return debt.kind === 'subscription'
}

/** Normaliza dívidas antigas sem o campo kind */
export function normalizeDebt(raw: Debt): Debt {
  return {
    ...raw,
    kind: raw.kind === 'subscription' ? 'subscription' : 'installment',
  }
}
