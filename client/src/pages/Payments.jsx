import React, { useEffect, useState } from 'react';
import useFluxStore from '../store/useFluxStore';
import CurrencyInput, { parseCurrencyToNumber } from '../components/CurrencyInput';

export default function Payments() {
  const { post, loading, tags, refreshData } = useFluxStore();
  const [form, setForm] = useState({ amount: '0,00', barcode: '', description: '', tag: 'Contas' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const numericAmount = parseCurrencyToNumber(form.amount);
    setMessage('');
    const res = await post('/payments', { ...form, amount: numericAmount });
    setMessage(res.message);
    setForm({ amount: '0,00', barcode: '', description: '', tag: form.tag });
  };

  return (
    <div className="max-w-3xl">
      <form className="card p-6 space-y-4" onSubmit={handleSubmit}>
        <h2 className="section-title">Pagamento de contas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-soft">Código de barras</label>
            <input name="barcode" className="input-base mt-1" value={form.barcode} onChange={handleChange} />
          </div>
          <div>
            <label className="text-sm text-soft">Etiqueta</label>
            <select name="tag" className="input-base mt-1" value={form.tag} onChange={handleChange}>
              {['Contas', ...new Set(tags.map((t) => t.name))].map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CurrencyInput
            label="Valor"
            name="amount"
            value={form.amount}
            onValueChange={(val) => setForm({ ...form, amount: val })}
          />
          <div>
            <label className="text-sm text-soft">Descrição</label>
            <input name="description" className="input-base mt-1" value={form.description} onChange={handleChange} />
          </div>
        </div>
        <button className="button-primary" disabled={loading}>
          {loading ? 'Processando...' : 'Pagar boleto'}
        </button>
        {message && (
          <div className="bg-green-50 border border-green-200 text-green-800 rounded-xl px-4 py-3" role="alert">
            {message}
          </div>
        )}
        <p className="text-xs text-soft">Lançamento classificado automaticamente como "Contas".</p>
      </form>
    </div>
  );
}
