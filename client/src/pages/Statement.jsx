import React, { useEffect, useState } from 'react'
import TransactionList from '../components/TransactionList'
import CategoryChart from '../components/CategoryChart'
import TypeChart from '../components/TypeChart'
import useFluxStore from '../store/useFluxStore'

export default function Statement() {
  const { transactions, totals, refreshData, balance, categories } = useFluxStore()
  const [typeFilter, setTypeFilter] = useState('Todas')
  const [categoryFilter, setCategoryFilter] = useState('Todas')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [activeTab, setActiveTab] = useState('current') // 'current' ou 'future'

  // Tipos fixos de transação (sem PIX Recebido)
  const transactionTypes = [
    { value: 'Todas', label: 'Todas' },
    { value: 'PIX_ENVIADO', label: 'PIX Enviado' },
    { value: 'PAGAMENTO', label: 'Contas' },
    { value: 'RECARGA', label: 'Recarga' },
    { value: 'COMPRA_CASHBACK', label: 'Compras' },
    { value: 'SEGURO', label: 'Seguros' },
    { value: 'EMPRESTIMO', label: 'Empréstimos' },
  ]

  useEffect(() => {
    refreshData()
  }, [refreshData])

  const handleCategoryFilter = (value) => {
    setCategoryFilter(value)
  }

  const handleTypeFilter = (value) => {
    setTypeFilter(value)
  }

  // Separar transações atuais e futuras
  const now = new Date()
  const currentTransactions = transactions.filter((tx) => new Date(tx.created_at) <= now)
  const futureTransactions = transactions.filter((tx) => new Date(tx.created_at) > now)

  // Filtrar transações por tipo, categoria e período
  const filterTransactions = (txList) => {
    return txList.filter((tx) => {
      // Filtro de tipo
      if (typeFilter !== 'Todas' && tx.type !== typeFilter) {
        return false
      }

      // Filtro de categoria
      if (categoryFilter !== 'Todas') {
        if (!tx.category_id) return false
        const category = categories.find((c) => c.id === tx.category_id)
        if (category?.name !== categoryFilter) return false
      }

      // Filtro de período
      if (startDate || endDate) {
        const txDate = new Date(tx.created_at)

        if (startDate) {
          const start = new Date(startDate)
          start.setHours(0, 0, 0, 0)
          if (txDate < start) return false
        }

        if (endDate) {
          const end = new Date(endDate)
          end.setHours(23, 59, 59, 999)
          if (txDate > end) return false
        }
      }

      return true
    })
  }

  const filteredCurrent = filterTransactions(currentTransactions)
  const filteredFuture = filterTransactions(futureTransactions)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="section-title">Extrato inteligente</h2>
          <p className="text-sm text-soft">Filtre suas transações por tipo, categoria e período</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 text-sm">
          Saldo atualizado: <span className="font-semibold">R$ {balance.toFixed(2)}</span>
        </div>
      </div>

      {/* Gráficos lado a lado */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CategoryChart
          totals={totals}
          categories={categories}
          onCategoryClick={handleCategoryFilter}
          selectedCategory={categoryFilter !== 'Todas' ? categoryFilter : null}
        />
        <TypeChart
          transactions={currentTransactions}
          onTypeClick={handleTypeFilter}
          selectedType={typeFilter !== 'Todas' ? typeFilter : null}
        />
      </div>

      {/* Filtros em linha */}
      <div className="card p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="text-xs uppercase text-soft tracking-wide block mb-2">
              Filtrar por tipo
            </label>
            <select
              className="input-base"
              value={typeFilter}
              onChange={(e) => handleTypeFilter(e.target.value)}
            >
              {transactionTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs uppercase text-soft tracking-wide block mb-2">
              Filtrar por categoria
            </label>
            <select
              className="input-base"
              value={categoryFilter}
              onChange={(e) => handleCategoryFilter(e.target.value)}
            >
              <option value="Todas">Todas</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs uppercase text-soft tracking-wide block mb-2">
              Data inicial
            </label>
            <input
              type="date"
              className="input-base"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs uppercase text-soft tracking-wide block mb-2">
              Data final
            </label>
            <input
              type="date"
              className="input-base"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
        {(startDate || endDate) && (
          <button
            className="text-sm text-primary hover:underline mt-2"
            onClick={() => {
              setStartDate('')
              setEndDate('')
            }}
          >
            Limpar período
          </button>
        )}
      </div>

      {/* Abas de transações */}
      <div className="card">
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'current'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-soft hover:text-ink'
              }`}
              onClick={() => setActiveTab('current')}
            >
              Transações Atuais ({filteredCurrent.length})
            </button>
            <button
              className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'future'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-soft hover:text-ink'
              }`}
              onClick={() => setActiveTab('future')}
            >
              Despesas Futuras ({filteredFuture.length})
            </button>
          </div>
        </div>

        <div className="p-4">
          {activeTab === 'current' ? (
            filteredCurrent.length > 0 ? (
              <TransactionList transactions={filteredCurrent} />
            ) : (
              <p className="text-center text-soft py-8">Nenhuma transação atual encontrada</p>
            )
          ) : filteredFuture.length > 0 ? (
            <TransactionList transactions={filteredFuture} />
          ) : (
            <p className="text-center text-soft py-8">Nenhuma despesa futura encontrada</p>
          )}
        </div>
      </div>
    </div>
  )
}
