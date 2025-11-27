import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import BalanceCard from '../components/BalanceCard';
import QuickActionCard from '../components/QuickActionCard';
import TransactionList from '../components/TransactionList';
import useFluxStore from '../store/useFluxStore';

export default function Home() {
  const { refreshData, balance, transactions } = useFluxStore();

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const income = transactions.filter((t) => t.direction === 'credit').reduce((acc, t) => acc + Number(t.amount), 0);
  const outcome = transactions.filter((t) => t.direction === 'debit').reduce((acc, t) => acc + Number(t.amount), 0);

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <BalanceCard balance={balance} income={income} outcome={outcome} />
        </div>
        <div className="card p-4 flex flex-col gap-3 bg-ink text-white">
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
            <Link to="/extrato" className="bg-white/10 rounded-lg px-3 py-2 hover:bg-white/20">
              Extrato
            </Link>
          </div>
          <p className="text-xs text-gray-300 leading-relaxed">
            Tudo é simulado, mas o fluxo é real: cada ação registra um lançamento categorizado automaticamente.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <QuickActionCard title="PIX" description="Envie ou receba em instantes" to="/pix" accent="#ED1C24" />
        <QuickActionCard title="Pagamentos" description="Boletos e cobranças" to="/pagamentos" accent="#0ea5e9" />
        <QuickActionCard title="Recarga" description="Recarregue qualquer operadora" to="/recarga" accent="#f97316" />
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
