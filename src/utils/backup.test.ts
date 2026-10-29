import { describe, expect, it } from 'vitest'
import { buildDemoData } from '../data/dexie/seed'
import { buildBackup, parseBackup, serializeBackup } from './backup'

describe('backup', () => {
  it('serializa e restaura dívidas e parcelas', () => {
    const demo = buildDemoData(new Date(2026, 9, 15))
    const payload = buildBackup(demo.debts, demo.installments)
    const restored = parseBackup(serializeBackup(payload))
    expect(restored.debts).toHaveLength(2)
    expect(restored.installments).toHaveLength(10)
    expect(restored.debts[0]?.name).toBe('Notebook')
  })

  it('rejeita JSON inválido', () => {
    expect(() => parseBackup('{')).toThrow(/inválido/)
    expect(() => parseBackup('{"foo":1}')).toThrow(/debts/)
  })
})
