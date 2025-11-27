import { create } from 'zustand';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const useFluxStore = create((set, get) => ({
  user: null,
  balance: 0,
  transactions: [],
  totals: {},
  loading: false,
  async login(username, password) {
    set({ loading: true });
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) throw new Error('Usuário ou senha incorretos');
      const data = await res.json();
      set({ user: data.user, balance: data.user.balance });
      await get().refreshData();
      return data;
    } finally {
      set({ loading: false });
    }
  },
  async refreshData() {
    const [txRes, summaryRes] = await Promise.all([
      fetch(`${API_URL}/transactions`),
      fetch(`${API_URL}/summary`),
    ]);
    const txData = await txRes.json();
    const summaryData = await summaryRes.json();
    set({
      transactions: txData.transactions || [],
      balance: summaryData.balance ?? 0,
      totals: summaryData.totals || {},
    });
  },
  async post(endpoint, payload) {
    set({ loading: true });
    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      await get().refreshData();
      return data;
    } finally {
      set({ loading: false });
    }
  },
}));

export default useFluxStore;
