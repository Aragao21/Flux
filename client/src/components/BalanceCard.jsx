import React from 'react';
import { ArrowUpRightIcon, ArrowDownLeftIcon } from './Icons';

export default function BalanceCard({ balance, income, outcome }) {
  return (
    <div className="card p-6 flex flex-col gap-4 bg-gradient-to-br from-white via-white to-red-50">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-soft">Saldo atual</p>
          <p className="text-3xl font-bold text-ink">R$ {balance.toFixed(2)}</p>
        </div>
        <div className="h-12 w-12 rounded-2xl bg-flux text-white flex items-center justify-center font-semibold">Flux</div>
      </div>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-white shadow-sm border border-gray-100">
          <span className="h-9 w-9 rounded-xl bg-green-100 text-green-700 flex items-center justify-center">
            <ArrowDownLeftIcon />
          </span>
          <div>
            <p className="text-soft">Entradas</p>
            <p className="font-semibold">R$ {income.toFixed(2)}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-xl bg-white shadow-sm border border-gray-100">
          <span className="h-9 w-9 rounded-xl bg-red-100 text-red-700 flex items-center justify-center">
            <ArrowUpRightIcon />
          </span>
          <div>
            <p className="text-soft">Saídas</p>
            <p className="font-semibold">R$ {outcome.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
