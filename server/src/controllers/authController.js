const db = require('../db');

function login(req, res) {
  const { username, password } = req.body;
  db.get(
    'SELECT id, username, name, balance FROM users WHERE username = ? AND password = ?',
    [username, password],
    (err, row) => {
      if (err) return res.status(500).json({ message: 'Erro no login', error: err.message });
      if (!row) return res.status(401).json({ message: 'Usuário ou senha inválidos.' });
      res.json({ token: 'fake-token', user: row });
    }
  );
}

module.exports = { login };
