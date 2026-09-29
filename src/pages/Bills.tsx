import { useMemo, useState } from 'react'

import type {
  Bill,
  BillRecurrence,
  BillStatus,
} from '../types/bill'

import type { Account } from '../types/account'

interface BillsProps {
  bills: Bill[]
  accounts: Account[]
  onAddBill: (bill: Bill) => void
  onUpdateBill: (bill: Bill) => void
}

function Bills({
  bills,
  accounts,
  onAddBill,
  onUpdateBill,
}: BillsProps) {
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [dueDate, setDueDate] = useState('2026-10-05')
  const [category, setCategory] = useState('Moradia')
  const [accountId, setAccountId] = useState(
    accounts[0]?.id ?? ''
  )
  const [paymentMethod, setPaymentMethod] = useState(
    'Pix'
  )
  const [recurrence, setRecurrence] =
    useState<BillRecurrence>('monthly')
  const [notes, setNotes] = useState('')

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  function formatCurrency(value: number) {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })
  }

  function getAccountName(accountId: string) {
    const account = accounts.find(
      (account) => account.id === accountId
    )

    return account?.name ?? 'Conta desconhecida'
  }

  function getDaysUntilDue(date: string) {
    const due = new Date(`${date}T00:00:00`)
    const difference =
      due.getTime() - today.getTime()

    return Math.ceil(
      difference / (1000 * 60 * 60 * 24)
    )
  }

  function getCalculatedStatus(
    bill: Bill
  ): BillStatus {
    if (bill.status === 'paid') {
      return 'paid'
    }

    const days = getDaysUntilDue(bill.dueDate)

    if (days < 0) {
      return 'overdue'
    }

    return 'pending'
  }

  function getStatusLabel(status: BillStatus) {
    if (status === 'paid') {
      return 'Paga'
    }

    if (status === 'overdue') {
      return 'Vencida'
    }

    return 'Pendente'
  }

  function getStatusClass(status: BillStatus) {
    if (status === 'paid') {
      return 'bg-green-50 text-green-700'
    }

    if (status === 'overdue') {
      return 'bg-red-50 text-red-700'
    }

    return 'bg-yellow-50 text-yellow-700'
  }

  function getDueText(bill: Bill) {
    const status = getCalculatedStatus(bill)

    if (status === 'paid') {
      return 'Pagamento realizado'
    }

    const days = getDaysUntilDue(bill.dueDate)

    if (days < 0) {
      const absoluteDays = Math.abs(days)

      return absoluteDays === 1
        ? 'Venceu ontem'
        : `Venceu há ${absoluteDays} dias`
    }

    if (days === 0) {
      return 'Vence hoje'
    }

    if (days === 1) {
      return 'Vence amanhã'
    }

    return `Vence em ${days} dias`
  }

  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    const numericAmount = Number(
      amount.replace(',', '.')
    )

    if (
      !name.trim() ||
      numericAmount <= 0 ||
      !dueDate ||
      !accountId
    ) {
      return
    }

    const newBill: Bill = {
      id: crypto.randomUUID(),
      name: name.trim(),
      amount: numericAmount,
      dueDate,
      category,
      accountId,
      paymentMethod,
      status: 'pending',
      recurrence,
      notes: notes.trim(),
      createdAt: new Date()
        .toISOString()
        .split('T')[0],
    }

    onAddBill(newBill)

    setName('')
    setAmount('')
    setNotes('')
  }

  function markAsPaid(bill: Bill) {
    onUpdateBill({
      ...bill,
      status: 'paid',
    })
  }

  const summary = useMemo(() => {
    let pending = 0
    let overdue = 0
    let paid = 0

    bills.forEach((bill) => {
      const status = getCalculatedStatus(bill)

      if (status === 'pending') {
        pending += bill.amount
      }

      if (status === 'overdue') {
        overdue += bill.amount
      }

      if (status === 'paid') {
        paid += bill.amount
      }
    })

    return {
      pending,
      overdue,
      paid,
      total: pending + overdue + paid,
    }
  }, [bills])

  const sortedBills = [...bills].sort(
    (a, b) =>
      new Date(
        `${a.dueDate}T00:00:00`
      ).getTime() -
      new Date(
        `${b.dueDate}T00:00:00`
      ).getTime()
  )

  return (
    <div className="space-y-6">

      {/* Cabeçalho */}

      <div>
        <p className="text-sm text-gray-500">
          Planejamento financeiro
        </p>

        <h1 className="text-3xl font-bold">
          Contas
        </h1>

        <p className="mt-1 text-gray-500">
          Organize suas contas, vencimentos e pagamentos.
        </p>
      </div>

      {/* Resumo */}

      <div className="grid gap-5 md:grid-cols-4">

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            Total
          </p>

          <p className="mt-3 text-2xl font-bold">
            {formatCurrency(summary.total)}
          </p>

          <p className="mt-1 text-xs text-gray-400">
            Todas as contas
          </p>
        </div>

        <div className="rounded-2xl bg-yellow-50 p-6">
          <p className="text-sm text-yellow-700">
            Pendentes
          </p>

          <p className="mt-3 text-2xl font-bold text-yellow-700">
            {formatCurrency(summary.pending)}
          </p>

          <p className="mt-1 text-xs text-yellow-600">
            A pagar
          </p>
        </div>

        <div className="rounded-2xl bg-red-50 p-6">
          <p className="text-sm text-red-700">
            Vencidas
          </p>

          <p className="mt-3 text-2xl font-bold text-red-700">
            {formatCurrency(summary.overdue)}
          </p>

          <p className="mt-1 text-xs text-red-600">
            Precisam de atenção
          </p>
        </div>

        <div className="rounded-2xl bg-green-50 p-6">
          <p className="text-sm text-green-700">
            Pagas
          </p>

          <p className="mt-3 text-2xl font-bold text-green-700">
            {formatCurrency(summary.paid)}
          </p>

          <p className="mt-1 text-xs text-green-600">
            Já pagas
          </p>
        </div>

      </div>

      {/* Nova conta */}

      <div className="rounded-2xl bg-white p-6 shadow-sm">

        <h2 className="text-lg font-bold">
          Nova conta
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Cadastre uma conta ou compromisso financeiro.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-6 grid gap-5 md:grid-cols-2"
        >

          {/* Nome */}

          <div>
            <label className="mb-2 block text-sm font-medium">
              Nome da conta
            </label>

            <input
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              placeholder="Ex.: Aluguel"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Valor */}

          <div>
            <label className="mb-2 block text-sm font-medium">
              Valor
            </label>

            <input
              value={amount}
              onChange={(event) =>
                setAmount(event.target.value)
              }
              placeholder="0,00"
              inputMode="decimal"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Vencimento */}

          <div>
            <label className="mb-2 block text-sm font-medium">
              Vencimento
            </label>

            <input
              type="date"
              value={dueDate}
              onChange={(event) =>
                setDueDate(event.target.value)
              }
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Categoria */}

          <div>
            <label className="mb-2 block text-sm font-medium">
              Categoria
            </label>

            <select
              value={category}
              onChange={(event) =>
                setCategory(event.target.value)
              }
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option>Moradia</option>
              <option>Alimentação</option>
              <option>Transporte</option>
              <option>Saúde</option>
              <option>Educação</option>
              <option>Assinaturas</option>
              <option>Compras</option>
              <option>Lazer</option>
              <option>Impostos</option>
              <option>Outros</option>
            </select>
          </div>

          {/* Conta */}

          <div>
            <label className="mb-2 block text-sm font-medium">
              Conta
            </label>

            <select
              value={accountId}
              onChange={(event) =>
                setAccountId(event.target.value)
              }
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              {accounts.map((account) => (
                <option
                  key={account.id}
                  value={account.id}
                >
                  {account.name}
                </option>
              ))}
            </select>
          </div>

          {/* Forma de pagamento */}

          <div>
            <label className="mb-2 block text-sm font-medium">
              Forma de pagamento
            </label>

            <select
              value={paymentMethod}
              onChange={(event) =>
                setPaymentMethod(event.target.value)
              }
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option>Pix</option>
              <option>Cartão de crédito</option>
              <option>Cartão de débito</option>
              <option>Transferência</option>
              <option>Boleto</option>
              <option>Dinheiro</option>
            </select>
          </div>

          {/* Recorrência */}

          <div>
            <label className="mb-2 block text-sm font-medium">
              Recorrência
            </label>

            <select
              value={recurrence}
              onChange={(event) =>
                setRecurrence(
                  event.target.value as BillRecurrence
                )
              }
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="none">
                Não se repete
              </option>

              <option value="weekly">
                Semanal
              </option>

              <option value="monthly">
                Mensal
              </option>

              <option value="yearly">
                Anual
              </option>
            </select>
          </div>

          {/* Observações */}

          <div>
            <label className="mb-2 block text-sm font-medium">
              Observações
            </label>

            <input
              value={notes}
              onChange={(event) =>
                setNotes(event.target.value)
              }
              placeholder="Opcional"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Botão */}

          <div className="flex items-end justify-end md:col-span-2">
            <button
              type="submit"
              className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              + Adicionar conta
            </button>
          </div>

        </form>

      </div>

      {/* Lista */}

      <div className="rounded-2xl bg-white p-6 shadow-sm">

        <div>
          <h2 className="text-lg font-bold">
            Próximas contas
          </h2>

          <p className="text-sm text-gray-500">
            Acompanhe seus vencimentos.
          </p>
        </div>

        <div className="mt-6 space-y-3">

          {sortedBills.length === 0 ? (
            <div className="rounded-xl bg-gray-50 py-10 text-center">
              <p className="text-gray-400">
                Nenhuma conta cadastrada.
              </p>
            </div>
          ) : (
            sortedBills.map((bill) => {

              const status =
                getCalculatedStatus(bill)

              return (
                <div
                  key={bill.id}
                  className="flex flex-col gap-4 rounded-2xl border border-gray-100 p-5 transition hover:border-blue-200 hover:shadow-sm md:flex-row md:items-center md:justify-between"
                >

                  <div className="flex items-center gap-4">

                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
                        status === 'paid'
                          ? 'bg-green-50'
                          : status === 'overdue'
                            ? 'bg-red-50'
                            : 'bg-yellow-50'
                      }`}
                    >
                      {status === 'paid'
                        ? '✅'
                        : status === 'overdue'
                          ? '⚠️'
                          : '⏰'}
                    </div>

                    <div>

                      <div className="flex flex-wrap items-center gap-2">

                        <p className="font-semibold">
                          {bill.name}
                        </p>

                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClass(status)}`}
                        >
                          {getStatusLabel(status)}
                        </span>

                      </div>

                      <p className="mt-1 text-sm text-gray-500">
                        {bill.category}
                        {' • '}
                        {getAccountName(
                          bill.accountId
                        )}
                        {' • '}
                        {bill.paymentMethod}
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        {getDueText(bill)}
                      </p>

                    </div>

                  </div>

                  <div className="flex items-center justify-between gap-6 md:justify-end">

                    <div className="text-right">

                      <p className="text-lg font-bold">
                        {formatCurrency(
                          bill.amount
                        )}
                      </p>

                      <p className="text-xs text-gray-400">
                        {new Date(
                          `${bill.dueDate}T00:00:00`
                        ).toLocaleDateString(
                          'pt-BR'
                        )}
                      </p>

                    </div>

                    {status !== 'paid' && (
                      <button
                        onClick={() =>
                          markAsPaid(bill)
                        }
                        className="rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700"
                      >
                        Marcar como paga
                      </button>
                    )}

                  </div>

                </div>
              )
            })
          )}

        </div>

      </div>

    </div>
  )
}

export default Bills
