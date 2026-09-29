import { useEffect, useState } from 'react'

import Dashboard from './pages/Dashboard'
import Transactions from './pages/Transactions'
import Accounts from './pages/Accounts'
import Bills from './pages/Bills'
import Planning from './pages/Planning'

import { transactions as initialTransactions } from './data/transactions'
import { initialAccounts } from './data/accounts'
import { initialBills } from './data/bills'

import type { Transaction } from './types/transaction'
import type { Account } from './types/account'
import type { Bill, BillStatus } from './types/bill'

const TRANSACTIONS_STORAGE_KEY =
  'finance-transactions'

const ACCOUNTS_STORAGE_KEY =
  'finance-accounts'

const BILLS_STORAGE_KEY =
  'finance-bills'

type Page =
  | 'dashboard'
  | 'transactions'
  | 'accounts'
  | 'bills'
  | 'planning'

function App() {
  // =========================
  // TRANSAÇÕES
  // =========================

  const [transactions, setTransactions] =
    useState<Transaction[]>(() => {
      const savedTransactions =
        localStorage.getItem(
          TRANSACTIONS_STORAGE_KEY
        )

      if (savedTransactions) {
        try {
          return JSON.parse(
            savedTransactions
          )
        } catch {
          return initialTransactions
        }
      }

      return initialTransactions
    })

  // =========================
  // CONTAS
  // =========================

  const [accounts, setAccounts] =
    useState<Account[]>(() => {
      const savedAccounts =
        localStorage.getItem(
          ACCOUNTS_STORAGE_KEY
        )

      if (savedAccounts) {
        try {
          return JSON.parse(
            savedAccounts
          )
        } catch {
          return initialAccounts
        }
      }

      return initialAccounts
    })

  // =========================
  // CONTAS A PAGAR
  // =========================

  const [bills, setBills] =
    useState<Bill[]>(() => {
      const savedBills =
        localStorage.getItem(
          BILLS_STORAGE_KEY
        )

      if (savedBills) {
        try {
          return JSON.parse(
            savedBills
          )
        } catch {
          return initialBills
        }
      }

      return initialBills
    })

  // =========================
  // PÁGINA ATUAL
  // =========================

  const [page, setPage] =
    useState<Page>('dashboard')

  // =========================
  // SALVAR TRANSAÇÕES
  // =========================

  useEffect(() => {
    localStorage.setItem(
      TRANSACTIONS_STORAGE_KEY,
      JSON.stringify(transactions)
    )
  }, [transactions])

  // =========================
  // SALVAR CONTAS
  // =========================

  useEffect(() => {
    localStorage.setItem(
      ACCOUNTS_STORAGE_KEY,
      JSON.stringify(accounts)
    )
  }, [accounts])

  // =========================
  // SALVAR CONTAS A PAGAR
  // =========================

  useEffect(() => {
    localStorage.setItem(
      BILLS_STORAGE_KEY,
      JSON.stringify(bills)
    )
  }, [bills])

  // =========================
  // ADICIONAR TRANSAÇÃO
  // =========================

  function handleAddTransaction(
    transaction: Transaction
  ) {
    setTransactions((current) => [
      transaction,
      ...current,
    ])

    setPage('transactions')
  }

  // =========================
  // ATUALIZAR TRANSAÇÃO
  // =========================

  function handleUpdateTransaction(
    updatedTransaction: Transaction
  ) {
    setTransactions((current) =>
      current.map((transaction) =>
        transaction.id ===
        updatedTransaction.id
          ? updatedTransaction
          : transaction
      )
    )
  }

  // =========================
  // EXCLUIR TRANSAÇÃO
  // =========================

  function handleDeleteTransaction(
    transactionId: string
  ) {
    setTransactions((current) =>
      current.filter(
        (transaction) =>
          transaction.id !== transactionId
      )
    )
  }

  // =========================
  // ADICIONAR CONTA
  // =========================

  function handleAddAccount(
    account: Account
  ) {
    setAccounts((current) => [
      ...current,
      account,
    ])

    setPage('accounts')
  }

  // =========================
  // ADICIONAR CONTA A PAGAR
  // =========================

  function handleAddBill(
    bill: Bill
  ) {
    setBills((current) => [
      bill,
      ...current,
    ])

    setPage('bills')
  }

  // =========================
  // ATUALIZAR CONTA A PAGAR
  // =========================

  function handleUpdateBill(
    updatedBill: Bill
  ) {
    setBills((current) =>
      current.map((bill) =>
        bill.id === updatedBill.id
          ? updatedBill
          : bill
      )
    )
  }

  // =========================
  // ATUALIZAR STATUS DA CONTA
  // =========================

  function handleUpdateBillStatus(
    id: string,
    status: BillStatus
  ) {
    setBills((current) =>
      current.map((bill) =>
        bill.id === id
          ? {
              ...bill,
              status,
            }
          : bill
      )
    )
  }

  // =========================
  // INTERFACE
  // =========================

  return (
    <div className="min-h-screen bg-[#f5f7fb]">

      {/* HEADER */}

      <header className="border-b bg-white">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

          <button
            type="button"
            onClick={() =>
              setPage('dashboard')
            }
            className="text-left"
          >
            <h1 className="text-xl font-bold">
              FINANCE
            </h1>

            <p className="text-xs text-gray-500">
              Controle financeiro
            </p>
          </button>

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
            U
          </div>

        </div>
      </header>

      {/* MENU */}

      <nav className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-6 py-3">

          {/* DASHBOARD */}

          <button
            type="button"
            onClick={() =>
              setPage('dashboard')
            }
            className={`whitespace-nowrap rounded-xl px-4 py-2 text-sm font-medium ${
              page === 'dashboard'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            🏠 Dashboard
          </button>

          {/* LANÇAMENTOS */}

          <button
            type="button"
            onClick={() =>
              setPage('transactions')
            }
            className={`whitespace-nowrap rounded-xl px-4 py-2 text-sm font-medium ${
              page === 'transactions'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            💰 Lançamentos
          </button>

          {/* CONTAS */}

          <button
            type="button"
            onClick={() =>
              setPage('accounts')
            }
            className={`whitespace-nowrap rounded-xl px-4 py-2 text-sm font-medium ${
              page === 'accounts'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            🏦 Contas
          </button>

          {/* CONTAS A PAGAR */}

          <button
            type="button"
            onClick={() =>
              setPage('bills')
            }
            className={`whitespace-nowrap rounded-xl px-4 py-2 text-sm font-medium ${
              page === 'bills'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            📅 Contas a pagar
          </button>

          {/* PLANEJAMENTO */}

          <button
            type="button"
            onClick={() =>
              setPage('planning')
            }
            className={`whitespace-nowrap rounded-xl px-4 py-2 text-sm font-medium ${
              page === 'planning'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            📊 Planejamento
          </button>

        </div>
      </nav>

      {/* CONTEÚDO */}

      <main className="mx-auto max-w-7xl p-6 md:p-10">

        {/* DASHBOARD */}

        {page === 'dashboard' && (
          <Dashboard
            transactions={transactions}
            accounts={accounts}
            bills={bills}
          />
        )}

        {/* LANÇAMENTOS */}

        {page === 'transactions' && (
          <Transactions
            transactions={transactions}
            accounts={accounts}
            onAddTransaction={
              handleAddTransaction
            }
            onUpdateTransaction={
              handleUpdateTransaction
            }
            onDeleteTransaction={
              handleDeleteTransaction
            }
          />
        )}

        {/* CONTAS */}

        {page === 'accounts' && (
          <Accounts
            accounts={accounts}
            transactions={transactions}
            onAddAccount={
              handleAddAccount
            }
          />
        )}

        {/* CONTAS A PAGAR */}

        {page === 'bills' && (
          <Bills
            bills={bills}
            accounts={accounts}
            onAddBill={handleAddBill}
            onUpdateBill={
              handleUpdateBill
            }
          />
        )}

        {/* PLANEJAMENTO */}

        {page === 'planning' && (
          <Planning
            bills={bills}
            accounts={accounts}
            onAddBill={handleAddBill}
            onUpdateBillStatus={
              handleUpdateBillStatus
            }
          />
        )}

      </main>

    </div>
  )
}

export default App
