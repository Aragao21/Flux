const db = require('../db')

const categoryRules = {
  PIX_ENVIADO: { label: 'Transferência', color: '#ED1C24', icon: '⇄' },
  PIX_RECEBIDO: { label: 'Recebimento', color: '#16a34a', icon: '⬇' },
  RECARGA: { label: 'Telefone', color: '#f97316', icon: '📱' },
  PAGAMENTO: { label: 'Contas', color: '#0ea5e9', icon: '🧾' },
  COMPRA_CASHBACK: { label: 'Compras', color: '#8b5cf6', icon: '🛍️' },
  CASHBACK_BONUS: { label: 'Cashback', color: '#16a34a', icon: '💸' },
  SEGURO: { label: 'Seguro', color: '#0f172a', icon: '🛡️' },
  EMPRESTIMO: { label: 'Crédito', color: '#10b981', icon: '💳' },
}

const directionFactor = {
  credit: 1,
  debit: -1,
}

function persistTransaction({
  type,
  direction,
  amount,
  party,
  description,
  userId,
  tag,
  categoryId,
  createdAt,
}) {
  const targetUserId = Number(userId) || 1
  return new Promise((resolve, reject) => {
    const rule = categoryRules[type]
    const category = rule ? rule.label : 'Outros'
    const resolvedTag = tag || category
    const resolvedCategoryId = categoryId ? Number(categoryId) : null
    const timestamp = createdAt || new Date().toISOString()

    db.run(
      `INSERT INTO transactions (type, direction, amount, party, description, category, tag, category_id, user_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        type,
        direction,
        amount,
        party,
        description,
        category,
        resolvedTag,
        resolvedCategoryId,
        targetUserId,
        timestamp,
      ],
      function (err) {
        if (err) return reject(err)
        const id = this.lastID
        db.get('SELECT id, balance FROM users WHERE id = ?', [targetUserId], (errUser, userRow) => {
          if (errUser || !userRow) return reject(errUser || new Error('Usuário não encontrado'))
          const delta = (directionFactor[direction] || 1) * amount
          const newBalance = userRow.balance + delta
          db.run('UPDATE users SET balance = ? WHERE id = ?', [newBalance, userRow.id])
          resolve({ id, category, newBalance })
        })
      },
    )
  })
}

function contestTransaction(id) {
  return new Promise((resolve, reject) => {
    db.run('UPDATE transactions SET contested = 1 WHERE id = ?', [id], function (err) {
      if (err) return reject(err)
      resolve({ updated: this.changes })
    })
  })
}

function listTransactions(userId = 1, tagFilter) {
  return new Promise((resolve, reject) => {
    const params = [userId]
    let query = 'SELECT * FROM transactions WHERE user_id = ?'
    if (tagFilter) {
      query += ' AND tag = ?'
      params.push(tagFilter)
    }
    query += ' ORDER BY datetime(created_at) DESC'

    db.all(query, params, (err, rows) => {
      if (err) return reject(err)
      const withRules = rows.map((row) => ({
        ...row,
        categoryMeta: categoryRules[row.type] || {
          label: row.category,
          color: '#1f2937',
          icon: '•',
        },
      }))
      resolve(withRules)
    })
  })
}

function summary(userId = 1, tagFilter) {
  return new Promise((resolve, reject) => {
    const params = [userId]
    let query = `
      SELECT 
        t.category, 
        t.direction, 
        t.amount, 
        t.tag, 
        t.category_id,
        c.name as category_name
      FROM transactions t
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE t.user_id = ?
    `
    if (tagFilter) {
      query += ' AND t.tag = ?'
      params.push(tagFilter)
    }

    db.all(query, params, (err, rows) => {
      if (err) return reject(err)
      const totals = {}
      rows.forEach((row) => {
        // Usar o nome da categoria personalizada se existir, senão usar tag ou category
        const key = row.category_name || row.tag || row.category
        const sign = directionFactor[row.direction] || 1
        totals[key] = (totals[key] || 0) + sign * row.amount
      })
      db.get('SELECT balance FROM users WHERE id = ?', [userId], (errUser, userRow) => {
        if (errUser) return reject(errUser)
        resolve({ balance: userRow ? userRow.balance : 0, totals })
      })
    })
  })
}

module.exports = {
  persistTransaction,
  listTransactions,
  summary,
  categoryRules,
  contestTransaction,
}
