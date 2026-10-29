import { createDebtWithInstallments } from '../../domain/installments'
import type { CreateDebtInput, Debt, Installment } from '../../domain/models'
import type { ExpenseRepository } from '../repository'
import { db } from './db'

/** Evita open concorrente (ex.: React Strict Mode) */
let readyLock: Promise<void> | null = null

export class DexieExpenseRepository implements ExpenseRepository {
  async listDebts(): Promise<Debt[]> {
    return db.debts.toArray()
  }

  async listInstallments(): Promise<Installment[]> {
    return db.installments.toArray()
  }

  async createDebt(
    input: CreateDebtInput,
  ): Promise<{ debt: Debt; installments: Installment[] }> {
    const created = createDebtWithInstallments(input)
    await db.transaction('rw', db.debts, db.installments, async () => {
      await db.debts.add(created.debt)
      await db.installments.bulkAdd(created.installments)
    })
    return created
  }

  async deleteDebt(debtId: number): Promise<void> {
    await db.transaction('rw', db.debts, db.installments, async () => {
      await db.debts.delete(debtId)
      await db.installments.where('debtId').equals(debtId).delete()
    })
  }

  async setInstallmentPaid(installmentId: string, paid: boolean): Promise<void> {
    await db.installments.update(installmentId, { paid })
  }

  async toggleInstallmentPaid(installmentId: string): Promise<Installment | undefined> {
    return db.transaction('rw', db.installments, async () => {
      const current = await db.installments.get(installmentId)
      if (!current) return undefined
      const paid = !current.paid
      await db.installments.update(installmentId, { paid })
      return { ...current, paid }
    })
  }

  async clearAll(): Promise<void> {
    await db.transaction('rw', db.debts, db.installments, db.meta, async () => {
      await db.debts.clear()
      await db.installments.clear()
      await db.meta.clear()
    })
  }

  async replaceAll(debts: Debt[], installments: Installment[]): Promise<void> {
    await db.transaction('rw', db.debts, db.installments, db.meta, async () => {
      await db.debts.clear()
      await db.installments.clear()
      if (debts.length) await db.debts.bulkPut(debts)
      if (installments.length) await db.installments.bulkPut(installments)
    })
  }

  /** Abre o banco local — instalação nova começa sem dívidas */
  async ensureSeeded(): Promise<void> {
    if (!readyLock) {
      readyLock = db.open().then(() => undefined).catch((err) => {
        readyLock = null
        throw err
      })
    }
    return readyLock
  }
}

export const expenseRepository: ExpenseRepository = new DexieExpenseRepository()
