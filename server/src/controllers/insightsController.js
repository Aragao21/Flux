const db = require('../db')

/**
 * Retorna insights financeiros baseados no histórico de transações
 */
function getFinancialInsights(req, res) {
  const userId = Number(req.query.userId) || 1
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()

  // Mês anterior
  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1
  const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear

  const currentMonthStart = new Date(currentYear, currentMonth, 1).toISOString()
  const lastMonthStart = new Date(lastMonthYear, lastMonth, 1).toISOString()
  const lastMonthEnd = new Date(currentYear, currentMonth, 1).toISOString()

  // Buscar gastos do mês atual
  const currentMonthQuery = `
    SELECT SUM(amount) as total
    FROM transactions
    WHERE user_id = ? 
    AND direction = 'debit'
    AND datetime(created_at) >= datetime(?)
  `

  // Buscar gastos do mês anterior
  const lastMonthQuery = `
    SELECT SUM(amount) as total
    FROM transactions
    WHERE user_id = ?
    AND direction = 'debit'
    AND datetime(created_at) >= datetime(?)
    AND datetime(created_at) < datetime(?)
  `

  // Buscar top categorias do mês atual
  const topCategoriesQuery = `
    SELECT c.name, c.icon, c.color, SUM(t.amount) as total, COUNT(*) as count
    FROM transactions t
    LEFT JOIN categories c ON t.category_id = c.id
    WHERE t.user_id = ?
    AND t.direction = 'debit'
    AND datetime(t.created_at) >= datetime(?)
    AND c.id IS NOT NULL
    GROUP BY c.id, c.name, c.icon, c.color
    ORDER BY total DESC
    LIMIT 3
  `

  Promise.all([
    new Promise((resolve, reject) => {
      db.get(currentMonthQuery, [userId, currentMonthStart], (err, row) => {
        if (err) reject(err)
        else resolve(row?.total || 0)
      })
    }),
    new Promise((resolve, reject) => {
      db.get(lastMonthQuery, [userId, lastMonthStart, lastMonthEnd], (err, row) => {
        if (err) reject(err)
        else resolve(row?.total || 0)
      })
    }),
    new Promise((resolve, reject) => {
      db.all(topCategoriesQuery, [userId, currentMonthStart], (err, rows) => {
        if (err) reject(err)
        else resolve(rows || [])
      })
    }),
  ])
    .then(([currentTotal, lastTotal, topCategories]) => {
      const insights = []

      // Comparação com mês anterior
      if (lastTotal > 0) {
        const percentChange = ((currentTotal - lastTotal) / lastTotal) * 100

        if (percentChange > 30) {
          insights.push({
            type: 'warning',
            icon: '⚠️',
            message: `Você gastou ${percentChange.toFixed(0)}% a mais que o mês anterior`,
            detail: `Mês atual: R$ ${currentTotal.toFixed(
              2,
            )} | Mês anterior: R$ ${lastTotal.toFixed(2)}`,
          })
        } else if (percentChange < -20) {
          insights.push({
            type: 'success',
            icon: '✅',
            message: `Parabéns! Você economizou ${Math.abs(percentChange).toFixed(
              0,
            )}% comparado ao mês anterior`,
            detail: `Mês atual: R$ ${currentTotal.toFixed(
              2,
            )} | Mês anterior: R$ ${lastTotal.toFixed(2)}`,
          })
        } else if (Math.abs(percentChange) <= 10) {
          insights.push({
            type: 'info',
            icon: '📊',
            message: 'Seus gastos estão estáveis comparado ao mês anterior',
            detail: `Variação de apenas ${Math.abs(percentChange).toFixed(1)}%`,
          })
        }
      }

      // Top categorias
      if (topCategories.length > 0) {
        const topCategory = topCategories[0]
        insights.push({
          type: 'info',
          icon: topCategory.icon || '📁',
          message: `Top gasto: ${topCategory.name}`,
          detail: `R$ ${Number(topCategory.total).toFixed(2)} em ${topCategory.count} transações`,
          color: topCategory.color,
        })

        // Alerta se uma categoria está consumindo muito
        const categoryPercentage = (topCategory.total / currentTotal) * 100
        if (categoryPercentage > 40) {
          insights.push({
            type: 'warning',
            icon: '💡',
            message: `${topCategory.name} representa ${categoryPercentage.toFixed(
              0,
            )}% dos seus gastos`,
            detail: 'Considere revisar estes gastos para otimizar seu orçamento',
          })
        }
      }

      // Insight sobre receitas
      db.get(
        `SELECT SUM(amount) as total FROM transactions WHERE user_id = ? AND direction = 'credit' AND datetime(created_at) >= datetime(?)`,
        [userId, currentMonthStart],
        (err, creditRow) => {
          if (!err && creditRow?.total) {
            const balance = creditRow.total - currentTotal
            if (balance < 0) {
              insights.push({
                type: 'warning',
                icon: '⚠️',
                message: 'Gastos superiores às receitas este mês',
                detail: `Déficit de R$ ${Math.abs(balance).toFixed(2)}`,
              })
            } else if (balance > 500) {
              insights.push({
                type: 'success',
                icon: '💰',
                message: 'Ótimo controle financeiro!',
                detail: `Você economizou R$ ${balance.toFixed(2)} este mês`,
              })
            }
          }

          res.json({
            insights,
            summary: {
              currentMonth: currentTotal,
              lastMonth: lastTotal,
              topCategories,
            },
          })
        },
      )
    })
    .catch((err) => {
      console.error('Erro ao gerar insights:', err)
      res.status(500).json({ message: 'Erro ao gerar insights financeiros', error: err.message })
    })
}

module.exports = { getFinancialInsights }
