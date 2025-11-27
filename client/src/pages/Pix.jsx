import React, { useState } from 'react';
import useFluxStore from '../store/useFluxStore';

export default function Pix() {
  const { post, loading, balance } = useFluxStore();
  const [form, setForm] = useState({ amount: '', to: '', from: '', description: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const send = async () => {
    const res = await post('/pix/send', { amount: form.amount, to: form.to, description: form.description });
    setMessage(res.message);
  };

  const receive = async () => {
    const res = await post('/pix/receive', { amount: form.amount, from: form.from, description: form.description });
    setMessage(res.message);
  };

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="section-title">PIX</h2>
          <p className="text-sm text-soft">Saldo: R$ {balance.toFixed(2)}</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-soft">Valor</label>
            <input name="amount" className="input-base mt-1" placeholder="100.00" value={form.amount} onChange={handleChange} />
          </div>
          <div>
            <label className="text-sm text-soft">Descrição</label>
            <input name="description" className="input-base mt-1" placeholder="Almoço" value={form.description} onChange={handleChange} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-soft">Destinatário</label>
            <input name="to" className="input-base mt-1" placeholder="chave PIX" value={form.to} onChange={handleChange} />
            <button className="button-primary w-full mt-3" onClick={send} disabled={loading}>
              Enviar PIX
            </button>
          </div>
          <div>
            <label className="text-sm text-soft">Remetente</label>
            <input name="from" className="input-base mt-1" placeholder="quem envia" value={form.from} onChange={handleChange} />
            <button className="button-primary w-full mt-3" onClick={receive} disabled={loading}>
              Receber PIX
            </button>
          </div>
        </div>
        {message && <p className="text-sm text-green-700">{message}</p>}
        <p className="text-xs text-soft">Operações são simuladas e geram comprovante com prefixo FLUX.</p>
      </div>
      <div className="card p-6 bg-gradient-to-b from-white to-red-50 space-y-3">
        <h3 className="text-lg font-semibold">Como funciona</h3>
        <p className="text-sm text-soft">
          Cada envio gera uma saída categorizada como <strong>Transferência</strong> e cada recebimento vira
          <strong> Recebimento</strong>. Tudo é salvo no banco SQLite local.
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
