import { useMemo, useState } from 'react'

import type { Bill, BillStatus } from '../types/bill'
import type { Account } from '../types/account'

interface PlanningProps {
  bills: Bill[]
  accounts: Account[]
  onAddBill: (bill: Bill) => void
  onUpdateBillStatus: (
    id: string,
    status: BillStatus
  ) => void
}

function Planning({
  bills,
  accounts,
  onAddBill,
  onUpdateBillStatus,
}: PlanningProps) {
  const [showForm, setShowForm] = useState(false)

  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [dueDate, setDueDate] = useState('2026-10-05')
  const [category, setCategory] = useState('Moradia')
  const [accountId, setAccountId] = useState(
    accounts[0]?.id ?? ''
  )
  const [paymentMethod, setPaymentMethod] =
    useState('Pix')
  const [recurrence, setRecurrence] =
    useState<Bill['recurrence']>('monthly')
  const [notes, setNotes] = useState('')

  function formatCurrency(value: number) {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })
  }

  function formatDate(date: string) {
    return new Date(
      `${date}T00:00:00`
    ).toLocaleDateString('pt-BR')
  }

  function getToday() {
    const today = new Date()

    return new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    )
  }

  function getBillDate(date: string) {
    const [year, month, day] =
      date.split('-').map(Number)

    return new Date(year, month - 1, day)
  }

  function getDaysUntilDue(date: string) {
    const today = getToday()
    const dueDate = getBillDate(date)

    const difference =
      dueDate.getTime() - today.getTime()

    return Math.ceil(
      difference / (1000 * 60 * 60 * 24)
    )
  }

  function getStatusLabel(bill: Bill) {
    if (bill.status === 'paid') {
      return 'Paga'
    }

    const days = getDaysUntilDue(bill.dueDate)

    if (days < 0) {
      return 'Atrasada'
    }

    if (days === 0) {
      return 'Vence hoje'
    }

    if (days <= 7) {
      return `Vence em ${days} dia${
        days === 1 ? '' : 's'
      }`
    }

    return 'Futura'
  }

  function getStatusColor(bill: Bill) {
    if (bill.status === 'paid') {
      return 'bg-green-50 text-green-700'
    }

    const days = getDaysUntilDue(bill.dueDate)

    if (days < 0) {
      return 'bg-red-50 text-red-700'
    }

    if (days === 0) {
      return 'bg-orange-50 text-orange-700'
    }

    if (days <= 7) {
      return 'bg-yellow-50 text-yellow-700'
    }

    return 'bg-blue-50 text-blue-700'
  }

  function getAccountName(accountId: string) {
    return (
      accounts.find(
        (account) => account.id === accountId
      )?.name ?? 'Conta desconhecida'
    )
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
      createdAt:
        new Date().toISOString().split('T')[0],
    }

    onAddBill(newBill)

    setName('')
    setAmount('')
    setDueDate('2026-10-05')
    setCategory('Moradia')
    setAccountId(accounts[0]?.id ?? '')
    setPaymentMethod('Pix')
    setRecurrence('monthly')
    setNotes('')
    setShowForm(false)
  }

  const pendingBills = useMemo(
    () =>
      bills.filter(
        (bill) => bill.status === 'pending'
      ),
    [bills]
  )

  const overdueBills = useMemo(
    () =>
      pendingBills.filter(
        (bill) =>
          getDaysUntilDue(bill.dueDate) < 0
      ),
    [pendingBills]
  )

  const todayBills = useMemo(
    () =>
      pendingBills.filter(
        (bill) =>
          getDaysUntilDue(bill.dueDate) === 0
      ),
    [pendingBills]
  )

  const upcomingBills = useMemo(
    () =>
      pendingBills.filter((bill) => {
        const days = getDaysUntilDue(
          bill.dueDate
        )

        return days > 0 && days <= 7
      }),
    [pendingBills]
  )

  const futureBills = useMemo(
    () =>
      pendingBills.filter(
        (bill) =>
          getDaysUntilDue(bill.dueDate) > 7
      ),
    [pendingBills]
  )

  const totalPending = pendingBills.reduce(
    (total, bill) => total + bill.amount,
    0
  )

  const totalPaid = bills
    .filter((bill) => bill.status === 'paid')
    .reduce(
      (total, bill) => total + bill.amount,
      0
    )

  const totalOverdue = overdueBills.reduce(
    (total, bill) => total + bill.amount,
    0
  )

  const totalFuture = futureBills.reduce(
    (total, bill) => total + bill.amount,
    0
  )

  const sortedBills = [...bills].sort(
    (a, b) =>
      a.dueDate.localeCompare(b.dueDate)
  )

  return (
    <div className="space-y-6">

      {/* CABEÇALHO */}

      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">

        <div>
          <p className="text-sm text-gray-500">
            Organização financeira
          </p>

          <h1 className="text-3xl font-bold">
            Planejamento
          </h1>

          <p className="mt-1 text-gray-500">
            Controle seus vencimentos, contas e
            compromissos financeiros.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            setShowForm(!showForm)
          }
          className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          {showForm
            ? 'Fechar'
            : '+ Nova conta'}
        </button>

      </div>

      {/* CARDS */}

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Total a pagar
          </p>

          <p className="mt-2 text-2xl font-bold text-red-500">
            {formatCurrency(totalPending)}
          </p>

          <p className="mt-1 text-xs text-gray-400">
            {pendingBills.length} pendente(s)
          </p>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Atrasadas
          </p>

          <p className="mt-2 text-2xl font-bold text-red-600">
            {formatCurrency(totalOverdue)}
          </p>

          <p className="mt-1 text-xs text-gray-400">
            {overdueBills.length} conta(s)
          </p>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Vencendo em 7 dias
          </p>

          <p className="mt-2 text-2xl font-bold text-orange-500">
            {formatCurrency(
              upcomingBills.reduce(
                (total, bill) =>
                  total + bill.amount,
                0
              ) +
                todayBills.reduce(
                  (total, bill) =>
                    total + bill.amount,
                  0
                )
            )}
          </p>

          <p className="mt-1 text-xs text-gray-400">
            {todayBills.length +
              upcomingBills.length}{' '}
            conta(s)
          </p>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Já pagas
          </p>

          <p className="mt-2 text-2xl font-bold text-green-600">
            {formatCurrency(totalPaid)}
          </p>

          <p className="mt-1 text-xs text-gray-400">
            Contas concluídas
          </p>
        </div>

      </div>

      {/* CONTAS FUTURAS */}

      {futureBills.length > 0 && (
        <div className="rounded-2xl bg-blue-50 p-5">

          <div className="flex items-start gap-4">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white">
              📅
            </div>

            <div>
              <h2 className="font-bold text-blue-800">
                Compromissos futuros
              </h2>

              <p className="mt-1 text-sm text-blue-700">
                Você possui {futureBills.length}{' '}
                conta(s) com vencimento superior
                a 7 dias, totalizando{' '}
                {formatCurrency(totalFuture)}.
              </p>
            </div>

          </div>

        </div>
      )}

      {/* ALERTA */}

      {overdueBills.length > 0 && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5">

          <div className="flex items-start gap-4">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100">
              ⚠️
            </div>

            <div>

              <h2 className="font-bold text-red-800">
                Você possui contas atrasadas
              </h2>

              <p className="mt-1 text-sm text-red-700">
                Existem {overdueBills.length}{' '}
                conta(s) vencida(s), totalizando{' '}
                {formatCurrency(totalOverdue)}.
              </p>

            </div>

          </div>

        </div>
      )}

      {/* FORMULÁRIO */}

      {showForm && (
        <div className="rounded-2xl bg-white p-6 shadow-sm">

          <h2 className="text-lg font-bold">
            Nova conta
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Cadastre uma conta a pagar ou receber.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-6 grid gap-5 md:grid-cols-2"
          >

            <div>
              <label className="mb-2 block text-sm font-medium">
                Nome
              </label>

              <input
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                placeholder="Ex.: Aluguel"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

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
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

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
                <option>Lazer</option>
                <option>Compras</option>
                <option>Impostos</option>
                <option>Salário</option>
                <option>Investimentos</option>
                <option>Outros</option>
              </select>
            </div>

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

            <div>
              <label className="mb-2 block text-sm font-medium">
                Forma de pagamento
              </label>

              <select
                value={paymentMethod}
                onChange={(event) =>
                  setPaymentMethod(
                    event.target.value
                  )
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

            <div>
              <label className="mb-2 block text-sm font-medium">
                Recorrência
              </label>

              <select
                value={recurrence}
                onChange={(event) =>
                  setRecurrence(
                    event.target.value as Bill['recurrence']
                  )
                }
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="none">
                  Não recorrente
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

            <div className="flex justify-end md:col-span-2">

              <button
                type="submit"
                className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
              >
                Salvar conta
              </button>

            </div>

          </form>

        </div>
      )}

      {/* PRÓXIMOS VENCIMENTOS */}

      <div className="rounded-2xl bg-white p-6 shadow-sm">

        <div>
          <h2 className="text-lg font-bold">
            Próximos vencimentos
          </h2>

          <p className="text-sm text-gray-500">
            Acompanhe suas contas financeiras.
          </p>
        </div>

        <div className="mt-6 space-y-3">

          {sortedBills.length === 0 ? (

            <div className="py-10 text-center">
              <p className="text-gray-400">
                Nenhuma conta cadastrada.
              </p>
            </div>

          ) : (

            sortedBills.map((bill) => (

              <div
                key={bill.id}
                className="flex flex-col gap-4 rounded-xl border border-gray-100 p-4 md:flex-row md:items-center md:justify-between"
              >

                <div className="flex items-center gap-4">

                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                      bill.status === 'paid'
                        ? 'bg-green-50'
                        : 'bg-blue-50'
                    }`}
                  >
                    {bill.status === 'paid'
                      ? '✓'
                      : '📅'}
                  </div>

                  <div>

                    <p className="font-semibold">
                      {bill.name}
                    </p>

                    <p className="text-sm text-gray-500">
                      {bill.category}
                      {' • '}
                      {getAccountName(
                        bill.accountId
                      )}
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      Vencimento:{' '}
                      {formatDate(bill.dueDate)}
                    </p>

                  </div>

                </div>

                <div className="flex flex-col items-start gap-2 md:items-end">

                  <p className="text-lg font-bold">
                    {formatCurrency(bill.amount)}
                  </p>

                  <div className="flex flex-wrap items-center gap-2">

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(
                        bill
                      )}`}
                    >
                      {getStatusLabel(bill)}
                    </span>

                    {bill.status !== 'paid' && (
                      <button
                        type="button"
                        onClick={() =>
                          onUpdateBillStatus(
                            bill.id,
                            'paid'
                          )
                        }
                        className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-700"
                      >
                        Marcar como paga
                      </button>
                    )}

                  </div>

                </div>

              </div>

            ))
          )}

        </div>

      </div>

      {/* RECORRÊNCIAS */}

      <div className="rounded-2xl bg-white p-6 shadow-sm">

        <h2 className="text-lg font-bold">
          Contas recorrentes
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Compromissos que se repetem automaticamente.
        </p>

        <div className="mt-5 grid gap-3 md:grid-cols-2 lg:grid-cols-3">

          {bills.filter(
            (bill) =>
              bill.recurrence !== 'none'
          ).length === 0 ? (

            <p className="text-sm text-gray-400">
              Nenhuma conta recorrente.
            </p>

          ) : (

            bills
              .filter(
                (bill) =>
                  bill.recurrence !== 'none'
              )
              .map((bill) => (

                <div
                  key={bill.id}
                  className="rounded-xl bg-gray-50 p-4"
                >

                  <p className="font-semibold">
                    {bill.name}
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    {formatCurrency(bill.amount)}
                  </p>

                  <p className="mt-2 text-xs font-medium text-blue-600">
                    {bill.recurrence === 'weekly'
                      ? 'Semanal'
                      : bill.recurrence === 'monthly'
                        ? 'Mensal'
                        : 'Anual'}
                  </p>

                </div>

              ))
          )}

        </div>

      </div>

    </div>
  )
}

export default Planning
