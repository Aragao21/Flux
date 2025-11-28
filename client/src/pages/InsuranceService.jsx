import React, { useEffect, useState } from 'react'
import CurrencyInput, { parseCurrencyToNumber } from '../components/CurrencyInput'
import useFluxStore from '../store/useFluxStore'

export default function InsuranceService() {
  const { post, loading, tags, refreshData } = useFluxStore()
  const [form, setForm] = useState({ amount: '0,00', provider: '', tag: 'Seguro' })
  const [message, setMessage] = useState('')

  useEffect(() => {
    refreshData()
  }, [refreshData])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await post('/services/insurance', {
      amount: parseCurrencyToNumber(form.amount),
      provider: form.provider,
      tag: form.tag,
    })
    const feedback = res.message || 'Seguro ativado com sucesso.'
    setMessage(feedback)
    alert(feedback)
    setForm({ amount: '0,00', provider: '', tag: form.tag })
  }

  const availableTags = ['Seguro', ...new Set(tags.map((t) => t.name))]

  return (
    <div className="max-w-4xl space-y-4">
      <div className="card p-6 space-y-3">
        <h2 className="section-title">Seguro dedicado</h2>
        <p className="text-sm text-soft">
          Ative a proteção e veja o débito aplicado imediatamente.
        </p>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <CurrencyInput
              label="Mensalidade"
              name="amount"
              value={form.amount}
              onValueChange={(val) => setForm({ ...form, amount: val })}
            />
            <div>
              <label className="text-sm text-soft">Seguradora</label>
              <input
                className="input-base mt-1"
                placeholder="Flux Protect"
                value={form.provider}
                onChange={(e) => setForm({ ...form, provider: e.target.value })}
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
            {loading ? 'Ativando...' : 'Registrar seguro'}
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
