import React, { useEffect, useState } from 'react';
import CurrencyInput, { parseCurrencyToNumber } from '../components/CurrencyInput';
import useFluxStore from '../store/useFluxStore';

export default function LoanService() {
  const { post, loading, tags, refreshData } = useFluxStore();
  const [form, setForm] = useState({ amount: '0,00', description: '', tag: 'Empréstimo' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await post('/services/loan', {
      amount: parseCurrencyToNumber(form.amount),
      description: form.description,
      tag: form.tag,
    });
    const feedback = res.message || 'Empréstimo liberado em conta.';
    setMessage(feedback);
    alert(feedback);
    setForm({ amount: '0,00', description: '', tag: form.tag });
  };

  const availableTags = ['Empréstimo', ...new Set(tags.map((t) => t.name))];

  return (
    <div className="max-w-4xl space-y-4">
      <div className="card p-6 space-y-3">
        <h2 className="section-title">Empréstimo</h2>
        <p className="text-sm text-soft">Libere crédito direto no saldo com comprovante imediato.</p>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <CurrencyInput
              label="Valor solicitado"
              name="amount"
              value={form.amount}
              onValueChange={(val) => setForm({ ...form, amount: val })}
            />
            <div>
              <label className="text-sm text-soft">Descrição</label>
              <input
                className="input-base mt-1"
                placeholder="Crédito liberado"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm text-soft">Etiqueta</label>
              <select
                className="input-base mt-1"
                value={form.tag}
                onChange={(e) => setForm({ ...form, tag: e.target.value })}
              >
                {availableTags.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button className="button-primary" disabled={loading}>
            {loading ? 'Liberando...' : 'Liberar empréstimo'}
          </button>
          {message && (
            <div className="bg-green-50 border border-green-200 text-green-800 rounded-xl px-4 py-3" role="alert">
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
