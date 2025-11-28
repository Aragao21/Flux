import React, { useState } from 'react';
import useFluxStore from '../store/useFluxStore';

export default function TransactionList({ transactions }) {
  const { contestTransaction, loading } = useFluxStore();
  const [feedback, setFeedback] = useState('');
  const [selected, setSelected] = useState(null);

  const formatCurrency = (value) => `R$ ${Number(value || 0).toFixed(2)}`;
  const formatDate = (value) => new Date(value).toLocaleString('pt-BR');
  const buildReceiptCode = (id) => `FLX-${String(id).padStart(6, '0')}`;

  const handleContest = async (id) => {
    const res = await contestTransaction(id);
    setFeedback(res.message);
  };

  return (
    <div className="card p-4 divide-y divide-gray-100 space-y-3">
      {feedback && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-xl px-3 py-2" role="alert">
          {feedback}
        </div>
      )}
      {transactions.map((tx) => {
        const sign = tx.direction === 'debit' ? '-' : '+';
        const color = tx.direction === 'debit' ? 'text-red-600' : 'text-green-700';
        const showContest = tx.type === 'PIX_ENVIADO';
        return (
          <div
            key={tx.id}
            className="py-3 px-2 -mx-2 rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 hover:bg-gray-50 transition cursor-pointer"
            onClick={() => setSelected(tx)}
          >
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="h-10 w-10 rounded-xl flex items-center justify-center text-lg" style={{ background: '#fef2f2' }}>
                <span style={{ color: tx.categoryMeta?.color || '#ED1C24' }}>{tx.categoryMeta?.icon || '•'}</span>
              </div>
              <div>
                <p className="font-semibold text-ink">{tx.description || tx.category}</p>
                <p className="text-xs text-soft">{tx.category} · {new Date(tx.created_at).toLocaleString('pt-BR')}</p>
                {tx.contested ? (
                  <p className="text-xs text-amber-700">Contestação registrada</p>
                ) : (
                  showContest && (
                    <button
                      className="text-xs text-flux font-semibold underline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleContest(tx.id);
                      }}
                      disabled={loading}
                    >
                      Contestar PIX
                    </button>
                  )
                )}
              </div>
            </div>
            <div className="text-right w-full sm:w-auto">
              <p className={`font-semibold ${color}`}>
                {sign} R$ {Number(tx.amount).toFixed(2)}
              </p>
              <p className="text-xs text-soft">{tx.party}</p>
            </div>
          </div>
        );
      })}

      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-20 p-4" role="dialog" aria-modal="true">
          <div className="bg-white rounded-2xl shadow-2xl w-full sm:max-w-md p-6 space-y-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs uppercase text-soft tracking-wide">Comprovante</p>
                <h4 className="text-lg font-semibold text-ink">{selected.description || selected.category}</h4>
                <p className="text-xs text-soft">{formatDate(selected.created_at)}</p>
              </div>
              <button
                className="text-soft hover:text-ink text-sm font-semibold"
                onClick={() => setSelected(null)}
                aria-label="Fechar comprovante"
              >
                Fechar
              </button>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-soft">Autorização</span>
                <span className="font-semibold">{buildReceiptCode(selected.id)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-soft">Valor</span>
                <span className="font-semibold text-ink">{formatCurrency(selected.amount)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-soft">Tipo</span>
                <span className="font-semibold">{selected.categoryMeta?.label || selected.category}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-soft">Direção</span>
                <span className="font-semibold capitalize">{selected.direction === 'debit' ? 'Débito' : 'Crédito'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-soft">Conta/Chave</span>
                <span className="font-semibold text-right max-w-[60%] truncate">{selected.party}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-soft">Status</span>
                <span className="font-semibold">{selected.contested ? 'Contestada' : 'Liquidada'}</span>
              </div>
            </div>

            {selected.contested && (
              <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-xl px-3 py-2 text-sm">
                Contestação ativa. Estamos analisando esta transferência.
              </div>
            )}

            <button className="button-primary w-full" onClick={() => setSelected(null)}>
              Fechar comprovante
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
