import type { CreateDebtInput, Debt, Installment } from '../domain/models'

/**
 * Interface de armazenamento — permite trocar Dexie por Supabase
 * sem reescrever a UI.
 */
export interface ExpenseRepository {
  listDebts(): Promise<Debt[]>
  listInstallments(): Promise<Installment[]>
  createDebt(input: CreateDebtInput): Promise<{ debt: Debt; installments: Installment[] }>
  deleteDebt(debtId: number): Promise<void>
  setInstallmentPaid(installmentId: string, paid: boolean): Promise<void>
  setInstallmentsPaid(installmentIds: string[], paid: boolean): Promise<void>
  toggleInstallmentPaid(installmentId: string): Promise<Installment | undefined>
  clearAll(): Promise<void>
  replaceAll(debts: Debt[], installments: Installment[]): Promise<void>
  ensureSeeded(): Promise<void>
}
