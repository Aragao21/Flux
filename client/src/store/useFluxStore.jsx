import { create } from 'zustand';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const useFluxStore = create((set, get) => ({
  user: null,
  balance: 0,
  transactions: [],
  totals: {},
  tags: [],
  tagFilter: 'Todas',
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
      await get().refreshData(data.user?.id);
      return data;
    } finally {
      set({ loading: false });
    }
  },
  async refreshData(userIdOverride) {
    const activeUserId = userIdOverride || get().user?.id;
    if (!activeUserId) return;
    const tagFilter = get().tagFilter;
    const tagQuery = tagFilter && tagFilter !== 'Todas' ? `&tag=${encodeURIComponent(tagFilter)}` : '';

    const [txRes, summaryRes, tagsRes] = await Promise.all([
      fetch(`${API_URL}/transactions?userId=${activeUserId}${tagQuery}`),
      fetch(`${API_URL}/summary?userId=${activeUserId}${tagQuery}`),
      fetch(`${API_URL}/tags?userId=${activeUserId}`),
    ]);
    const txData = await txRes.json();
    const summaryData = await summaryRes.json();
    const tagsData = await tagsRes.json();
    set({
      transactions: txData.transactions || [],
      balance: summaryData.balance ?? 0,
      totals: summaryData.totals || {},
      tags: tagsData.tags || [],
    });
  },
  async post(endpoint, payload) {
    set({ loading: true });
    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, userId: get().user?.id || 1 }),
      });
      const data = await res.json();
      await get().refreshData();
      return data;
    } finally {
      set({ loading: false });
    }
  },
  async contestTransaction(id) {
    set({ loading: true });
    try {
      const res = await fetch(`${API_URL}/transactions/${id}/contest`, { method: 'POST' });
      const data = await res.json();
      await get().refreshData();
      return data;
    } finally {
      set({ loading: false });
    }
  },
  async updateProfile(updates) {
    const activeUser = get().user;
    if (!activeUser) return;
    set({ loading: true });
    try {
      const res = await fetch(`${API_URL}/users/${activeUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error('Erro ao atualizar perfil');
      const data = await res.json();
      set({ user: data.user });
      return data;
    } finally {
      set({ loading: false });
    }
  },
  async loadProfile() {
    const activeUser = get().user;
    if (!activeUser) return;
    const res = await fetch(`${API_URL}/users/${activeUser.id}`);
    if (!res.ok) return;
    const data = await res.json();
    set({ user: data.user, balance: data.user.balance ?? get().balance });
  },
  async createTag(tag) {
    const activeUserId = get().user?.id;
    if (!activeUserId) return;
    set({ loading: true });
    try {
      await fetch(`${API_URL}/tags`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...tag, userId: activeUserId }),
      });
      await get().refreshData();
    } finally {
      set({ loading: false });
    }
  },
  setTagFilter(tag) {
    set({ tagFilter: tag || 'Todas' });
  },
  logout() {
    set({ user: null, transactions: [], totals: {}, balance: 0, tags: [], tagFilter: 'Todas' });
  },
}));

export default useFluxStore;
