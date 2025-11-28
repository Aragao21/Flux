const db = require('../db');

const categoryRules = {
  PIX_ENVIADO: { label: 'Transferência', color: '#ED1C24', icon: '⇄' },
  PIX_RECEBIDO: { label: 'Recebimento', color: '#16a34a', icon: '⬇' },
  RECARGA: { label: 'Telefone', color: '#f97316', icon: '📱' },
  PAGAMENTO: { label: 'Contas', color: '#0ea5e9', icon: '🧾' },
  COMPRA_CASHBACK: { label: 'Compras', color: '#8b5cf6', icon: '🛍️' },
  CASHBACK_BONUS: { label: 'Cashback', color: '#16a34a', icon: '💸' },
  SEGURO: { label: 'Seguro', color: '#0f172a', icon: '🛡️' },
  EMPRESTIMO: { label: 'Crédito', color: '#10b981', icon: '💳' },
};

const directionFactor = {
  credit: 1,
  debit: -1,
};

function persistTransaction({ type, direction, amount, party, description }) {
  return new Promise((resolve, reject) => {
    const rule = categoryRules[type];
    const category = rule ? rule.label : 'Outros';

    db.run(
      `INSERT INTO transactions (type, direction, amount, party, description, category) VALUES (?, ?, ?, ?, ?, ?)`,
      [type, direction, amount, party, description, category],
      function (err) {
        if (err) return reject(err);
        const id = this.lastID;
        db.get('SELECT balance FROM users WHERE username = ?', ['flux'], (errUser, userRow) => {
          if (errUser || !userRow) return reject(errUser);
          const delta = (directionFactor[direction] || 1) * amount;
          const newBalance = userRow.balance + delta;
          db.run('UPDATE users SET balance = ? WHERE username = ?', [newBalance, 'flux']);
          resolve({ id, category, newBalance });
        });
      }
    );
  });
}

function contestTransaction(id) {
  return new Promise((resolve, reject) => {
    db.run('UPDATE transactions SET contested = 1 WHERE id = ?', [id], function (err) {
      if (err) return reject(err);
      resolve({ updated: this.changes });
    });
  });
}

function listTransactions() {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM transactions ORDER BY datetime(created_at) DESC', (err, rows) => {
      if (err) return reject(err);
      const withRules = rows.map((row) => ({
        ...row,
        categoryMeta: categoryRules[row.type] || { label: row.category, color: '#1f2937', icon: '•' },
      }));
      resolve(withRules);
    });
  });
}

function summary() {
  return new Promise((resolve, reject) => {
    db.all('SELECT category, direction, amount FROM transactions', (err, rows) => {
      if (err) return reject(err);
      const totals = {};
      rows.forEach((row) => {
        const key = row.category;
        const sign = directionFactor[row.direction] || 1;
        totals[key] = (totals[key] || 0) + sign * row.amount;
      });
      db.get('SELECT balance FROM users WHERE username = ?', ['flux'], (errUser, userRow) => {
        if (errUser) return reject(errUser);
        resolve({ balance: userRow ? userRow.balance : 0, totals });
      });
    });
  });
}

module.exports = { persistTransaction, listTransactions, summary, categoryRules, contestTransaction };
