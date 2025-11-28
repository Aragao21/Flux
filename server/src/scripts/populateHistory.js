const db = require('../db')

/**
 * Script para popular o banco de dados com transações históricas
 * Simula transações dos últimos 6 meses para análise financeira
 */

const transactionTypes = [
  {
    type: 'PIX_ENVIADO',
    direction: 'debit',
    categoryWeight: { 1: 0.3, 2: 0.2, 3: 0.1, 4: 0.1, 5: 0.1, 6: 0.1, 7: 0.05, 8: 0.05 },
  },
  {
    type: 'PAGAMENTO',
    direction: 'debit',
    categoryWeight: { 6: 0.4, 1: 0.2, 3: 0.15, 2: 0.15, 9: 0.1 },
  },
  { type: 'RECARGA', direction: 'debit', categoryWeight: { 9: 1.0 } },
  {
    type: 'COMPRA_CASHBACK',
    direction: 'debit',
    categoryWeight: { 1: 0.3, 7: 0.25, 5: 0.2, 9: 0.25 },
  },
  { type: 'PIX_RECEBIDO', direction: 'credit', categoryWeight: {} },
  { type: 'CASHBACK_BONUS', direction: 'credit', categoryWeight: {} },
]

const categoryDescriptions = {
  1: ['Supermercado', 'Restaurante', 'Padaria', 'Lanchonete', 'Delivery'],
  2: ['Uber', 'Combustível', 'Estacionamento', '99', 'Pedágio'],
  3: ['Farmácia', 'Consulta médica', 'Exames', 'Academia'],
  4: ['Curso online', 'Livros', 'Material escolar'],
  5: ['Cinema', 'Streaming', 'Show', 'Jogo'],
  6: ['Aluguel', 'Condomínio', 'Energia', 'Água', 'Internet'],
  7: ['Roupa', 'Calçado', 'Acessórios'],
  8: ['Hotel', 'Passagem', 'Hospedagem'],
  9: ['Diversos', 'Outros'],
}

function getRandomCategory(weights) {
  const categories = Object.keys(weights).map(Number)
  if (categories.length === 0) return null

  const random = Math.random()
  let cumulative = 0

  for (const catId of categories) {
    cumulative += weights[catId]
    if (random <= cumulative) return catId
  }

  return categories[0]
}

function getRandomDescription(categoryId) {
  const descriptions = categoryDescriptions[categoryId] || categoryDescriptions[9]
  return descriptions[Math.floor(Math.random() * descriptions.length)]
}

function getRandomAmount(type) {
  if (type === 'PIX_RECEBIDO') return 500 + Math.random() * 2000
  if (type === 'CASHBACK_BONUS') return 5 + Math.random() * 50
  if (type === 'PAGAMENTO') return 50 + Math.random() * 500
  if (type === 'RECARGA') return 15 + Math.random() * 35
  if (type === 'COMPRA_CASHBACK') return 30 + Math.random() * 300
  return 10 + Math.random() * 200
}

function generateRandomDate(monthsAgo) {
  const now = new Date()
  const targetDate = new Date(now.getFullYear(), now.getMonth() - monthsAgo, 1)
  const daysInMonth = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0).getDate()
  const randomDay = 1 + Math.floor(Math.random() * daysInMonth)
  const randomHour = Math.floor(Math.random() * 24)
  const randomMinute = Math.floor(Math.random() * 60)

  return new Date(
    targetDate.getFullYear(),
    targetDate.getMonth(),
    randomDay,
    randomHour,
    randomMinute,
  )
}

function populateHistoricalData() {
  return new Promise((resolve, reject) => {
    db.all('SELECT id FROM users', (err, users) => {
      if (err) return reject(err)

      db.all('SELECT id, name FROM categories', (errCat, categories) => {
        if (errCat) return reject(errCat)

        const categoryMap = {}
        categories.forEach((cat) => {
          categoryMap[cat.id] = cat.name
        })

        const transactions = []

        // Gerar transações para os últimos 6 meses
        for (let monthsAgo = 0; monthsAgo < 6; monthsAgo++) {
          // Número de transações varia por mês (15-40)
          const numTransactions = 15 + Math.floor(Math.random() * 25)

          for (let i = 0; i < numTransactions; i++) {
            const txType = transactionTypes[Math.floor(Math.random() * transactionTypes.length)]
            const amount = getRandomAmount(txType.type)
            const categoryId = getRandomCategory(txType.categoryWeight)
            const description = categoryId ? getRandomDescription(categoryId) : 'Transação'
            const date = generateRandomDate(monthsAgo)
            const userId = users[Math.floor(Math.random() * users.length)].id

            const party =
              txType.direction === 'credit'
                ? 'Recebimento'
                : ['exemplo@email.com', '+5511999999999', 'Estabelecimento'][
                    Math.floor(Math.random() * 3)
                  ]

            transactions.push({
              type: txType.type,
              direction: txType.direction,
              amount: amount.toFixed(2),
              party,
              description,
              category: categoryId ? categoryMap[categoryId] : 'Outros',
              categoryId,
              userId,
              createdAt: date.toISOString(),
            })
          }
        }

        // Inserir todas as transações
        const stmt = db.prepare(`
          INSERT INTO transactions 
          (type, direction, amount, party, description, category, category_id, user_id, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `)

        transactions.forEach((tx) => {
          stmt.run(
            tx.type,
            tx.direction,
            tx.amount,
            tx.party,
            tx.description,
            tx.category,
            tx.categoryId,
            tx.userId,
            tx.createdAt,
          )
        })

        stmt.finalize((err) => {
          if (err) return reject(err)
          console.log(`✅ ${transactions.length} transações históricas inseridas com sucesso!`)
          resolve(transactions.length)
        })
      })
    })
  })
}

// Executar se chamado diretamente
if (require.main === module) {
  populateHistoricalData()
    .then((count) => {
      console.log(`Script finalizado. Total: ${count} transações.`)
      process.exit(0)
    })
    .catch((err) => {
      console.error('Erro ao popular dados históricos:', err)
      process.exit(1)
    })
}

module.exports = { populateHistoricalData }
