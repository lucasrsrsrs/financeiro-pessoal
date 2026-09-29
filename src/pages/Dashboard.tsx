import type { Transaction } from '../types/transaction'
import type { Account } from '../types/account'
import type { Bill, BillStatus } from '../types/bill'

interface DashboardProps {
  transactions: Transaction[]
  accounts: Account[]
  bills: Bill[]
}

function Dashboard({
  transactions,
  accounts,
  bills,
}: DashboardProps) {
  function formatCurrency(value: number) {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })
  }

  function getBillStatus(bill: Bill): BillStatus {
    if (bill.status === 'paid') {
      return 'paid'
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const dueDate = new Date(
      `${bill.dueDate}T00:00:00`
    )

    return dueDate < today
      ? 'overdue'
      : 'pending'
  }

  const totalIncome = transactions
    .filter(
      (transaction) =>
        transaction.type === 'income'
    )
    .reduce(
      (total, transaction) =>
        total + transaction.amount,
      0
    )

  const totalExpense = transactions
    .filter(
      (transaction) =>
        transaction.type === 'expense'
    )
    .reduce(
      (total, transaction) =>
        total + transaction.amount,
      0
    )

  const balance = totalIncome - totalExpense

  const pendingBills = bills.filter(
    (bill) =>
      getBillStatus(bill) === 'pending'
  )

  const overdueBills = bills.filter(
    (bill) =>
      getBillStatus(bill) === 'overdue'
  )

  const paidBills = bills.filter(
    (bill) =>
      getBillStatus(bill) === 'paid'
  )

  const pendingBillsAmount =
    pendingBills.reduce(
      (total, bill) =>
        total + bill.amount,
      0
    )

  const overdueBillsAmount =
    overdueBills.reduce(
      (total, bill) =>
        total + bill.amount,
      0
    )

  const paidBillsAmount =
    paidBills.reduce(
      (total, bill) =>
        total + bill.amount,
      0
    )

  const expensesByCategory =
    transactions
      .filter(
        (transaction) =>
          transaction.type === 'expense'
      )
      .reduce<Record<string, number>>(
        (categories, transaction) => {
          categories[transaction.category] =
            (categories[transaction.category] || 0) +
            transaction.amount

          return categories
        },
        {}
      )

  const categories = Object.entries(
    expensesByCategory
  )
    .sort(
      ([, amountA], [, amountB]) =>
        amountB - amountA
    )
    .slice(0, 6)

  const accountBalances = accounts.map(
    (account) => {
      const accountTransactions =
        transactions.filter(
          (transaction) =>
            transaction.accountId ===
            account.id
        )

      const income =
        accountTransactions
          .filter(
            (transaction) =>
              transaction.type === 'income'
          )
          .reduce(
            (total, transaction) =>
              total + transaction.amount,
            0
          )

      const expense =
        accountTransactions
          .filter(
            (transaction) =>
              transaction.type === 'expense'
          )
          .reduce(
            (total, transaction) =>
              total + transaction.amount,
            0
          )

      return {
        ...account,
        balance:
          account.initialBalance +
          income -
          expense,
      }
    }
  )

  const recentTransactions = [
    ...transactions,
  ]
    .sort(
      (a, b) =>
        new Date(
          `${b.date}T00:00:00`
        ).getTime() -
        new Date(
          `${a.date}T00:00:00`
        ).getTime()
    )
    .slice(0, 5)

  const upcomingBills = [
    ...bills,
  ]
    .filter(
      (bill) =>
        getBillStatus(bill) !== 'paid'
    )
    .sort(
      (a, b) =>
        new Date(
          `${a.dueDate}T00:00:00`
        ).getTime() -
        new Date(
          `${b.dueDate}T00:00:00`
        ).getTime()
    )
    .slice(0, 5)

  const getAccountName = (
    accountId: string
  ) => {
    const account = accounts.find(
      (item) => item.id === accountId
    )

    return (
      account?.name ??
      'Conta desconhecida'
    )
  }

  return (
    <div className="space-y-6">

      {/* CABEÇALHO */}

      <div>
        <p className="text-sm text-gray-500">
          Visão geral
        </p>

        <h1 className="text-3xl font-bold">
          Dashboard
        </h1>

        <p className="mt-1 text-gray-500">
          Acompanhe sua vida financeira em um só lugar.
        </p>
      </div>

      {/* CARDS PRINCIPAIS */}

      <div className="grid gap-5 md:grid-cols-3">

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Entradas
            </p>

            <span className="rounded-xl bg-green-50 p-2">
              📥
            </span>
          </div>

          <p className="mt-4 text-3xl font-bold text-green-600">
            {formatCurrency(totalIncome)}
          </p>

          <p className="mt-2 text-xs text-gray-400">
            Total de receitas
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Despesas
            </p>

            <span className="rounded-xl bg-red-50 p-2">
              📤
            </span>
          </div>

          <p className="mt-4 text-3xl font-bold text-red-500">
            {formatCurrency(totalExpense)}
          </p>

          <p className="mt-2 text-xs text-gray-400">
            Total de gastos
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Saldo
            </p>

            <span className="rounded-xl bg-blue-50 p-2">
              💰
            </span>
          </div>

          <p
            className={`mt-4 text-3xl font-bold ${
              balance >= 0
                ? 'text-blue-600'
                : 'text-red-500'
            }`}
          >
            {formatCurrency(balance)}
          </p>

          <p className="mt-2 text-xs text-gray-400">
            Entradas menos despesas
          </p>
        </div>

      </div>

      {/* CONTAS */}

      <div className="grid gap-5 md:grid-cols-3">

        <div className="rounded-2xl bg-yellow-50 p-6">
          <div className="flex items-center justify-between">
            <p className="font-medium text-yellow-700">
              Contas pendentes
            </p>

            <span className="rounded-xl bg-white p-2">
              ⏰
            </span>
          </div>

          <p className="mt-4 text-2xl font-bold text-yellow-700">
            {formatCurrency(pendingBillsAmount)}
          </p>

          <p className="mt-1 text-xs text-yellow-600">
            {pendingBills.length} conta(s) a pagar
          </p>
        </div>

        <div className="rounded-2xl bg-red-50 p-6">
          <div className="flex items-center justify-between">
            <p className="font-medium text-red-700">
              Contas vencidas
            </p>

            <span className="rounded-xl bg-white p-2">
              ⚠️
            </span>
          </div>

          <p className="mt-4 text-2xl font-bold text-red-700">
            {formatCurrency(overdueBillsAmount)}
          </p>

          <p className="mt-1 text-xs text-red-600">
            {overdueBills.length} conta(s) vencida(s)
          </p>
        </div>

        <div className="rounded-2xl bg-green-50 p-6">
          <div className="flex items-center justify-between">
            <p className="font-medium text-green-700">
              Contas pagas
            </p>

            <span className="rounded-xl bg-white p-2">
              ✅
            </span>
          </div>

          <p className="mt-4 text-2xl font-bold text-green-700">
            {formatCurrency(paidBillsAmount)}
          </p>

          <p className="mt-1 text-xs text-green-600">
            {paidBills.length} conta(s) paga(s)
          </p>
        </div>

      </div>

      {/* RESUMO */}

      <div className="grid gap-6 lg:grid-cols-2">

        {/* GASTOS POR CATEGORIA */}

        <div className="rounded-2xl bg-white p-6 shadow-sm">

          <div>
            <h2 className="text-lg font-bold">
              Gastos por categoria
            </h2>

            <p className="text-sm text-gray-500">
              Principais categorias de despesas
            </p>
          </div>

          <div className="mt-6 space-y-5">

            {categories.length === 0 ? (
              <div className="rounded-xl bg-gray-50 py-8 text-center">
                <p className="text-sm text-gray-400">
                  Nenhuma despesa cadastrada.
                </p>
              </div>
            ) : (
              categories.map(
                ([category, amount]) => {
                  const percentage =
                    totalExpense > 0
                      ? (amount / totalExpense) * 100
                      : 0

                  return (
                    <div key={category}>

                      <div className="mb-2 flex items-center justify-between gap-4">
                        <span className="font-medium">
                          {category}
                        </span>

                        <span className="font-semibold">
                          {formatCurrency(amount)}
                        </span>
                      </div>

                      <div className="h-3 overflow-hidden rounded-full bg-gray-100">
                        <div
                          className="h-full rounded-full bg-blue-600"
                          style={{
                            width: `${Math.min(
                              percentage,
                              100
                            )}%`,
                          }}
                        />
                      </div>

                      <p className="mt-1 text-xs text-gray-400">
                        {percentage.toFixed(1)}% das despesas
                      </p>

                    </div>
                  )
                }
              )
            )}

          </div>

        </div>

        {/* RESUMO FINANCEIRO */}

        <div className="rounded-2xl bg-white p-6 shadow-sm">

          <h2 className="text-lg font-bold">
            Resumo financeiro
          </h2>

          <p className="text-sm text-gray-500">
            Visão geral dos seus dados
          </p>

          <div className="mt-6 space-y-4">

            <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4">
              <span className="text-gray-600">
                Lançamentos
              </span>

              <strong>
                {transactions.length}
              </strong>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-green-50 p-4">
              <span className="text-green-700">
                Receitas
              </span>

              <strong className="text-green-700">
                {
                  transactions.filter(
                    (transaction) =>
                      transaction.type === 'income'
                  ).length
                }
              </strong>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-red-50 p-4">
              <span className="text-red-700">
                Despesas
              </span>

              <strong className="text-red-700">
                {
                  transactions.filter(
                    (transaction) =>
                      transaction.type === 'expense'
                  ).length
                }
              </strong>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-blue-50 p-4">
              <span className="text-blue-700">
                Contas
              </span>

              <strong className="text-blue-700">
                {accounts.length}
              </strong>
            </div>

          </div>

        </div>

      </div>

      {/* ÚLTIMOS LANÇAMENTOS */}

      <div className="rounded-2xl bg-white p-6 shadow-sm">

        <div>
          <h2 className="text-lg font-bold">
            Últimos lançamentos
          </h2>

          <p className="text-sm text-gray-500">
            Movimentações financeiras recentes
          </p>
        </div>

        <div className="mt-6 divide-y">

          {recentTransactions.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-sm text-gray-400">
                Nenhum lançamento cadastrado.
              </p>
            </div>
          ) : (
            recentTransactions.map(
              (transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between gap-4 py-4"
                >

                  <div className="flex min-w-0 items-center gap-3">

                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                        transaction.type === 'income'
                          ? 'bg-green-50'
                          : 'bg-red-50'
                      }`}
                    >
                      {transaction.type === 'income'
                        ? '📥'
                        : '📤'}
                    </div>

                    <div className="min-w-0">

                      <p className="truncate font-medium">
                        {transaction.description}
                      </p>

                      <p className="truncate text-xs text-gray-400">
                        {transaction.category}
                        {' • '}
                        {getAccountName(
                          transaction.accountId
                        )}
                      </p>

                    </div>

                  </div>

                  <div className="shrink-0 text-right">

                    <p
                      className={`font-bold ${
                        transaction.type === 'income'
                          ? 'text-green-600'
                          : 'text-red-500'
                      }`}
                    >
                      {transaction.type === 'income'
                        ? '+'
                        : '-'}
                      {formatCurrency(
                        transaction.amount
                      )}
                    </p>

                    <p className="text-xs text-gray-400">
                      {new Date(
                        `${transaction.date}T00:00:00`
                      ).toLocaleDateString(
                        'pt-BR'
                      )}
                    </p>

                  </div>

                </div>
              )
            )
          )}

        </div>

      </div>

      {/* PRÓXIMAS CONTAS */}

      <div className="rounded-2xl bg-white p-6 shadow-sm">

        <div>
          <h2 className="text-lg font-bold">
            Próximas contas
          </h2>

          <p className="text-sm text-gray-500">
            Contas que ainda precisam de pagamento
          </p>
        </div>

        <div className="mt-6 space-y-3">

          {upcomingBills.length === 0 ? (
            <div className="rounded-xl bg-gray-50 py-8 text-center">
              <p className="text-sm text-gray-400">
                Nenhuma conta pendente.
              </p>
            </div>
          ) : (
            upcomingBills.map((bill) => {

              const status =
                getBillStatus(bill)

              return (
                <div
                  key={bill.id}
                  className="flex flex-col gap-3 rounded-xl border border-gray-100 p-4 md:flex-row md:items-center md:justify-between"
                >

                  <div className="flex items-center gap-3">

                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                        status === 'overdue'
                          ? 'bg-red-50'
                          : 'bg-yellow-50'
                      }`}
                    >
                      {status === 'overdue'
                        ? '⚠️'
                        : '⏰'}
                    </div>

                    <div>

                      <p className="font-medium">
                        {bill.name}
                      </p>

                      <p className="text-xs text-gray-400">
                        {bill.category}
                        {' • '}
                        {new Date(
                          `${bill.dueDate}T00:00:00`
                        ).toLocaleDateString(
                          'pt-BR'
                        )}
                      </p>

                    </div>

                  </div>

                  <div className="text-right">

                    <p className="font-bold">
                      {formatCurrency(
                        bill.amount
                      )}
                    </p>

                    <p
                      className={`text-xs font-medium ${
                        status === 'overdue'
                          ? 'text-red-600'
                          : 'text-yellow-600'
                      }`}
                    >
                      {status === 'overdue'
                        ? 'Vencida'
                        : 'Pendente'}
                    </p>

                  </div>

                </div>
              )
            })
          )}

        </div>

      </div>

      {/* SALDOS DAS CONTAS */}

      <div className="rounded-2xl bg-white p-6 shadow-sm">

        <div>
          <h2 className="text-lg font-bold">
            Saldo das contas
          </h2>

          <p className="text-sm text-gray-500">
            Saldo calculado a partir das movimentações.
          </p>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">

          {accountBalances.length === 0 ? (
            <p className="text-sm text-gray-400">
              Nenhuma conta cadastrada.
            </p>
          ) : (
            accountBalances.map(
              (account) => (
                <div
                  key={account.id}
                  className="rounded-xl bg-gray-50 p-4"
                >

                  <p className="text-sm text-gray-500">
                    {account.name}
                  </p>

                  <p
                    className={`mt-2 text-xl font-bold ${
                      account.balance >= 0
                        ? 'text-gray-900'
                        : 'text-red-500'
                    }`}
                  >
                    {formatCurrency(
                      account.balance
                    )}
                  </p>

                </div>
              )
            )
          )}

        </div>

      </div>

    </div>
  )
}

export default Dashboard
