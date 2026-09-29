import type { Transaction } from '../types/transaction'

export const transactions: Transaction[] = [
  {
    id: '1',
    type: 'income',
    description: 'Salário',
    amount: 5500,
    date: '2026-09-01',
    category: 'Salário',
    accountId: '1',
    paymentMethod: 'Transferência',
  },

  {
    id: '2',
    type: 'expense',
    description: 'Supermercado',
    amount: 350,
    date: '2026-09-05',
    category: 'Alimentação',
    accountId: '1',
    paymentMethod: 'Cartão de débito',
  },

  {
    id: '3',
    type: 'expense',
    description: 'Netflix',
    amount: 55.90,
    date: '2026-09-10',
    category: 'Assinaturas',
    accountId: '1',
    paymentMethod: 'Cartão de crédito',
  },

  {
    id: '4',
    type: 'expense',
    description: 'Uber',
    amount: 42.50,
    date: '2026-09-12',
    category: 'Transporte',
    accountId: '1',
    paymentMethod: 'Cartão de crédito',
  },
]
