/** Identificador de mês no formato YYYY-MM */
export type YearMonth = string

export interface Debt {
  id: number
  /** Descrição da dívida */
  name: string
  /** Nome do cartão */
  card: string
  /** Valor total em centavos */
  totalCents: number
  /** Quantidade de parcelas */
  installmentCount: number
  /** Primeiro vencimento (YYYY-MM) */
  firstDueMonth: YearMonth
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
}
