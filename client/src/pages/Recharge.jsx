import React, { useState } from 'react';
import useFluxStore from '../store/useFluxStore';
import CurrencyInput, { parseCurrencyToNumber } from '../components/CurrencyInput';

const maskPhone = (value) => {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  const part1 = digits.slice(0, 2);
  const part2 = digits.slice(2, 7);
  const part3 = digits.slice(7, 11);
  let masked = '';
  if (part1) masked = `(${part1}`;
  if (part1 && part1.length === 2) masked += ') ';
  if (part2) masked += part2;
  if (part3) masked += `-${part3}`;
  return masked;
};

export default function Recharge() {
  const { post, loading } = useFluxStore();
  const [form, setForm] = useState({ amount: '0,00', phone: '', operator: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      setForm({ ...form, phone: maskPhone(value) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const numericAmount = parseCurrencyToNumber(form.amount);
    setMessage('');
    const res = await post('/recharges', { ...form, amount: numericAmount });
    setMessage(res.message);
    setForm({ amount: '0,00', phone: '', operator: '' });
  };

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <form className="card p-6 space-y-4" onSubmit={handleSubmit}>
        <h2 className="section-title">Recarga de celular</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-soft">Celular</label>
            <input
              name="phone"
              className="input-base mt-1"
              placeholder="(11) 99999-8888"
              value={form.phone}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="text-sm text-soft">Operadora</label>
            <input name="operator" className="input-base mt-1" placeholder="Claro" value={form.operator} onChange={handleChange} />
          </div>
        </div>
        <CurrencyInput
          label="Valor"
          name="amount"
          value={form.amount}
          onValueChange={(val) => setForm({ ...form, amount: val })}
          placeholder="50,00"
        />
        <button className="button-primary" disabled={loading}>
          {loading ? 'Recarregando...' : 'Confirmar recarga'}
        </button>
        {message && (
          <div className="bg-green-50 border border-green-200 text-green-800 rounded-xl px-4 py-3" role="alert">
            {message}
          </div>
        )}
        <p className="text-xs text-soft">A categoria é atribuída como "Telefone" automaticamente.</p>
      </form>
      <div className="card p-4 bg-gradient-to-b from-white via-white to-gray-50 space-y-3 max-w-sm w-full md:ml-auto">
        <h3 className="text-base font-semibold">Recarga imediata</h3>
        <p className="text-xs text-soft">Selecione rapidamente valores recorrentes.</p>
        <div className="flex flex-col gap-2 text-sm">
          {[15, 25, 35, 50].map((value) => (
            <button
              key={value}
              type="button"
              className="bg-gray-100 rounded-xl px-3 py-2 hover:bg-gray-200 text-left"
              onClick={() => setForm({ ...form, amount: `${value},00` })}
            >
              R$ {value}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
