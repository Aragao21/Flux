const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'flux.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      balance REAL DEFAULT 0
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      direction TEXT NOT NULL,
      amount REAL NOT NULL,
      party TEXT,
      description TEXT,
      category TEXT NOT NULL,
      contested INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.all("PRAGMA table_info('transactions')", (err, rows) => {
    if (err) return;
    const hasContested = rows.some((r) => r.name === 'contested');
    if (!hasContested) {
      db.run('ALTER TABLE transactions ADD COLUMN contested INTEGER DEFAULT 0');
    }
  });

  db.get('SELECT COUNT(*) as count FROM users', (err, row) => {
    if (err) return;
    if (row.count === 0) {
      db.run(
        'INSERT INTO users (username, password, name, balance) VALUES (?, ?, ?, ?)',
        ['flux', '123456', 'Usuário Flux', 2500]
      );
    }
  });
});

module.exports = db;
