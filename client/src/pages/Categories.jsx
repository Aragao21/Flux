import React, { useEffect, useState } from 'react'
import useFluxStore from '../store/useFluxStore'

export default function Categories() {
  const { user } = useFluxStore()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({ name: '', color: '#f97316', icon: '📁' })

  const API_URL = import.meta.env.VITE_API_URL || '/api'

  const loadCategories = async () => {
    try {
      const res = await fetch(`${API_URL}/categories?userId=${user?.id || 1}`)
      const data = await res.json()
      setCategories(data.categories || [])
    } catch (error) {
      console.error('Erro ao carregar categorias:', error)
    }
  }

  useEffect(() => {
    loadCategories()
  }, [user])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name.trim()) return

    setLoading(true)
    try {
      const url = editingId ? `${API_URL}/categories/${editingId}` : `${API_URL}/categories`
      const method = editingId ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, userId: user?.id || 1 }),
      })

      if (res.ok) {
        await loadCategories()
        setFormData({ name: '', color: '#f97316', icon: '📁' })
        setEditingId(null)
      }
    } catch (error) {
      console.error('Erro ao salvar categoria:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (category) => {
    setEditingId(category.id)
    setFormData({ name: category.name, color: category.color, icon: category.icon })
  }

  const handleDelete = async (id) => {
    if (!confirm('Tem certeza que deseja excluir esta categoria?')) return

    try {
      await fetch(`${API_URL}/categories/${id}?userId=${user?.id || 1}`, {
        method: 'DELETE',
      })
      await loadCategories()
    } catch (error) {
      console.error('Erro ao excluir categoria:', error)
    }
  }

  const handleCancel = () => {
    setEditingId(null)
    setFormData({ name: '', color: '#f97316', icon: '📁' })
  }

  const emojiOptions = [
    '📁',
    '🍔',
    '🚗',
    '💊',
    '📚',
    '🎮',
    '🏠',
    '👕',
    '✈️',
    '💳',
    '🛒',
    '☕',
    '🎬',
    '🏋️',
    '💼',
    '🎨',
    '🔧',
    '💡',
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="section-title">Gerenciar Categorias</h2>
        <p className="text-sm text-soft">
          Personalize suas categorias de despesas para organizar melhor seus gastos
        </p>
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4">
          {editingId ? 'Editar Categoria' : 'Nova Categoria'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="text-sm text-soft mb-1 block">Nome da Categoria</label>
              <input
                type="text"
                className="input-base"
                placeholder="Ex: Alimentação, Transporte, Educação"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="text-sm text-soft mb-1 block">Cor</label>
              <input
                type="color"
                className="w-full h-11 rounded-lg border border-gray-200 cursor-pointer"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-soft mb-2 block">Ícone</label>
            <div className="grid grid-cols-9 gap-2">
              {emojiOptions.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  className={`p-3 text-2xl rounded-lg border-2 transition hover:scale-110 ${
                    formData.icon === emoji
                      ? 'border-flux bg-flux/10'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setFormData({ ...formData, icon: emoji })}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <button type="submit" className="button-primary flex-1" disabled={loading}>
              {loading ? 'Salvando...' : editingId ? 'Atualizar' : 'Criar Categoria'}
            </button>
            {editingId && (
              <button
                type="button"
                className="px-6 py-2 rounded-xl border border-gray-300 text-soft hover:bg-gray-50"
                onClick={handleCancel}
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4">Suas Categorias</h3>
        <div className="grid gap-3">
          {categories.length === 0 ? (
            <p className="text-center text-soft py-8">Nenhuma categoria cadastrada</p>
          ) : (
            categories.map((category) => (
              <div
                key={category.id}
                className="flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-gray-300 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{category.icon}</div>
                  <div>
                    <p className="font-semibold">{category.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div
                        className="w-4 h-4 rounded-full border border-gray-200"
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="text-xs text-soft">{category.color}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    className="px-4 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-50"
                    onClick={() => handleEdit(category)}
                  >
                    Editar
                  </button>
                  <button
                    className="px-4 py-2 text-sm rounded-lg border border-red-300 text-red-600 hover:bg-red-50"
                    onClick={() => handleDelete(category.id)}
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
