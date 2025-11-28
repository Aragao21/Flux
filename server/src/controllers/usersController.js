const db = require('../db');

function getProfile(req, res) {
  const { id } = req.params;
  db.get(
    'SELECT id, username, name, email, role, balance FROM users WHERE id = ?',
    [id],
    (err, row) => {
      if (err) return res.status(500).json({ message: 'Erro ao carregar perfil', error: err.message });
      if (!row) return res.status(404).json({ message: 'Usuário não encontrado' });
      res.json({ user: row });
    }
  );
}

function updateProfile(req, res) {
  const { id } = req.params;
  const { name, email, password } = req.body;
  const updates = [];
  const values = [];

  if (name) {
    updates.push('name = ?');
    values.push(name);
  }
  if (email) {
    updates.push('email = ?');
    values.push(email);
  }
  if (password) {
    updates.push('password = ?');
    values.push(password);
  }

  if (updates.length === 0) {
    return res.status(400).json({ message: 'Nada para atualizar.' });
  }

  values.push(id);
  db.run(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, values, function (err) {
    if (err) return res.status(500).json({ message: 'Erro ao atualizar perfil', error: err.message });
    db.get(
      'SELECT id, username, name, email, role, balance FROM users WHERE id = ?',
      [id],
      (errSelect, row) => {
        if (errSelect) return res.status(500).json({ message: 'Erro ao carregar perfil', error: errSelect.message });
        res.json({ message: 'Perfil atualizado', user: row });
      }
    );
  });
}

module.exports = { getProfile, updateProfile };
