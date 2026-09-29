import type { Account } from '../types/account'

export const initialAccounts: Account[] = [
  {
    id: '1',
    name: 'Conta principal',
    type: 'checking',
    initialBalance: 0,
  },
  {
    id: '2',
    name: 'Poupança',
    type: 'savings',
    initialBalance: 0,
  },
  {
    id: '3',
    name: 'Dinheiro',
    type: 'cash',
    initialBalance: 0,
  },
]
