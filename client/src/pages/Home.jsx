import React, { useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import BalanceCard from '../components/BalanceCard'
import QuickActionCard from '../components/QuickActionCard'
import TransactionList from '../components/TransactionList'
import useFluxStore from '../store/useFluxStore'

export default function Home() {
  const { refreshData, balance, transactions, user } = useFluxStore()

  useEffect(() => {
    refreshData()
  }, [refreshData])

  const income = transactions
    .filter((t) => t.direction === 'credit')
    .reduce((acc, t) => acc + Number(t.amount), 0)
  const outcome = transactions
    .filter((t) => t.direction === 'debit')
    .reduce((acc, t) => acc + Number(t.amount), 0)

  const suggestedAction = useMemo(() => {
    const last = transactions[0]
    if (!last) return 'Explore serviços com cashback para maximizar benefícios.'
    if (last.category === 'Transferência')
      return 'Experimente contestar lançamentos PIX direto pelo extrato se notar algo estranho.'
    if (last.category === 'Contas')
      return 'Agende seus pagamentos simulados para manter o histórico organizado.'
    return 'Use atalhos para simular novas ações e ver o extrato inteligente em tempo real.'
  }, [transactions])

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

      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-3">
          <BalanceCard balance={balance} income={income} outcome={outcome} />
        </div>
        {/* <div className="card p-4 flex flex-col gap-3 bg-ink text-white">
          <p className="text-sm text-gray-300">Atalhos inteligentes</p>
          <h3 className="text-xl font-semibold">Ações rápidas</h3>
          <div className="flex flex-wrap gap-2 text-sm">
            <Link to="/pix" className="bg-white/10 rounded-lg px-3 py-2 hover:bg-white/20">
              PIX
            </Link>
            <Link to="/pagamentos" className="bg-white/10 rounded-lg px-3 py-2 hover:bg-white/20">
              Pagamentos
            </Link>
            <Link to="/recarga" className="bg-white/10 rounded-lg px-3 py-2 hover:bg-white/20">
              Recarga
            </Link>
            <Link to="/servicos" className="bg-white/10 rounded-lg px-3 py-2 hover:bg-white/20">
              Serviços
            </Link>
            <Link to="/extrato" className="bg-white/10 rounded-lg px-3 py-2 hover:bg-white/20">
              Extrato
            </Link>
          </div>
          <p className="text-xs text-gray-300 leading-relaxed">{suggestedAction}</p>
        </div> */}
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <QuickActionCard title="PIX" description="Envie sem fricção" to="/pix" accent="#ED1C24" />
        <QuickActionCard
          title="Pagamentos"
          description="Boletos e cobranças"
          to="/pagamentos"
          accent="#0ea5e9"
        />
        <QuickActionCard
          title="Recarga"
          description="Recarregue qualquer operadora"
          to="/recarga"
          accent="#f97316"
        />
      </div>

      <div className="space-y-3">
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <QuickActionCard
            title="Compras com cashback"
            description="Ganhe 5% de volta automaticamente"
            to="/servicos#cashback"
            accent="#8b5cf6"
          />
          <QuickActionCard
            title="Seguro"
            description="Proteção simulada com registro imediato"
            to="/servicos#seguro"
            accent="#0f172a"
          />
          <QuickActionCard
            title="Empréstimo"
            description="Saldo liberado na hora"
            to="/servicos#emprestimo"
            accent="#10b981"
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
