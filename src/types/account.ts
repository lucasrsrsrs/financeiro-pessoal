export type AccountType =
  | 'checking'
  | 'savings'
  | 'cash'

export interface Account {
  id: string
  name: string
  type: AccountType
  initialBalance: number
}
