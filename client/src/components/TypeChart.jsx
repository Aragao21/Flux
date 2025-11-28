import React from 'react'
import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

export default function TypeChart({ transactions, onTypeClick, selectedType }) {
  // Definir cores para cada tipo
  const typeColors = {
    PIX_ENVIADO: '#ED1C24',
    PIX_RECEBIDO: '#16a34a',
    PAGAMENTO: '#0ea5e9',
    RECARGA: '#f97316',
    COMPRA_CASHBACK: '#8b5cf6',
    CASHBACK_BONUS: '#10b981',
    SEGURO: '#0f172a',
    EMPRESTIMO: '#ec4899',
  }

  const typeLabels = {
    PIX_ENVIADO: 'PIX Enviado',
    PIX_RECEBIDO: 'PIX Recebido',
    PAGAMENTO: 'Contas',
    RECARGA: 'Recarga',
    COMPRA_CASHBACK: 'Compras',
    CASHBACK_BONUS: 'Cashback',
    SEGURO: 'Seguros',
    EMPRESTIMO: 'Empréstimos',
  }

  // Agrupar transações por tipo
  const typeData = {}
  transactions.forEach((tx) => {
    if (!typeData[tx.type]) {
      typeData[tx.type] = 0
    }
    // Somar apenas valores absolutos de débito
    if (tx.direction === 'debit') {
      typeData[tx.type] += Math.abs(tx.amount)
    }
  })

  const labels = Object.keys(typeData).map((type) => typeLabels[type] || type)
  const dataValues = Object.values(typeData)
  const colors = Object.keys(typeData).map((type) => typeColors[type] || '#6b7280')
  const typeKeys = Object.keys(typeData)

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Total por tipo',
        data: dataValues,
        backgroundColor: colors,
        borderColor: '#fff',
        borderWidth: 2,
      },
    ],
  }

  const options = {
    onClick: (event, elements) => {
      if (elements.length > 0) {
        const index = elements[0].index
        const typeKey = typeKeys[index]
        onTypeClick(typeKey)
      }
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 10,
          font: {
            size: 11,
          },
        },
        onClick: (e, legendItem, legend) => {
          const index = legendItem.index
          const typeKey = typeKeys[index]
          onTypeClick(typeKey)
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || ''
            const value = context.parsed || 0
            return `${label}: R$ ${value.toFixed(2)}`
          },
        },
      },
    },
    maintainAspectRatio: true,
    aspectRatio: 1.5,
  }

  return (
    <div className="card p-4">
      <div className="mb-3">
        <p className="text-sm font-semibold text-ink">Gastos por Tipo</p>
        <p className="text-xs text-soft">
          {selectedType
            ? `Filtrado: ${typeLabels[selectedType] || selectedType}`
            : 'Distribuição dos seus gastos por tipo de transação'}
        </p>
      </div>
      {labels.length ? (
        <>
          <Doughnut data={chartData} options={options} />
          {selectedType && (
            <button
              onClick={() => onTypeClick(null)}
              className="w-full mt-3 py-2 text-xs font-medium text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
            >
              Limpar filtro
            </button>
          )}
        </>
      ) : (
        <p className="text-soft text-sm text-center py-8">Nenhuma transação ainda.</p>
      )}
    </div>
  )
}
