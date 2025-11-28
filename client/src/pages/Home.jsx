import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import BalanceCard from '../components/BalanceCard';
import QuickActionCard from '../components/QuickActionCard';
import TransactionList from '../components/TransactionList';
import useFluxStore from '../store/useFluxStore';

export default function Home() {
  const { refreshData, balance, transactions, user } = useFluxStore();

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const income = transactions.filter((t) => t.direction === 'credit').reduce((acc, t) => acc + Number(t.amount), 0);
  const outcome = transactions.filter((t) => t.direction === 'debit').reduce((acc, t) => acc + Number(t.amount), 0);

  const displayName = user?.username === 'flux' ? 'Admin' : user?.name || 'Flux';

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <p className="text-xs text-soft">Experiência personalizada</p>
            <h2 className="text-xl font-semibold">Olá, {displayName}</h2>
          </div>
          <span className="text-xs text-soft bg-white px-3 py-1 rounded-full border border-gray-200">Interface otimizada para mobile, tablet e web</span>
        </div>
      </div>

      <BalanceCard balance={balance} income={income} outcome={outcome} />

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <QuickActionCard title="PIX" description="Envio imediato" to="/pix" accent="#ED1C24" />
        <QuickActionCard title="Pagamentos" description="Boletos e cobranças" to="/pagamentos" accent="#0ea5e9" />
        <QuickActionCard title="Recarga" description="Qualquer operadora" to="/recarga" accent="#f97316" />
        <QuickActionCard title="Compras com cashback" description="5% de volta" to="/servicos#cashback" accent="#8b5cf6" />
        <QuickActionCard title="Seguro" description="Cobertura ativa" to="/servicos#seguro" accent="#0f172a" />
        <QuickActionCard title="Empréstimo" description="Crédito imediato" to="/servicos#emprestimo" accent="#10b981" />
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
  );
}
