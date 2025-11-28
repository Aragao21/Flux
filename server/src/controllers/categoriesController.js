const db = require('../db')

function listCategories(req, res) {
  const userId = Number(req.query.userId) || 1
  db.all('SELECT * FROM categories WHERE user_id = ? ORDER BY name ASC', [userId], (err, rows) => {
    if (err)
      return res.status(500).json({ message: 'Erro ao listar categorias', error: err.message })
    res.json({ categories: rows })
  })
}

function createCategory(req, res) {
  const userId = Number(req.body.userId) || 1
  const { name, color, icon } = req.body
  if (!name) return res.status(400).json({ message: 'Informe um nome para a categoria.' })

  const normalizedColor = color || '#ED1C24'
  const normalizedIcon = icon || '📁'

  db.run(
    'INSERT OR IGNORE INTO categories (name, color, icon, user_id) VALUES (?, ?, ?, ?)',
    [name, normalizedColor, normalizedIcon, userId],
    function (err) {
      if (err)
        return res.status(500).json({ message: 'Erro ao criar categoria', error: err.message })
      if (this.changes === 0) return res.status(200).json({ message: 'Categoria já cadastrada.' })
      res.json({
        message: 'Categoria criada.',
        category: { id: this.lastID, name, color: normalizedColor, icon: normalizedIcon },
      })
    },
  )
}

function updateCategory(req, res) {
  const { id } = req.params
  const userId = Number(req.body.userId) || 1
  const { name, color, icon } = req.body

  if (!name) return res.status(400).json({ message: 'Informe um nome para a categoria.' })

  db.run(
    'UPDATE categories SET name = ?, color = ?, icon = ? WHERE id = ? AND user_id = ?',
    [name, color || '#ED1C24', icon || '📁', id, userId],
    function (err) {
      if (err)
        return res.status(500).json({ message: 'Erro ao atualizar categoria', error: err.message })
      if (this.changes === 0) return res.status(404).json({ message: 'Categoria não encontrada.' })
      res.json({ message: 'Categoria atualizada.', category: { id, name, color, icon } })
    },
  )
}

function deleteCategory(req, res) {
  const { id } = req.params
  const userId = Number(req.body.userId || req.query.userId) || 1

  db.run('DELETE FROM categories WHERE id = ? AND user_id = ?', [id, userId], function (err) {
    if (err)
      return res.status(500).json({ message: 'Erro ao excluir categoria', error: err.message })
    if (this.changes === 0) return res.status(404).json({ message: 'Categoria não encontrada.' })
    res.json({ message: 'Categoria excluída.' })
  })
}

module.exports = { listCategories, createCategory, updateCategory, deleteCategory }
