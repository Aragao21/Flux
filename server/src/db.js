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
      email TEXT,
      role TEXT DEFAULT 'user',
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
      tag TEXT,
      contested INTEGER DEFAULT 0,
      user_id INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.all("PRAGMA table_info('transactions')", (err, rows) => {
    if (err) return;
    const hasContested = rows.some((r) => r.name === 'contested');
    const hasUserId = rows.some((r) => r.name === 'user_id');
    const hasTag = rows.some((r) => r.name === 'tag');
    if (!hasContested) {
      db.run('ALTER TABLE transactions ADD COLUMN contested INTEGER DEFAULT 0');
    }
    if (!hasUserId) {
      db.run('ALTER TABLE transactions ADD COLUMN user_id INTEGER DEFAULT 1');
      db.run('UPDATE transactions SET user_id = 1 WHERE user_id IS NULL');
    }
    if (!hasTag) {
      db.run('ALTER TABLE transactions ADD COLUMN tag TEXT');
    }
  });

  db.run(`
    CREATE TABLE IF NOT EXISTS tags (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      color TEXT DEFAULT '#ED1C24',
      user_id INTEGER DEFAULT 1,
      UNIQUE(name, user_id)
    )
  `);

  db.all("PRAGMA table_info('users')", (err, rows) => {
    if (err) return;
    const hasRole = rows.some((r) => r.name === 'role');
    const hasEmail = rows.some((r) => r.name === 'email');
    if (!hasEmail) {
      db.run('ALTER TABLE users ADD COLUMN email TEXT');
    }
    if (!hasRole) {
      db.run("ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'user'");
    }
  });

  const seedUsers = [
    ['flux', '123456', 'Admin Flux', 'admin@flux.app', 'admin', 2500],
    ['danilo', 'senha123', 'Danilo Guarnieri', 'danilo@flux.app', 'user', 1850],
    ['flavia', 'senha123', 'Flávia Aragão', 'flavia@flux.app', 'user', 3200],
    ['joao', 'senha123', 'João Piola', 'joao@flux.app', 'user', 1420],
  ];

  const stmt = db.prepare(
    'INSERT OR IGNORE INTO users (username, password, name, email, role, balance) VALUES (?, ?, ?, ?, ?, ?)'
  );
  seedUsers.forEach((u) => stmt.run(u));
  stmt.finalize();
  db.run("UPDATE users SET role = 'admin' WHERE username = 'flux'");
  db.run("UPDATE users SET email = COALESCE(email, username || '@flux.app')");

  const defaultTags = [
    { name: 'Transferência', color: '#ED1C24' },
    { name: 'Recebimento', color: '#16a34a' },
    { name: 'Contas', color: '#0ea5e9' },
    { name: 'Telefone', color: '#f97316' },
    { name: 'Compras', color: '#8b5cf6' },
    { name: 'Cashback', color: '#16a34a' },
    { name: 'Seguro', color: '#0f172a' },
    { name: 'Empréstimo', color: '#10b981' },
    { name: 'Recarga', color: '#f97316' },
  ];

  db.all('SELECT id FROM users', (err, users) => {
    if (err) return;
    users.forEach((user) => {
      const tagStmt = db.prepare('INSERT OR IGNORE INTO tags (name, color, user_id) VALUES (?, ?, ?)');
      defaultTags.forEach((tag) => tagStmt.run(tag.name, tag.color, user.id));
      tagStmt.finalize();
    });
  });
});

module.exports = db;
