import React, { useEffect, useState } from 'react'
import CurrencyInput, { parseCurrencyToNumber } from '../components/CurrencyInput'
import useFluxStore from '../store/useFluxStore'

export default function LoanService() {
  const { post, loading, tags, refreshData } = useFluxStore()
  const [form, setForm] = useState({
    amount: '0,00',
    description: '',
    tag: 'Empréstimo',
    installments: '1',
    dueDate: '',
  })
  const [message, setMessage] = useState('')

  useEffect(() => {
    refreshData()
    // Define data de vencimento padrão (próximo mês)
    const nextMonth = new Date()
    nextMonth.setMonth(nextMonth.getMonth() + 1)
    setForm((prev) => ({ ...prev, dueDate: nextMonth.toISOString().split('T')[0] }))
  }, [refreshData])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const totalAmount = parseCurrencyToNumber(form.amount)
    const installmentsCount = parseInt(form.installments)

    const res = await post('/services/loan', {
      amount: totalAmount,
      description: form.description,
      tag: form.tag,
      installments: installmentsCount,
      dueDate: form.dueDate,
    })

    const feedback = res.message || 'Empréstimo liberado em conta.'
    setMessage(feedback)
    alert(feedback)

    const nextMonth = new Date()
    nextMonth.setMonth(nextMonth.getMonth() + 1)
    setForm({
      amount: '0,00',
      description: '',
      tag: form.tag,
      installments: '1',
      dueDate: nextMonth.toISOString().split('T')[0],
    })
  }

  const calculateInstallment = () => {
    const total = parseCurrencyToNumber(form.amount)
    const count = parseInt(form.installments) || 1
    return (total / count).toFixed(2)
  }

  const availableTags = ['Empréstimo', ...new Set(tags.map((t) => t.name))]

  return (
    <div className="max-w-4xl space-y-4">
      <div className="card p-6 space-y-3">
        <h2 className="section-title">Empréstimo</h2>
        <p className="text-sm text-soft">Libere crédito direto no saldo e parcele o pagamento.</p>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CurrencyInput
              label="Valor solicitado"
              name="amount"
              value={form.amount}
              onValueChange={(val) => setForm({ ...form, amount: val })}
            />
            <div>
              <label className="text-sm text-soft">Descrição</label>
              <input
                className="input-base mt-1"
                placeholder="Crédito liberado"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-soft">Número de Parcelas</label>
              <select
                className="input-base mt-1"
                value={form.installments}
                onChange={(e) => setForm({ ...form, installments: e.target.value })}
              >
                {[1, 2, 3, 6, 12, 18, 24].map((num) => (
                  <option key={num} value={num}>
                    {num}x
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm text-soft">Data do Primeiro Vencimento</label>
              <input
                type="date"
                className="input-base mt-1"
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                required
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

          {form.amount !== '0,00' && form.installments && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-sm font-semibold text-ink mb-2">Resumo do Empréstimo</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-soft">Valor total:</span>
                  <p className="font-semibold">
                    R$ {parseCurrencyToNumber(form.amount).toFixed(2)}
                  </p>
                </div>
                <div>
                  <span className="text-soft">Parcelas de:</span>
                  <p className="font-semibold">R$ {calculateInstallment()}</p>
                </div>
              </div>
            </div>
          )}

          <button className="button-primary" disabled={loading}>
            {loading ? 'Liberando...' : 'Liberar empréstimo'}
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
