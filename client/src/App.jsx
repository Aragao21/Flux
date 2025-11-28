import React from 'react';
import { Link, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import Pix from './pages/Pix';
import Payments from './pages/Payments';
import Recharge from './pages/Recharge';
import Statement from './pages/Statement';
import Services from './pages/Services';
import Profile from './pages/Profile';
import useFluxStore from './store/useFluxStore';
import NavBar from './components/NavBar';

function ProtectedRoute({ children }) {
  const { user } = useFluxStore();
  return user ? children : <Navigate to="/login" />;
}

export default function App() {
  const { user, logout } = useFluxStore();
  const navigate = useNavigate();
  const displayName = user?.username === 'flux' ? 'Admin' : user?.name || 'Flux';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  return (
    <div className="bg-gray-50 min-h-screen text-ink">
      <div className="max-w-5xl mx-auto px-4 sm:px-5 md:px-8 py-6">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-flux text-white flex items-center justify-center font-black text-xl shadow-lg">
              F
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-soft">Hub financeiro</p>
              <h1 className="text-2xl font-bold">Flux</h1>
            </div>
          </div>
          {user && (
            <div className="flex flex-col gap-2 w-full sm:w-auto">
              <div className="flex items-center justify-between sm:justify-end gap-3 flex-wrap">
                <div className="text-right">
                  <p className="text-sm font-semibold">Olá, {displayName}</p>
                  <p className="text-xs text-soft">Perfil {user.role === 'admin' ? 'Admin' : 'Cliente'}</p>
                </div>
                <Link
                  to="/perfil"
                  className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold bg-white hover:bg-gray-100"
                >
                  Perfil
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-xl bg-ink text-white text-sm font-semibold hover:brightness-110"
                >
                  Sair
                </button>
              </div>
              <NavBar />
            </div>
          )}
        </header>
        <main>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/perfil"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pix"
              element={
                <ProtectedRoute>
                  <Pix />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pagamentos"
              element={
                <ProtectedRoute>
                  <Payments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recarga"
              element={
                <ProtectedRoute>
                  <Recharge />
                </ProtectedRoute>
              }
            />
            <Route
              path="/servicos"
              element={
                <ProtectedRoute>
                  <Services />
                </ProtectedRoute>
              }
            />
            <Route
              path="/extrato"
              element={
                <ProtectedRoute>
                  <Statement />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </div>
  );
}
