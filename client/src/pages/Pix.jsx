import React, { useState } from 'react';
import useFluxStore from '../store/useFluxStore';
import CurrencyInput, { parseCurrencyToNumber } from '../components/CurrencyInput';

export default function Pix() {
  const { post, loading, balance } = useFluxStore();
  const [form, setForm] = useState({ amount: '0,00', to: '', description: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const send = async () => {
    const numericAmount = parseCurrencyToNumber(form.amount);
    const res = await post('/pix/send', { amount: numericAmount, to: form.to, description: form.description });
    setMessage(res.message);
    setForm({ amount: '0,00', to: '', description: '' });
  };

  return (
    <div className="grid md:grid-cols-2 gap-4">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm text-soft">Destinatário / chave PIX</label>
            <input
              name="to"
              className="input-base mt-1"
              placeholder="email ou telefone"
              value={form.to}
              onChange={handleChange}
            />
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
            <p className="text-xs text-soft">Revisamos valor, descrição e destinatário antes de registrar no extrato.</p>
            <ul className="text-xs text-soft list-disc list-inside space-y-1">
              <li>Saída categorizada como "Transferência"</li>
              <li>Comprovante oficial com prefixo FLUX</li>
            </ul>
          </div>
        </div>
        <p className="text-xs text-soft">Tudo é registrado no saldo e extrato com comprovante imediato.</p>
      </div>
      <div className="card p-6 bg-gradient-to-b from-white to-red-50 space-y-4">
        <h3 className="text-lg font-semibold">Dicas para um PIX sem fricção</h3>
        <p className="text-sm text-soft">
          Confirme o destinatário, valide o valor e use a máscara automática para manter centavos alinhados. Após o envio, o
          comprovante fica disponível no extrato para consulta imediata.
        </p>
        <div className="bg-white border border-gray-200 rounded-xl p-3 text-sm space-y-1">
          <p className="font-semibold text-ink">Resumo da transferência</p>
          <p className="text-soft">Valor: {form.amount || '0,00'}</p>
          <p className="text-soft">Para: {form.to || 'destinatário'}</p>
          <p className="text-soft">Descrição: {form.description || 'Não informado'}</p>
        </div>
      </div>
    </div>
  );
}
