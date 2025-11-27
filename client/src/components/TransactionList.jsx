import React from 'react';

export default function TransactionList({ transactions }) {
  return (
    <div className="card p-4 divide-y divide-gray-100">
      {transactions.map((tx) => {
        const sign = tx.direction === 'debit' ? '-' : '+';
        const color = tx.direction === 'debit' ? 'text-red-600' : 'text-green-700';
        return (
          <div key={tx.id} className="py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl flex items-center justify-center text-lg" style={{ background: '#fef2f2' }}>
                <span style={{ color: tx.categoryMeta?.color || '#ED1C24' }}>{tx.categoryMeta?.icon || '•'}</span>
              </div>
              <div>
                <p className="font-semibold text-ink">{tx.description || tx.category}</p>
                <p className="text-xs text-soft">{tx.category} · {new Date(tx.created_at).toLocaleString('pt-BR')}</p>
              </div>
            </div>
            <div className="text-right">
              <p className={`font-semibold ${color}`}>
                {sign} R$ {Number(tx.amount).toFixed(2)}
              </p>
              <p className="text-xs text-soft">{tx.party}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
