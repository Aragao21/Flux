import { create } from 'zustand'

const API_URL = import.meta.env.VITE_API_URL || '/api'

const useFluxStore = create((set, get) => ({
  user: null,
  balance: 0,
  transactions: [],
  totals: {},
  tags: [],
  categories: [],
  tagFilter: 'Todas',
  loading: false,
  async login(username, password) {
    set({ loading: true })
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      // Verifica se a resposta é JSON
      const contentType = res.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error(
          'Servidor não está respondendo corretamente. Verifique se o backend está rodando na porta 4000.',
        )
      }

      if (!res.ok) throw new Error('Usuário ou senha incorretos')
      const data = await res.json()
      set({ user: data.user, balance: data.user.balance })
      await get().refreshData(data.user?.id)
      return data
    } finally {
      set({ loading: false })
    }
  },
  async refreshData(userIdOverride) {
    const activeUserId = userIdOverride || get().user?.id
    if (!activeUserId) return
    const tagFilter = get().tagFilter
    const tagQuery =
      tagFilter && tagFilter !== 'Todas' ? `&tag=${encodeURIComponent(tagFilter)}` : ''

    try {
      const [txRes, summaryRes, tagsRes, categoriesRes] = await Promise.all([
        fetch(`${API_URL}/transactions?userId=${activeUserId}${tagQuery}`),
        fetch(`${API_URL}/summary?userId=${activeUserId}${tagQuery}`),
        fetch(`${API_URL}/tags?userId=${activeUserId}`),
        fetch(`${API_URL}/categories?userId=${activeUserId}`),
      ])

      // Verifica se as respostas são JSON
      const contentTypes = [txRes, summaryRes, tagsRes, categoriesRes].map((res) =>
        res.headers.get('content-type'),
      )
      const allJson = contentTypes.every((ct) => ct && ct.includes('application/json'))

      if (!allJson) {
        console.error(
          'Servidor não está respondendo com JSON. Verifique se o backend está rodando.',
        )
        return
      }

      const txData = await txRes.json()
      const summaryData = await summaryRes.json()
      const tagsData = await tagsRes.json()
      const categoriesData = await categoriesRes.json()
      set({
        transactions: txData.transactions || [],
        balance: summaryData.balance ?? 0,
        totals: summaryData.totals || {},
        tags: tagsData.tags || [],
        categories: categoriesData.categories || [],
      })
    } catch (error) {
      console.error('Erro ao atualizar dados:', error)
    }
  },
  async post(endpoint, payload) {
    set({ loading: true })
    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, userId: get().user?.id || 1 }),
      })
      const data = await res.json()
      // Aguarda refreshData completar antes de desabilitar loading
      await get().refreshData()
      set({ loading: false })
      return data
    } catch (error) {
      set({ loading: false })
      throw error
    }
  },
  async contestTransaction(id) {
    set({ loading: true })
    try {
      const res = await fetch(`${API_URL}/transactions/${id}/contest`, { method: 'POST' })
      const data = await res.json()
      await get().refreshData()
      return data
    } finally {
      set({ loading: false })
    }
  },
  async updateProfile(updates) {
    const activeUser = get().user
    if (!activeUser) return
    set({ loading: true })
    try {
      const res = await fetch(`${API_URL}/users/${activeUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })
      if (!res.ok) throw new Error('Erro ao atualizar perfil')
      const data = await res.json()
      set({ user: data.user })
      return data
    } finally {
      set({ loading: false })
    }
  },
  async loadProfile() {
    const activeUser = get().user
    if (!activeUser) return
    const res = await fetch(`${API_URL}/users/${activeUser.id}`)
    if (!res.ok) return
    const data = await res.json()
    set({ user: data.user, balance: data.user.balance ?? get().balance })
  },
  async createTag(tag) {
    const activeUserId = get().user?.id
    if (!activeUserId) return
    set({ loading: true })
    try {
      await fetch(`${API_URL}/tags`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...tag, userId: activeUserId }),
      })
      await get().refreshData()
    } finally {
      set({ loading: false })
    }
  },
  setTagFilter(tag) {
    set({ tagFilter: tag || 'Todas' })
  },
  logout() {
    set({
      user: null,
      transactions: [],
      totals: {},
      balance: 0,
      tags: [],
      categories: [],
      tagFilter: 'Todas',
    })
  },
}))

export default useFluxStore
