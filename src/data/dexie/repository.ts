import { createDebtWithInstallments } from '../../domain/installments'
import type { CreateDebtInput, Debt, Installment } from '../../domain/models'
import type { ExpenseRepository } from '../repository'
import { db } from './db'
import { buildDemoData } from './seed'

const SEEDED_KEY = 'seeded'

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
      await db.meta.put({ key: SEEDED_KEY, value: '1' })
    })
  }

  async replaceAll(debts: Debt[], installments: Installment[]): Promise<void> {
    await db.transaction('rw', db.debts, db.installments, db.meta, async () => {
      await db.debts.clear()
      await db.installments.clear()
      if (debts.length) await db.debts.bulkAdd(debts)
      if (installments.length) await db.installments.bulkAdd(installments)
      await db.meta.put({ key: SEEDED_KEY, value: '1' })
    })
  }

  async ensureSeeded(): Promise<void> {
    const seeded = await db.meta.get(SEEDED_KEY)
    if (seeded) return

    const count = await db.debts.count()
    if (count > 0) {
      await db.meta.put({ key: SEEDED_KEY, value: '1' })
      return
    }

    const demo = buildDemoData()
    await db.transaction('rw', db.debts, db.installments, db.meta, async () => {
      await db.debts.bulkAdd(demo.debts)
      await db.installments.bulkAdd(demo.installments)
      await db.meta.put({ key: SEEDED_KEY, value: '1' })
    })
  }
}

export const expenseRepository: ExpenseRepository = new DexieExpenseRepository()
