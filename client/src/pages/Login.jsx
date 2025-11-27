import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useFluxStore from '../store/useFluxStore';
import { SparkIcon } from '../components/Icons';

export default function Login() {
  const [username, setUsername] = useState('flux');
  const [password, setPassword] = useState('123456');
  const [error, setError] = useState('');
  const { login, loading } = useFluxStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      await login(username, password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-lg mx-auto card p-8 bg-white">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-12 w-12 bg-flux text-white rounded-2xl flex items-center justify-center">
          <SparkIcon />
        </div>
        <div>
          <p className="text-sm text-soft">Bem-vindo ao</p>
          <h2 className="text-2xl font-bold">Flux</h2>
        </div>
      </div>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="text-sm text-soft">Usuário</label>
          <input className="input-base mt-1" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div>
          <label className="text-sm text-soft">Senha</label>
          <input
            className="input-base mt-1"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button className="button-primary w-full" disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
        <p className="text-xs text-soft text-center">
          Login simulado: usuário <strong>flux</strong> / senha <strong>123456</strong>
        </p>
      </form>
    </div>
  );
}
