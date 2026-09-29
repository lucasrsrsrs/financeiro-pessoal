export type BillStatus =
  | 'pending'
  | 'paid'
  | 'overdue'

export type BillRecurrence =
  | 'none'
  | 'weekly'
  | 'monthly'
  | 'yearly'

export interface Bill {
  id: string

  name: string

  amount: number

  dueDate: string

  category: string

  accountId: string

  paymentMethod: string

  status: BillStatus

  recurrence: BillRecurrence

  notes: string

  createdAt: string
}
