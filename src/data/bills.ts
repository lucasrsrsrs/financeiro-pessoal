import type { Bill } from '../types/bill'

export const initialBills: Bill[] = [
  {
    id: 'bill-1',
    name: 'Internet',
    amount: 120,
    dueDate: '2026-10-01',
    category: 'Moradia',
    accountId: '1',
    paymentMethod: 'Pix',
    status: 'pending',
    recurrence: 'monthly',
    notes: 'Internet residencial',
    createdAt: '2026-09-28',
  },

  {
    id: 'bill-2',
    name: 'Netflix',
    amount: 39.90,
    dueDate: '2026-10-05',
    category: 'Assinaturas',
    accountId: '1',
    paymentMethod: 'Cartão de crédito',
    status: 'pending',
    recurrence: 'monthly',
    notes: '',
    createdAt: '2026-09-28',
  },

  {
    id: 'bill-3',
    name: 'Aluguel',
    amount: 1500,
    dueDate: '2026-10-10',
    category: 'Moradia',
    accountId: '1',
    paymentMethod: 'Pix',
    status: 'pending',
    recurrence: 'monthly',
    notes: '',
    createdAt: '2026-09-28',
  },
]
