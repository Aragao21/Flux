import React, { useState } from 'react'

export default function TransactionList({ transactions }) {
  const [selected, setSelected] = useState(null)

  const formatCurrency = (value) => `R$ ${Number(value || 0).toFixed(2)}`

  const formatDate = (value) => {
    const date = new Date(value)
    return date.toLocaleString('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }
  const handleShare = async () => {
    if (!selected) return

    const text = `
🧾 Comprovante Flux

Autorização: ${buildReceiptCode(selected.id)}
Valor: ${formatCurrency(selected.amount)}
Tipo: ${selected.categoryMeta?.label || selected.category}
Data: ${formatDate(selected.created_at)}
${selected.direction === 'debit' ? 'Débito' : 'Crédito'}
${selected.party ? `Conta: ${selected.party}` : ''}
Status: ${selected.contested ? 'Contestada' : 'Liquidada'}
    `.trim()

    // Tenta usar a API de compartilhamento nativa
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Comprovante Flux',
          text: text,
        })
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Erro ao compartilhar:', err)
          copyToClipboard(text)
        }
      }
    } else {
      // Fallback: copiar para área de transferência
      copyToClipboard(text)
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        alert('Comprovante copiado para área de transferência!')
      })
      .catch((err) => {
        console.error('Erro ao copiar:', err)
      })
  }

  return (
    <div className="card p-4 divide-y divide-gray-100 space-y-3">
      {transactions.map((tx) => {
        const sign = tx.direction === 'debit' ? '-' : '+'
        const color = tx.direction === 'debit' ? 'text-red-600' : 'text-green-700'
        return (
          <div
            key={tx.id}
            className="py-3 px-2 -mx-2 rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 hover:bg-gray-50 transition cursor-pointer"
            onClick={() => setSelected(tx)}
          >
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div
                className="h-10 w-10 rounded-xl flex items-center justify-center text-lg"
                style={{ background: '#fef2f2' }}
              >
                <span style={{ color: tx.categoryMeta?.color || '#ED1C24' }}>
                  {tx.categoryMeta?.icon || '•'}
                </span>
              </div>
              <div>
                <p className="font-semibold text-ink">{tx.description || tx.category}</p>
                <p className="text-xs text-soft flex items-center gap-2 flex-wrap">
                  <span>{tx.category}</span>
                  {tx.tag && (
                    <span className="px-2 py-0.5 rounded-full text-[11px] bg-gray-100 border border-gray-200 text-ink">
                      {tx.tag}
                    </span>
                  )}
                  <span>{formatDate(tx.created_at)}</span>
                </p>
                {/* {tx.contested && <p className="text-xs text-amber-700">Contestação registrada</p>} */}
              </div>
            </div>
            <div className="text-right w-full sm:w-auto">
              <p className={`font-semibold ${color}`}>
                {sign} R$ {Number(tx.amount).toFixed(2)}
              </p>
              {tx.party && <p className="text-xs text-soft">{tx.party}</p>}
            </div>
          </div>
        )
      })}

      {selected && (
        <div
          className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-20 p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full sm:max-w-md p-6 space-y-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs uppercase text-soft tracking-wide">Comprovante</p>
                <h4 className="text-lg font-semibold text-ink">
                  {selected.description || selected.category}
                </h4>
                <p className="text-xs text-soft">{formatDate(selected.created_at)}</p>
              </div>
              <button
                className="text-soft hover:text-ink text-sm font-semibold"
                onClick={() => setSelected(null)}
                aria-label="Fechar comprovante"
              >
                Fechar
              </button>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-soft">Autorização</span>
                <span className="font-semibold">{buildReceiptCode(selected.id)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-soft">Valor</span>
                <span className="font-semibold text-ink">{formatCurrency(selected.amount)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-soft">Tipo</span>
                <span className="font-semibold">
                  {selected.categoryMeta?.label || selected.category}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-soft">Direção</span>
                <span className="font-semibold capitalize">
                  {selected.direction === 'debit' ? 'Débito' : 'Crédito'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-soft">Etiqueta</span>
                <span className="font-semibold">{selected.tag || selected.category}</span>
              </div>
              {selected.party && (
                <div className="flex items-center justify-between">
                  <span className="text-soft">Conta/Chave</span>
                  <span className="font-semibold text-right max-w-[60%] truncate">
                    {selected.party}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-soft">Status</span>
                <span className="font-semibold">
                  {selected.contested ? 'Contestada' : 'Liquidada'}
                </span>
              </div>
            </div>

            {/* {selected.contested && (
              <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-xl px-3 py-2 text-sm">
                Contestação ativa. Estamos analisando esta transferência.
              </div>
            )} */}

            <div className="flex gap-2">
              <button
                className="flex-1 px-4 py-2 rounded-xl border border-gray-300 text-ink font-semibold hover:bg-gray-50 transition"
                onClick={handleShare}
              >
                📤 Compartilhar
              </button>
              <button className="flex-1 button-primary" onClick={() => setSelected(null)}>
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
