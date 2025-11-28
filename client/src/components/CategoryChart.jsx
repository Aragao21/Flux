import React from 'react'
import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

export default function CategoryChart({ totals, categories, onCategoryClick, selectedCategory }) {
  // Garante que todas as categorias estejam presentes, mesmo sem valor
  const categoriesList = Array.isArray(categories) ? categories : []
  const allLabels = categoriesList.map((cat) => cat.name)
  const dataValues = allLabels.map((name) => Math.abs(totals?.[name] || 0))

  // Mapear cores das categorias
  const getCategoryColor = (categoryName) => {
    const category = categoriesList.find((cat) => cat.name === categoryName)
    return category?.color || '#6b7280'
  }

  // Mapear ícones das categorias
  const getCategoryIcon = (categoryName) => {
    const category = categoriesList.find((cat) => cat.name === categoryName)
    return category?.icon || '📁'
  }

  const chartData = {
    labels: allLabels.map((label) => `${getCategoryIcon(label)} ${label}`),
    datasets: [
      {
        label: 'Total por categoria',
        data: dataValues,
        backgroundColor: allLabels.map((label) => getCategoryColor(label)),
        borderColor: '#fff',
        borderWidth: 2,
      },
    ],
  }

  const options = {
    onClick: (event, elements) => {
      if (elements.length > 0) {
        const index = elements[0].index
        const category = allLabels[index]
        onCategoryClick(category)
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
          const category = allLabels[index]
          onCategoryClick(category)
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
        <p className="text-sm font-semibold text-ink">Gastos por Categoria</p>
        <p className="text-xs text-soft">
          {selectedCategory
            ? `Filtrado: ${selectedCategory}`
            : 'Distribuição dos seus gastos por categoria personalizada'}
        </p>
      </div>
      {allLabels.length ? (
        <>
          <Doughnut data={chartData} options={options} />
          {selectedCategory && (
            <button
              onClick={() => onCategoryClick(null)}
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
