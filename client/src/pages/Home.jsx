import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import BalanceCard from '../components/BalanceCard'
import QuickActionCard from '../components/QuickActionCard'
import TransactionList from '../components/TransactionList'
import useFluxStore from '../store/useFluxStore'

export default function Home() {
  const { refreshData, balance, transactions, user } = useFluxStore()
  const [insights, setInsights] = useState([])
  const API_URL = import.meta.env.VITE_API_URL || '/api'

  useEffect(() => {
    refreshData()
    loadInsights()
  }, [refreshData])

  const loadInsights = async () => {
    try {
      const res = await fetch(`${API_URL}/insights?userId=${user?.id || 1}`)
      const data = await res.json()
      setInsights(data.insights || [])
    } catch (error) {
      console.error('Erro ao carregar insights:', error)
    }
  }

  const income = transactions
    .filter((t) => t.direction === 'credit')
    .reduce((acc, t) => acc + Number(t.amount), 0)
  const outcome = transactions
    .filter((t) => t.direction === 'debit')
    .reduce((acc, t) => acc + Number(t.amount), 0)

  const displayName = user?.username === 'flux' ? 'Admin' : user?.name || 'Flux'

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <p className="text-xs text-soft">Experiência personalizada</p>
            <h2 className="text-xl font-semibold">Olá, {displayName}</h2>
          </div>
          <span className="text-xs text-soft bg-white px-3 py-1 rounded-full border border-gray-200">
            Interface otimizada para mobile, tablet e web
          </span>
        </div>
      </div>

      <BalanceCard balance={balance} income={income} outcome={outcome} />

      {insights.length > 0 && (
        <div className="space-y-3">
          <h3 className="section-title">💡 Insights Financeiros</h3>
          <div className="grid gap-3 md:grid-cols-2">
            {insights.map((insight, idx) => (
              <div
                key={idx}
                className={`card p-4 border-l-4 ${
                  insight.type === 'warning'
                    ? 'border-amber-500 bg-amber-50'
                    : insight.type === 'success'
                    ? 'border-green-500 bg-green-50'
                    : 'border-blue-500 bg-blue-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{insight.icon}</span>
                  <div className="flex-1">
                    <p className="font-semibold text-ink">{insight.message}</p>
                    {insight.detail && <p className="text-sm text-soft mt-1">{insight.detail}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-3">
        <h3 className="section-title">Serviços Flux</h3>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            to="/servicos/compras"
            className="card p-5 space-y-2 border border-gray-100 hover:shadow-lg transition group"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-ink">Compras com cashback</h3>
              <span
                className="h-10 w-10 rounded-2xl flex items-center justify-center text-white font-bold"
                style={{ background: '#8b5cf6' }}
              >
                →
              </span>
            </div>
            <p className="text-sm text-soft">
              Registre compras e receba 5% de volta instantaneamente.
            </p>
            <p className="text-sm font-semibold text-flux">Acessar serviço</p>
          </Link>

          <Link
            to="/servicos/seguro"
            className="card p-5 space-y-2 border border-gray-100 hover:shadow-lg transition group"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-ink">Seguro dedicado</h3>
              <span
                className="h-10 w-10 rounded-2xl flex items-center justify-center text-white font-bold"
                style={{ background: '#0f172a' }}
              >
                →
              </span>
            </div>
            <p className="text-sm text-soft">
              Ative cobertura e veja o lançamento no extrato na hora.
            </p>
            <p className="text-sm font-semibold text-flux">Acessar serviço</p>
          </Link>

          <Link
            to="/servicos/emprestimo"
            className="card p-5 space-y-2 border border-gray-100 hover:shadow-lg transition group"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-ink">Empréstimo</h3>
              <span
                className="h-10 w-10 rounded-2xl flex items-center justify-center text-white font-bold"
                style={{ background: '#10b981' }}
              >
                →
              </span>
            </div>
            <p className="text-sm text-soft">Libere crédito direto no saldo com recibo oficial.</p>
            <p className="text-sm font-semibold text-flux">Acessar serviço</p>
          </Link>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="section-title">Ações Rápidas</h3>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <QuickActionCard title="PIX" description="Envio imediato" to="/pix" accent="#ED1C24" />
          <QuickActionCard
            title="Pagamentos"
            description="Boletos e cobranças"
            to="/pagamentos"
            accent="#0ea5e9"
          />
          <QuickActionCard
            title="Recarga"
            description="Qualquer operadora"
            to="/recarga"
            accent="#f97316"
          />
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="section-title">Últimos movimentos</h3>
          <Link to="/extrato" className="text-sm text-flux font-semibold">
            Ver extrato completo →
          </Link>
        </div>
        <TransactionList transactions={transactions.slice(0, 5)} />
      </div>
    </div>
  )
}
