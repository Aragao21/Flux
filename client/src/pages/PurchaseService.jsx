import React, { useEffect, useState } from 'react'
import CurrencyInput, { parseCurrencyToNumber } from '../components/CurrencyInput'
import useFluxStore from '../store/useFluxStore'

export default function PurchaseService() {
  const { post, loading, tags, refreshData } = useFluxStore()
  const [form, setForm] = useState({ amount: '0,00', merchant: '', tag: 'Compras' })
  const [message, setMessage] = useState('')

  useEffect(() => {
    refreshData()
  }, [refreshData])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await post('/services/purchase', {
      amount: parseCurrencyToNumber(form.amount),
      merchant: form.merchant,
      tag: form.tag,
    })
    const feedback = res.message || 'Compra registrada com cashback creditado.'
    setMessage(feedback)
    alert(feedback)
    setForm({ amount: '0,00', merchant: '', tag: form.tag })
  }

  const availableTags = ['Compras', 'Cashback', ...new Set(tags.map((t) => t.name))]

  return (
    <div className="max-w-4xl space-y-4">
      <div className="card p-6 space-y-3">
        <h2 className="section-title">Compras com cashback</h2>
        <p className="text-sm text-soft">
          Registre a compra e receba 5% de volta automaticamente no saldo.
        </p>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <CurrencyInput
              label="Valor da compra"
              name="amount"
              value={form.amount}
              onValueChange={(val) => setForm({ ...form, amount: val })}
            />
            <div>
              <label className="text-sm text-soft">Estabelecimento</label>
              <input
                className="input-base mt-1"
                placeholder="Loja Flux"
                value={form.merchant}
                onChange={(e) => setForm({ ...form, merchant: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm text-soft">Etiqueta</label>
              <select
                className="input-base mt-1"
                value={form.tag}
                onChange={(e) => setForm({ ...form, tag: e.target.value })}
              >
                {availableTags.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button className="button-primary" disabled={loading}>
            {loading ? 'Registrando...' : 'Registrar compra + cashback'}
          </button>
          {message && (
            <div
              className="bg-green-50 border border-green-200 text-green-800 rounded-xl px-4 py-3"
              role="alert"
            >
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
