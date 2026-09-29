import { useMemo, useState } from 'react'

import type {
  Transaction,
  TransactionType,
} from '../types/transaction'

import type { Account } from '../types/account'

interface TransactionsProps {
  transactions: Transaction[]
  accounts: Account[]
  onAddTransaction: (
    transaction: Transaction
  ) => void
  onUpdateTransaction: (
    transaction: Transaction
  ) => void
  onDeleteTransaction: (
    transactionId: string
  ) => void
}

type TypeFilter = 'all' | TransactionType
type SortOption =
  | 'date-desc'
  | 'date-asc'
  | 'amount-desc'
  | 'amount-asc'

function Transactions({
  transactions,
  accounts,
  onAddTransaction,
  onUpdateTransaction,
  onDeleteTransaction,
}: TransactionsProps) {
  const [type, setType] =
    useState<TransactionType>('expense')

  const [description, setDescription] =
    useState('')

  const [amount, setAmount] =
    useState('')

  const [date, setDate] =
    useState(
      new Date().toISOString().split('T')[0]
    )

  const [category, setCategory] =
    useState('Alimentação')

  const [accountId, setAccountId] =
    useState(accounts[0]?.id ?? '')

  const [paymentMethod, setPaymentMethod] =
    useState('Cartão de crédito')

  const [editingId, setEditingId] =
    useState<string | null>(null)

  // =========================
  // FILTROS
  // =========================

  const [search, setSearch] =
    useState('')

  const [typeFilter, setTypeFilter] =
    useState<TypeFilter>('all')

  const [categoryFilter, setCategoryFilter] =
    useState('all')

  const [accountFilter, setAccountFilter] =
    useState('all')

  const [sortOption, setSortOption] =
    useState<SortOption>('date-desc')

  // =========================
  // FORMATAÇÃO
  // =========================

  function formatCurrency(value: number) {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })
  }

  function getAccountName(
    accountId: string
  ) {
    const account = accounts.find(
      (account) =>
        account.id === accountId
    )

    return (
      account?.name ??
      'Conta desconhecida'
    )
  }

  // =========================
  // RESETAR FORMULÁRIO
  // =========================

  function resetForm() {
    setType('expense')
    setDescription('')
    setAmount('')

    setDate(
      new Date()
        .toISOString()
        .split('T')[0]
    )

    setCategory('Alimentação')

    setAccountId(
      accounts[0]?.id ?? ''
    )

    setPaymentMethod(
      'Cartão de crédito'
    )

    setEditingId(null)
  }

  // =========================
  // SALVAR
  // =========================

  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    const numericAmount = Number(
      amount.replace(',', '.')
    )

    if (
      !description.trim() ||
      numericAmount <= 0 ||
      !date ||
      !accountId
    ) {
      return
    }

    // =========================
    // EDITAR
    // =========================

    if (editingId) {
      const updatedTransaction: Transaction = {
        id: editingId,
        type,
        description:
          description.trim(),
        amount: numericAmount,
        date,
        category,
        accountId,
        paymentMethod,
      }

      onUpdateTransaction(
        updatedTransaction
      )

      resetForm()

      return
    }

    // =========================
    // NOVO
    // =========================

    const newTransaction: Transaction = {
      id: crypto.randomUUID(),
      type,
      description:
        description.trim(),
      amount: numericAmount,
      date,
      category,
      accountId,
      paymentMethod,
    }

    onAddTransaction(
      newTransaction
    )

    resetForm()
  }

  // =========================
  // EDITAR
  // =========================

  function handleEdit(
    transaction: Transaction
  ) {
    setEditingId(transaction.id)

    setType(transaction.type)

    setDescription(
      transaction.description
    )

    setAmount(
      transaction.amount
        .toString()
        .replace('.', ',')
    )

    setDate(transaction.date)

    setCategory(transaction.category)

    setAccountId(
      transaction.accountId
    )

    setPaymentMethod(
      transaction.paymentMethod
    )

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  // =========================
  // EXCLUIR
  // =========================

  function handleDelete(
    transaction: Transaction
  ) {
    const confirmed =
      window.confirm(
        `Deseja excluir o lançamento "${transaction.description}"?`
      )

    if (!confirmed) {
      return
    }

    onDeleteTransaction(
      transaction.id
    )

    if (
      editingId ===
      transaction.id
    ) {
      resetForm()
    }
  }

  // =========================
  // CATEGORIAS
  // =========================

  const categories = useMemo(() => {
    return Array.from(
      new Set(
        transactions.map(
          (transaction) =>
            transaction.category
        )
      )
    ).sort((a, b) =>
      a.localeCompare(b, 'pt-BR')
    )
  }, [transactions])

  // =========================
  // FILTRAR E ORDENAR
  // =========================

  const filteredTransactions =
    useMemo(() => {
      const normalizedSearch =
        search
          .trim()
          .toLowerCase()

      const result =
        transactions.filter(
          (transaction) => {
            const matchesSearch =
              !normalizedSearch ||
              transaction.description
                .toLowerCase()
                .includes(
                  normalizedSearch
                ) ||
              transaction.category
                .toLowerCase()
                .includes(
                  normalizedSearch
                ) ||
              transaction.paymentMethod
                .toLowerCase()
                .includes(
                  normalizedSearch
                )

            const matchesType =
              typeFilter === 'all' ||
              transaction.type ===
                typeFilter

            const matchesCategory =
              categoryFilter ===
                'all' ||
              transaction.category ===
                categoryFilter

            const matchesAccount =
              accountFilter ===
                'all' ||
              transaction.accountId ===
                accountFilter

            return (
              matchesSearch &&
              matchesType &&
              matchesCategory &&
              matchesAccount
            )
          }
        )

      return [...result].sort(
        (a, b) => {
          if (
            sortOption ===
            'date-desc'
          ) {
            return (
              new Date(
                `${b.date}T00:00:00`
              ).getTime() -
              new Date(
                `${a.date}T00:00:00`
              ).getTime()
            )
          }

          if (
            sortOption ===
            'date-asc'
          ) {
            return (
              new Date(
                `${a.date}T00:00:00`
              ).getTime() -
              new Date(
                `${b.date}T00:00:00`
              ).getTime()
            )
          }

          if (
            sortOption ===
            'amount-desc'
          ) {
            return (
              b.amount - a.amount
            )
          }

          return a.amount - b.amount
        }
      )
    }, [
      transactions,
      search,
      typeFilter,
      categoryFilter,
      accountFilter,
      sortOption,
    ])

  // =========================
  // TOTAL FILTRADO
  // =========================

  const filteredSummary =
    useMemo(() => {
      let income = 0
      let expense = 0

      filteredTransactions.forEach(
        (transaction) => {
          if (
            transaction.type ===
            'income'
          ) {
            income += transaction.amount
          } else {
            expense += transaction.amount
          }
        }
      )

      return {
        income,
        expense,
        balance: income - expense,
      }
    }, [filteredTransactions])

  // =========================
  // LIMPAR FILTROS
  // =========================

  function clearFilters() {
    setSearch('')
    setTypeFilter('all')
    setCategoryFilter('all')
    setAccountFilter('all')
    setSortOption('date-desc')
  }

  const hasFilters =
    search !== '' ||
    typeFilter !== 'all' ||
    categoryFilter !== 'all' ||
    accountFilter !== 'all'

  return (
    <div className="space-y-6">

      {/* =========================
          CABEÇALHO
      ========================= */}

      <div>
        <p className="text-sm text-gray-500">
          Controle financeiro
        </p>

        <h1 className="text-3xl font-bold">
          Lançamentos
        </h1>

        <p className="mt-1 text-gray-500">
          Registre, pesquise e organize
          suas movimentações financeiras.
        </p>
      </div>

      {/* =========================
          RESUMO
      ========================= */}

      <div className="grid gap-4 md:grid-cols-3">

        <div className="rounded-2xl bg-green-50 p-5">
          <p className="text-sm text-green-700">
            Entradas
          </p>

          <p className="mt-2 text-2xl font-bold text-green-700">
            {formatCurrency(
              filteredSummary.income
            )}
          </p>
        </div>

        <div className="rounded-2xl bg-red-50 p-5">
          <p className="text-sm text-red-700">
            Saídas
          </p>

          <p className="mt-2 text-2xl font-bold text-red-700">
            {formatCurrency(
              filteredSummary.expense
            )}
          </p>
        </div>

        <div
          className={`rounded-2xl p-5 ${
            filteredSummary.balance >= 0
              ? 'bg-blue-50'
              : 'bg-orange-50'
          }`}
        >
          <p
            className={`text-sm ${
              filteredSummary.balance >=
              0
                ? 'text-blue-700'
                : 'text-orange-700'
            }`}
          >
            Saldo
          </p>

          <p
            className={`mt-2 text-2xl font-bold ${
              filteredSummary.balance >=
              0
                ? 'text-blue-700'
                : 'text-orange-700'
            }`}
          >
            {formatCurrency(
              filteredSummary.balance
            )}
          </p>
        </div>

      </div>

      {/* =========================
          FORMULÁRIO
      ========================= */}

      <div className="rounded-2xl bg-white p-6 shadow-sm">

        <div className="flex flex-col justify-between gap-2 md:flex-row md:items-center">

          <div>
            <h2 className="text-lg font-bold">
              {editingId
                ? 'Editar lançamento'
                : 'Novo lançamento'}
            </h2>

            <p className="text-sm text-gray-500">
              {editingId
                ? 'Altere os dados do lançamento.'
                : 'Adicione uma nova movimentação financeira.'}
            </p>
          </div>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
            >
              Cancelar edição
            </button>
          )}

        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-6 grid gap-5 md:grid-cols-2"
        >

          {/* TIPO */}

          <div className="md:col-span-2">

            <label className="mb-2 block text-sm font-medium">
              Tipo
            </label>

            <div className="grid grid-cols-2 gap-3">

              <button
                type="button"
                onClick={() =>
                  setType('expense')
                }
                className={`rounded-xl border px-4 py-3 font-medium transition ${
                  type === 'expense'
                    ? 'border-red-500 bg-red-50 text-red-600'
                    : 'border-gray-200 text-gray-600'
                }`}
              >
                📤 Despesa
              </button>

              <button
                type="button"
                onClick={() =>
                  setType('income')
                }
                className={`rounded-xl border px-4 py-3 font-medium transition ${
                  type === 'income'
                    ? 'border-green-500 bg-green-50 text-green-600'
                    : 'border-gray-200 text-gray-600'
                }`}
              >
                📥 Entrada
              </button>

            </div>

          </div>

          {/* DESCRIÇÃO */}

          <div>

            <label className="mb-2 block text-sm font-medium">
              Descrição
            </label>

            <input
              value={description}
              onChange={(event) =>
                setDescription(
                  event.target.value
                )
              }
              placeholder="Ex.: Supermercado"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

          </div>

          {/* VALOR */}

          <div>

            <label className="mb-2 block text-sm font-medium">
              Valor
            </label>

            <input
              value={amount}
              onChange={(event) =>
                setAmount(
                  event.target.value
                )
              }
              placeholder="0,00"
              inputMode="decimal"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

          </div>

          {/* DATA */}

          <div>

            <label className="mb-2 block text-sm font-medium">
              Data
            </label>

            <input
              type="date"
              value={date}
              onChange={(event) =>
                setDate(
                  event.target.value
                )
              }
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

          </div>

          {/* CATEGORIA */}

          <div>

            <label className="mb-2 block text-sm font-medium">
              Categoria
            </label>

            <select
              value={category}
              onChange={(event) =>
                setCategory(
                  event.target.value
                )
              }
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option>Alimentação</option>
              <option>Moradia</option>
              <option>Transporte</option>
              <option>Saúde</option>
              <option>Lazer</option>
              <option>Educação</option>
              <option>Assinaturas</option>
              <option>Compras</option>
              <option>Salário</option>
              <option>Investimentos</option>
              <option>Outros</option>
            </select>

          </div>

          {/* CONTA */}

          <div>

            <label className="mb-2 block text-sm font-medium">
              Conta
            </label>

            <select
              value={accountId}
              onChange={(event) =>
                setAccountId(
                  event.target.value
                )
              }
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >

              {accounts.length === 0 ? (
                <option value="">
                  Nenhuma conta cadastrada
                </option>
              ) : (
                accounts.map(
                  (account) => (
                    <option
                      key={account.id}
                      value={account.id}
                    >
                      {account.name}
                    </option>
                  )
                )
              )}

            </select>

          </div>

          {/* PAGAMENTO */}

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
              <option>
                Cartão de crédito
              </option>

              <option>
                Cartão de débito
              </option>

              <option>Pix</option>

              <option>
                Transferência
              </option>

              <option>Dinheiro</option>

              <option>Boleto</option>
            </select>

          </div>

          {/* BOTÃO */}

          <div className="flex justify-end gap-3 md:col-span-2">

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-xl border border-gray-200 px-6 py-3 font-semibold text-gray-600 hover:bg-gray-50"
              >
                Cancelar
              </button>
            )}

            <button
              type="submit"
              disabled={
                accounts.length === 0
              }
              className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              {editingId
                ? 'Salvar alterações'
                : '+ Adicionar lançamento'}
            </button>

          </div>

        </form>

      </div>

      {/* =========================
          FILTROS
      ========================= */}

      <div className="rounded-2xl bg-white p-6 shadow-sm">

        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">

          <div>
            <h2 className="text-lg font-bold">
              Buscar e filtrar
            </h2>

            <p className="text-sm text-gray-500">
              Encontre rapidamente um lançamento.
            </p>
          </div>

          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
            >
              Limpar filtros
            </button>
          )}

        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-4">

          {/* BUSCA */}

          <div className="lg:col-span-2">

            <label className="mb-2 block text-sm font-medium">
              Buscar
            </label>

            <input
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Descrição, categoria ou pagamento..."
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

          </div>

          {/* TIPO */}

          <div>

            <label className="mb-2 block text-sm font-medium">
              Tipo
            </label>

            <select
              value={typeFilter}
              onChange={(event) =>
                setTypeFilter(
                  event.target.value as TypeFilter
                )
              }
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="all">
                Todos
              </option>

              <option value="income">
                Entradas
              </option>

              <option value="expense">
                Despesas
              </option>
            </select>

          </div>

          {/* CATEGORIA */}

          <div>

            <label className="mb-2 block text-sm font-medium">
              Categoria
            </label>

            <select
              value={categoryFilter}
              onChange={(event) =>
                setCategoryFilter(
                  event.target.value
                )
              }
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >

              <option value="all">
                Todas
              </option>

              {categories.map(
                (item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                )
              )}

            </select>

          </div>

          {/* CONTA */}

          <div>

            <label className="mb-2 block text-sm font-medium">
              Conta
            </label>

            <select
              value={accountFilter}
              onChange={(event) =>
                setAccountFilter(
                  event.target.value
                )
              }
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >

              <option value="all">
                Todas
              </option>

              {accounts.map(
                (account) => (
                  <option
                    key={account.id}
                    value={account.id}
                  >
                    {account.name}
                  </option>
                )
              )}

            </select>

          </div>

          {/* ORDENAÇÃO */}

          <div>

            <label className="mb-2 block text-sm font-medium">
              Ordenar por
            </label>

            <select
              value={sortOption}
              onChange={(event) =>
                setSortOption(
                  event.target.value as SortOption
                )
              }
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >

              <option value="date-desc">
                Mais recentes
              </option>

              <option value="date-asc">
                Mais antigos
              </option>

              <option value="amount-desc">
                Maior valor
              </option>

              <option value="amount-asc">
                Menor valor
              </option>

            </select>

          </div>

        </div>

        <div className="mt-4 flex items-center justify-between text-sm">

          <p className="text-gray-500">
            Mostrando{' '}
            <span className="font-semibold text-gray-700">
              {filteredTransactions.length}
            </span>{' '}
            de{' '}
            <span className="font-semibold text-gray-700">
              {transactions.length}
            </span>{' '}
            lançamento(s)
          </p>

        </div>

      </div>

      {/* =========================
          HISTÓRICO
      ========================= */}

      <div className="rounded-2xl bg-white p-6 shadow-sm">

        <div>

          <h2 className="text-lg font-bold">
            Histórico
          </h2>

          <p className="text-sm text-gray-500">
            Seus lançamentos financeiros.
          </p>

        </div>

        <div className="mt-6 divide-y">

          {filteredTransactions.length ===
          0 ? (

            <div className="rounded-xl bg-gray-50 py-10 text-center">

              <p className="text-gray-400">
                {transactions.length === 0
                  ? 'Nenhum lançamento cadastrado.'
                  : 'Nenhum lançamento encontrado com esses filtros.'}
              </p>

              {transactions.length >
                0 && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-3 text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  Limpar filtros
                </button>
              )}

            </div>

          ) : (

            filteredTransactions.map(
              (transaction) => (

                <div
                  key={transaction.id}
                  className="flex flex-col gap-4 py-5 md:flex-row md:items-center md:justify-between"
                >

                  {/* INFORMAÇÕES */}

                  <div className="flex items-center gap-4">

                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                        transaction.type ===
                        'income'
                          ? 'bg-green-50'
                          : 'bg-red-50'
                      }`}
                    >

                      {transaction.type ===
                      'income'
                        ? '📥'
                        : '📤'}

                    </div>

                    <div>

                      <p className="font-medium">
                        {transaction.description}
                      </p>

                      <p className="text-sm text-gray-500">
                        {transaction.category}
                        {' • '}
                        {getAccountName(
                          transaction.accountId
                        )}
                        {' • '}
                        {transaction.paymentMethod}
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        {new Date(
                          `${transaction.date}T00:00:00`
                        ).toLocaleDateString(
                          'pt-BR'
                        )}
                      </p>

                    </div>

                  </div>

                  {/* VALOR E AÇÕES */}

                  <div className="flex items-center justify-between gap-4 md:justify-end">

                    <p
                      className={`font-bold ${
                        transaction.type ===
                        'income'
                          ? 'text-green-600'
                          : 'text-red-500'
                      }`}
                    >

                      {transaction.type ===
                      'income'
                        ? '+'
                        : '-'}

                      {formatCurrency(
                        transaction.amount
                      )}

                    </p>

                    <div className="flex gap-2">

                      <button
                        type="button"
                        onClick={() =>
                          handleEdit(
                            transaction
                          )
                        }
                        className="rounded-xl border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
                      >
                        Editar
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(
                            transaction
                          )
                        }
                        className="rounded-xl bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100"
                      >
                        Excluir
                      </button>

                    </div>

                  </div>

                </div>

              )
            )

          )}

        </div>

      </div>

    </div>
  )
}

export default Transactions
