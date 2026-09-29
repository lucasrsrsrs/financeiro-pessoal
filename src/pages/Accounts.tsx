import type { Account } from '../types/account'
import type { Transaction } from '../types/transaction'

interface AccountsProps {
  accounts: Account[]
  transactions: Transaction[]
  onAddAccount: (account: Account) => void
}

function Accounts({
  accounts,
  transactions,
  onAddAccount,
}: AccountsProps) {

  function getAccountTransactions(account: Account) {
    return transactions.filter(
      (transaction) =>
        transaction.accountId === account.id
    )
  }

  function getAccountBalance(account: Account) {
    const accountTransactions =
      getAccountTransactions(account)

    const income = accountTransactions
      .filter(
        (transaction) =>
          transaction.type === 'income'
      )
      .reduce(
        (total, transaction) =>
          total + transaction.amount,
        0
      )

    const expenses = accountTransactions
      .filter(
        (transaction) =>
          transaction.type === 'expense'
      )
      .reduce(
        (total, transaction) =>
          total + transaction.amount,
        0
      )

    return (
      account.initialBalance +
      income -
      expenses
    )
  }

  function getAccountIncome(account: Account) {
    return getAccountTransactions(account)
      .filter(
        (transaction) =>
          transaction.type === 'income'
      )
      .reduce(
        (total, transaction) =>
          total + transaction.amount,
        0
      )
  }

  function getAccountExpenses(account: Account) {
    return getAccountTransactions(account)
      .filter(
        (transaction) =>
          transaction.type === 'expense'
      )
      .reduce(
        (total, transaction) =>
          total + transaction.amount,
        0
      )
  }

  function formatCurrency(value: number) {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })
  }

  function handleCreateAccount() {
    const name = window.prompt(
      'Nome da nova conta:'
    )

    if (!name?.trim()) {
      return
    }

    const newAccount: Account = {
      id: crypto.randomUUID(),
      name: name.trim(),
      type: 'checking',
      initialBalance: 0,
    }

    onAddAccount(newAccount)
  }

  const totalBalance = accounts.reduce(
    (total, account) =>
      total + getAccountBalance(account),
    0
  )

  const totalIncome = accounts.reduce(
    (total, account) =>
      total + getAccountIncome(account),
    0
  )

  const totalExpenses = accounts.reduce(
    (total, account) =>
      total + getAccountExpenses(account),
    0
  )

  return (
    <div className="space-y-6">

      {/* Cabeçalho */}

      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">

        <div>

          <p className="text-sm text-gray-500">
            Seu dinheiro
          </p>

          <h1 className="text-3xl font-bold">
            Contas
          </h1>

          <p className="mt-1 text-gray-500">
            Acompanhe onde seu dinheiro está.
          </p>

        </div>

        <button
          onClick={handleCreateAccount}
          className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          + Nova conta
        </button>

      </div>

      {/* Saldo total */}

      <div className="rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-white shadow-lg">

        <p className="text-sm text-blue-100">
          Saldo total
        </p>

        <h2 className="mt-2 text-4xl font-bold">
          {formatCurrency(totalBalance)}
        </h2>

        <p className="mt-3 text-sm text-blue-100">
          Somatório das suas contas
        </p>

      </div>

      {/* Resumo */}

      <div className="grid gap-4 md:grid-cols-2">

        <div className="rounded-2xl bg-white p-5 shadow-sm">

          <p className="text-sm text-gray-500">
            Total de entradas
          </p>

          <p className="mt-2 text-2xl font-bold text-green-600">
            {formatCurrency(totalIncome)}
          </p>

        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">

          <p className="text-sm text-gray-500">
            Total de despesas
          </p>

          <p className="mt-2 text-2xl font-bold text-red-500">
            {formatCurrency(totalExpenses)}
          </p>

        </div>

      </div>

      {/* Contas */}

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

        {accounts.map((account) => {

          const balance =
            getAccountBalance(account)

          const income =
            getAccountIncome(account)

          const expenses =
            getAccountExpenses(account)

          const transactionCount =
            getAccountTransactions(account).length

          return (

            <div
              key={account.id}
              className="rounded-2xl bg-white p-6 shadow-sm transition hover:shadow-md"
            >

              {/* Ícone e tipo */}

              <div className="flex items-start justify-between">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-xl">

                  {account.type === 'checking'
                    ? '🏦'
                    : account.type === 'savings'
                      ? '🐷'
                      : '💵'}

                </div>

                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-500">

                  {account.type === 'checking'
                    ? 'Conta'
                    : account.type === 'savings'
                      ? 'Poupança'
                      : 'Dinheiro'}

                </span>

              </div>

              {/* Nome */}

              <p className="mt-6 text-sm text-gray-500">
                {account.name}
              </p>

              {/* Saldo */}

              <p
                className={`mt-1 text-2xl font-bold ${
                  balance >= 0
                    ? 'text-gray-900'
                    : 'text-red-500'
                }`}
              >
                {formatCurrency(balance)}
              </p>

              {/* Informações */}

              <div className="mt-5 space-y-2 border-t pt-4">

                <div className="flex justify-between text-sm">

                  <span className="text-gray-500">
                    Entradas
                  </span>

                  <span className="font-medium text-green-600">
                    {formatCurrency(income)}
                  </span>

                </div>

                <div className="flex justify-between text-sm">

                  <span className="text-gray-500">
                    Despesas
                  </span>

                  <span className="font-medium text-red-500">
                    {formatCurrency(expenses)}
                  </span>

                </div>

                <div className="flex justify-between text-sm">

                  <span className="text-gray-500">
                    Lançamentos
                  </span>

                  <span className="font-medium text-gray-700">
                    {transactionCount}
                  </span>

                </div>

              </div>

            </div>

          )
        })}

      </div>

    </div>
  )
}

export default Accounts
