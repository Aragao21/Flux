import React, { useState } from 'react';
import useFluxStore from '../store/useFluxStore';

export default function Recharge() {
  const { post, loading } = useFluxStore();
  const [form, setForm] = useState({ amount: '', phone: '', operator: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await post('/recharges', form);
    setMessage(res.message);
  };

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <form className="card p-6 space-y-4" onSubmit={handleSubmit}>
        <h2 className="section-title">Recarga de celular</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-soft">Telefone</label>
            <input name="phone" className="input-base mt-1" placeholder="11999998888" value={form.phone} onChange={handleChange} />
          </div>
          <div>
            <label className="text-sm text-soft">Operadora</label>
            <input name="operator" className="input-base mt-1" placeholder="Claro" value={form.operator} onChange={handleChange} />
          </div>
        </div>
        <div>
          <label className="text-sm text-soft">Valor</label>
          <input name="amount" className="input-base mt-1" placeholder="50.00" value={form.amount} onChange={handleChange} />
        </div>
        <button className="button-primary" disabled={loading}>
          {loading ? 'Recarregando...' : 'Confirmar recarga'}
        </button>
        {message && <p className="text-sm text-green-700">{message}</p>}
        <p className="text-xs text-soft">A categoria é atribuída como "Telefone" automaticamente.</p>
      </form>
      <div className="card p-6 bg-gradient-to-b from-white via-white to-gray-50 space-y-3">
        <h3 className="text-lg font-semibold">Simulação instantânea</h3>
        <p className="text-sm text-soft">
          Ideal para testar fluxos de UX: altere valores, operadoras e veja o extrato se ajustar em poucos cliques.
        </p>
        <div className="grid grid-cols-3 gap-2 text-sm">
          {[15, 25, 35].map((value) => (
            <button
              key={value}
              type="button"
              className="bg-gray-100 rounded-xl px-3 py-2 hover:bg-gray-200"
              onClick={() => setForm({ ...form, amount: value })}
            >
              R$ {value}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
