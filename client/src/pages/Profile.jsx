import React, { useEffect, useState } from 'react';
import useFluxStore from '../store/useFluxStore';

export default function Profile() {
  const { user, updateProfile, loadProfile, balance } = useFluxStore();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user?.id]);

  useEffect(() => {
    if (user) {
      setForm({ name: user.name || '', email: user.email || '', password: '' });
    }
  }, [user]);

  if (!user) return null;

  const displayName = user.username === 'flux' ? 'Admin' : user.name || 'Flux';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const payload = { name: form.name, email: form.email };
      if (form.password) payload.password = form.password;
      const res = await updateProfile(payload);
      setMessage(res?.message || 'Perfil atualizado.');
      setForm((prev) => ({ ...prev, password: '' }));
    } catch (err) {
      setError(err.message || 'Erro ao salvar.');
    }
  };

  return (
    <div className="space-y-4">
      <div className="card p-6 bg-white flex flex-col gap-2">
        <p className="text-xs text-soft uppercase tracking-wide">Conta</p>
        <h2 className="text-xl font-semibold text-ink">Olá, {displayName}</h2>
        <p className="text-sm text-soft">Revise seus dados e mantenha o perfil atualizado.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="card p-5 space-y-3">
          <h3 className="text-lg font-semibold text-ink">Dados da conta</h3>
          <div className="flex items-center justify-between text-sm">
            <span className="text-soft">Usuário</span>
            <span className="font-semibold">{user.username}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-soft">Perfil</span>
            <span className="font-semibold capitalize">{user.role}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-soft">Saldo em conta</span>
            <span className="font-semibold">R$ {Number(balance).toFixed(2)}</span>
          </div>
        </div>

        <form className="card p-5 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-sm text-soft">Nome</label>
            <input
              className="input-base mt-1"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="text-sm text-soft">Email</label>
            <input
              className="input-base mt-1"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="voce@flux.app"
            />
          </div>
          <div>
            <label className="text-sm text-soft">Senha</label>
            <input
              className="input-base mt-1"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Atualizar senha (opcional)"
            />
          </div>
          {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
          {message && <p className="text-sm text-green-700" role="status">{message}</p>}
          <button className="button-primary w-full" type="submit">
            Salvar alterações
          </button>
        </form>
      </div>
    </div>
  );
}
