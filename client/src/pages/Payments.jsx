import React, { useState } from 'react';
import useFluxStore from '../store/useFluxStore';
import CurrencyInput, { parseCurrencyToNumber } from '../components/CurrencyInput';

export default function Payments() {
  const { post, loading } = useFluxStore();
  const [form, setForm] = useState({ amount: '0,00', barcode: '', description: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const numericAmount = parseCurrencyToNumber(form.amount);
    setMessage('');
    const res = await post('/payments', { ...form, amount: numericAmount });
    setMessage(res.message);
    setForm({ amount: '0,00', barcode: '', description: '' });
  };

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <form className="card p-6 space-y-4" onSubmit={handleSubmit}>
        <h2 className="section-title">Pagamento de contas</h2>
        <div>
          <label className="text-sm text-soft">Código de barras</label>
          <input name="barcode" className="input-base mt-1" value={form.barcode} onChange={handleChange} />
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
      <div className="card p-6 bg-ink text-white space-y-3">
        <h3 className="text-lg font-semibold">Fluxo guiado</h3>
        <p className="text-sm text-gray-200">
          O pagamento cria uma saída no saldo e registra o código informado. Use descrições curtas para identificar rápido no
          extrato.
        </p>
        <div className="bg-white/10 p-4 rounded-xl text-sm text-gray-100 space-y-1">
          <p>Exemplo:</p>
          <p>Valor: 189.90</p>
          <p>Barras: 34191.79001 01043.510047 91020.150008 5 99680000018990</p>
        </div>
      </div>
    </div>
  );
}
