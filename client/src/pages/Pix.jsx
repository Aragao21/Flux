import React, { useMemo, useState } from 'react';
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
  };

  const qrText = useMemo(() => `FLUXPIX:${form.to || 'destino'}:${form.amount || '0,00'}`, [form.amount, form.to]);

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="card p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <h2 className="section-title">PIX com QR</h2>
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
          <div>
            <label className="text-sm text-soft">Destinatário / chave PIX</label>
            <input
              name="to"
              className="input-base mt-1"
              placeholder="email ou telefone"
              value={form.to}
              onChange={handleChange}
            />
            <button className="button-primary w-full mt-3" onClick={send} disabled={loading}>
              {loading ? 'Enviando...' : 'Enviar com QR'}
            </button>
          </div>
          <div className="card bg-gray-50 border border-gray-200 flex flex-col items-center justify-center text-center p-4">
            <p className="text-xs text-soft mb-2">QR Code simulado</p>
            <div className="h-36 w-36 bg-white border border-gray-200 rounded-2xl flex items-center justify-center text-xs font-semibold">
              {qrText}
            </div>
            <p className="text-xs text-soft mt-2">Escaneie para revisar os dados do envio</p>
          </div>
        </div>
        {message && (
          <div className="bg-green-50 border border-green-200 text-green-800 rounded-xl px-4 py-3" role="alert">
            {message}
          </div>
        )}
        <p className="text-xs text-soft">Operação simulada: saída categorizada como "Transferência" com comprovante FLUX.</p>
      </div>
      <div className="card p-6 bg-gradient-to-b from-white to-red-50 space-y-3">
        <h3 className="text-lg font-semibold">Como funciona</h3>
        <p className="text-sm text-soft">
          Cada envio gera uma saída categorizada como <strong>Transferência</strong> com QR simulado para revisão.
        </p>
        <ul className="text-sm text-soft list-disc list-inside space-y-1">
          <li>Comprovante fake com prefixo FLUX</li>
          <li>Cadastro automático no extrato inteligente</li>
          <li>Atualização imediata do saldo simulado</li>
        </ul>
      </div>
    </div>
  );
}
