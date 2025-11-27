import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import Pix from './pages/Pix';
import Payments from './pages/Payments';
import Recharge from './pages/Recharge';
import Statement from './pages/Statement';
import useFluxStore from './store/useFluxStore';
import NavBar from './components/NavBar';

function ProtectedRoute({ children }) {
  const { user } = useFluxStore();
  return user ? children : <Navigate to="/login" />;
}

export default function App() {
  const { user } = useFluxStore();
  return (
    <div className="bg-gray-50 min-h-screen text-ink">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-flux text-white flex items-center justify-center font-black text-xl shadow-lg">
              F
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-soft">Hub financeiro</p>
              <h1 className="text-2xl font-bold">Flux</h1>
            </div>
          </div>
          {user && <NavBar />}
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
