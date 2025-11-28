import React, { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import CurrencyInput, { parseCurrencyToNumber } from '../components/CurrencyInput';
import useFluxStore from '../store/useFluxStore';

export default function Services() {
  const { post, loading, transactions } = useFluxStore();
  const [purchase, setPurchase] = useState({ amount: '0,00', merchant: '' });
  const [insurance, setInsurance] = useState({ amount: '0,00', provider: '' });
  const [loan, setLoan] = useState({ amount: '0,00', description: '' });
  const [message, setMessage] = useState('');
  const location = useLocation();

  const favoriteCategory = useMemo(() => {
    const counts = transactions.reduce((acc, tx) => {
      const key = tx.category || 'Outros';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
    const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
    return top?.[0];
  }, [transactions]);

  const handleSubmit = async (path, payload, onSuccess) => {
    setMessage('');
    const res = await post(path, payload);
    setMessage(res.message || 'Operação concluída e registrada no extrato.');
    if (onSuccess) onSuccess();
  };

  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [location.hash]);

  const personalizedText = favoriteCategory
    ? `Você tem usado bastante ${favoriteCategory}. Ative cashback, seguro ou empréstimo e veja o impacto direto no saldo e no extrato.`
    : 'Escolha um serviço e acompanhe o lançamento instantâneo no extrato.';

  return (
    <div className="space-y-4">
      <div className="card p-6 bg-ink text-white flex flex-col gap-2 shadow-lg">
        <h2 className="text-xl font-semibold">Serviços com engajamento</h2>
        <p className="text-sm text-gray-200">Cashback, seguro e empréstimo com confirmação imediata.</p>
        <p className="text-xs text-gray-200" role="status">
          {personalizedText}
        </p>
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
        <div id="cashback" className="card p-5 space-y-3 scroll-mt-20">
          <div>
            <p className="text-xs text-soft uppercase tracking-wide">Compras com cashback</p>
            <h3 className="text-lg font-semibold text-ink">Ganhe 5% de volta</h3>
            <p className="text-sm text-soft">Registre compras e receba crédito automático de cashback.</p>
          </div>
          <CurrencyInput
            label="Valor da compra"
            name="purchase"
            value={purchase.amount}
            onValueChange={(val) => setPurchase({ ...purchase, amount: val })}
          />
          <div>
            <label className="text-sm text-soft">Estabelecimento</label>
            <input
              className="input-base mt-1"
              placeholder="Loja Flux"
              value={purchase.merchant}
              onChange={(e) => setPurchase({ ...purchase, merchant: e.target.value })}
            />
          </div>
          <button
            className="button-primary w-full"
            disabled={loading}
            onClick={() =>
              handleSubmit(
                '/services/purchase',
                {
                  amount: parseCurrencyToNumber(purchase.amount),
                  merchant: purchase.merchant,
                },
                () => setPurchase({ amount: '0,00', merchant: '' })
              )
            }
          >
            Registrar compra + cashback
          </button>
        </div>

        <div id="seguro" className="card p-5 space-y-3 scroll-mt-20">
          <div>
            <p className="text-xs text-soft uppercase tracking-wide">Seguro</p>
            <h3 className="text-lg font-semibold text-ink">Proteção rápida</h3>
            <p className="text-sm text-soft">Registre um seguro e acompanhe o impacto no saldo.</p>
          </div>
          <CurrencyInput
            label="Mensalidade"
            name="insurance"
            value={insurance.amount}
            onValueChange={(val) => setInsurance({ ...insurance, amount: val })}
          />
          <div>
            <label className="text-sm text-soft">Seguradora</label>
            <input
              className="input-base mt-1"
              placeholder="Flux Protect"
              value={insurance.provider}
              onChange={(e) => setInsurance({ ...insurance, provider: e.target.value })}
            />
          </div>
          <button
            className="button-primary w-full"
            disabled={loading}
            onClick={() =>
              handleSubmit(
                '/services/insurance',
                {
                  amount: parseCurrencyToNumber(insurance.amount),
                  provider: insurance.provider,
                },
                () => setInsurance({ amount: '0,00', provider: '' })
              )
            }
          >
            Registrar seguro
          </button>
        </div>

        <div id="emprestimo" className="card p-5 space-y-3 scroll-mt-20">
          <div>
            <p className="text-xs text-soft uppercase tracking-wide">Empréstimo</p>
            <h3 className="text-lg font-semibold text-ink">Saldo imediato</h3>
            <p className="text-sm text-soft">Libere crédito entrando como saldo em conta.</p>
          </div>
          <CurrencyInput
            label="Valor solicitado"
            name="loan"
            value={loan.amount}
            onValueChange={(val) => setLoan({ ...loan, amount: val })}
          />
          <div>
            <label className="text-sm text-soft">Descrição</label>
            <input
              className="input-base mt-1"
              placeholder="Empréstimo relâmpago"
              value={loan.description}
              onChange={(e) => setLoan({ ...loan, description: e.target.value })}
            />
          </div>
          <button
            className="button-primary w-full"
            disabled={loading}
            onClick={() =>
              handleSubmit(
                '/services/loan',
                {
                  amount: parseCurrencyToNumber(loan.amount),
                  description: loan.description,
                },
                () => setLoan({ amount: '0,00', description: '' })
              )
            }
          >
            Liberar empréstimo
          </button>
        </div>
      </div>

      {message && (
        <div className="bg-green-50 border border-green-200 text-green-800 rounded-xl px-4 py-3" role="alert">
          {message}
        </div>
      )}
    </div>
  );
}
