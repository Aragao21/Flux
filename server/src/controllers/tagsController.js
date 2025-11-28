const db = require('../db');

function listTags(req, res) {
  const userId = Number(req.query.userId) || 1;
  db.all('SELECT * FROM tags WHERE user_id = ? ORDER BY name ASC', [userId], (err, rows) => {
    if (err) return res.status(500).json({ message: 'Erro ao listar etiquetas', error: err.message });
    res.json({ tags: rows });
  });
}

function createTag(req, res) {
  const userId = Number(req.body.userId) || 1;
  const { name, color } = req.body;
  if (!name) return res.status(400).json({ message: 'Informe um nome para a etiqueta.' });

  const normalizedColor = color || '#ED1C24';
  db.run(
    'INSERT OR IGNORE INTO tags (name, color, user_id) VALUES (?, ?, ?)',
    [name, normalizedColor, userId],
    function (err) {
      if (err) return res.status(500).json({ message: 'Erro ao criar etiqueta', error: err.message });
      if (this.changes === 0) return res.status(200).json({ message: 'Etiqueta já cadastrada.' });
      res.json({ message: 'Etiqueta criada.', tag: { id: this.lastID, name, color: normalizedColor } });
    }
  );
}

module.exports = { listTags, createTag };
