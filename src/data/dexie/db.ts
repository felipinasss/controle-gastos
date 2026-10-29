import Dexie, { type EntityTable } from 'dexie'
import type { Debt, Installment } from '../../domain/models'

export class ControleGastosDB extends Dexie {
  debts!: EntityTable<Debt, 'id'>
  installments!: EntityTable<Installment, 'id'>
  meta!: EntityTable<{ key: string; value: string }, 'key'>

  constructor() {
    // Nome novo: abre vazio (sem demos do protótipo) em quem já tinha a v1 seedada
    super('controle-gastos-v2')
    this.version(1).stores({
      debts: 'id, card, firstDueMonth',
      installments: 'id, debtId, dueMonth, paid',
      meta: 'key',
    })
  }
}

export const db = new ControleGastosDB()
