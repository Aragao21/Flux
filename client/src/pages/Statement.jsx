import React, { useEffect } from 'react';
import TransactionList from '../components/TransactionList';
import CategoryChart from '../components/CategoryChart';
import useFluxStore from '../store/useFluxStore';

export default function Statement() {
  const { transactions, totals, refreshData, balance } = useFluxStore();

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="section-title">Extrato inteligente</h2>
          <p className="text-sm text-soft">Categorias automáticas com base no tipo da operação</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 text-sm">
          Saldo atualizado: <span className="font-semibold">R$ {balance.toFixed(2)}</span>
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <TransactionList transactions={transactions} />
        </div>
        <CategoryChart totals={totals} />
      </div>
    </div>
  );
}
