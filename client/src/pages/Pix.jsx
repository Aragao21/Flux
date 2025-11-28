import React, { useEffect, useState } from 'react';
import useFluxStore from '../store/useFluxStore';
import CurrencyInput, { parseCurrencyToNumber } from '../components/CurrencyInput';

export default function Pix() {
  const { post, loading, balance, tags, refreshData } = useFluxStore();
  const [form, setForm] = useState({ amount: '0,00', to: '', description: '', tag: 'Transferência' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const send = async () => {
    const numericAmount = parseCurrencyToNumber(form.amount);
    const res = await post('/pix/send', {
      amount: numericAmount,
      to: form.to,
      description: form.description,
      tag: form.tag,
    });
    setMessage(res.message);
    setForm({ amount: '0,00', to: '', description: '', tag: form.tag });
  };

  const availableTags = ['Transferência', ...new Set(tags.map((t) => t.name))];

  return (
    <div className="max-w-4xl space-y-4">
      <div className="card p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <h2 className="section-title">PIX imediato</h2>
          <p className="text-sm text-soft">Saldo: R$ {balance.toFixed(2)}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CurrencyInput
            label="Valor"
            name="amount"
            value={form.amount}
            onValueChange={(val) => setForm({ ...form, amount: val })}
            placeholder="0,00"
          />
          <div>
            <label className="text-sm text-soft">Descrição</label>
            <input
              name="description"
              className="input-base mt-1"
              placeholder="Almoço"
              value={form.description}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm text-soft">Destinatário / chave PIX</label>
            <input
              name="to"
              className="input-base mt-1"
              placeholder="email ou telefone"
              value={form.to}
              onChange={handleChange}
            />
            <div>
              <label className="text-sm text-soft">Etiqueta</label>
              <select name="tag" className="input-base mt-1" value={form.tag} onChange={handleChange}>
                {availableTags.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
            </div>
            <button className="button-primary w-full" onClick={send} disabled={loading}>
              {loading ? 'Enviando...' : 'Enviar PIX'}
            </button>
            {message && (
              <div className="bg-green-50 border border-green-200 text-green-800 rounded-xl px-4 py-3" role="alert">
                {message}
              </div>
            )}
          </div>
          <div className="card bg-gray-50 border border-gray-200 flex flex-col gap-2 text-left p-4 shadow-sm">
            <p className="text-sm font-semibold text-ink">Envio seguro</p>
            <p className="text-xs text-soft">Revisamos valor, descrição, etiqueta e destinatário antes de registrar no extrato.</p>
            <ul className="text-xs text-soft list-disc list-inside space-y-1">
              <li>Saída categorizada como "Transferência"</li>
              <li>Comprovante oficial com prefixo FLUX</li>
            </ul>
          </div>
        </div>
        <p className="text-xs text-soft">Tudo é registrado no saldo e extrato com comprovante imediato.</p>
      </div>
    </div>
  );
}
