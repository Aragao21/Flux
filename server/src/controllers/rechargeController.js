const { persistTransaction } = require('../services/transactionsService')

async function recharge(req, res) {
  try {
    const { amount, phone, operator, userId: rawUserId, categoryId } = req.body
    const userId = Number(rawUserId) || 1
    if (!amount || !phone)
      return res.status(400).json({ message: 'Valor e telefone são obrigatórios.' })
    const result = await persistTransaction({
      type: 'RECARGA',
      direction: 'debit',
      amount: Number(amount),
      party: `${phone} ${operator || ''}`.trim(),
      description: 'Recarga de celular',
      userId,
      tag: 'Recarga',
      categoryId: categoryId ? Number(categoryId) : null,
    })
    res.json({
      message: 'Recarga concluída.',
      receipt: `FLUX-${Date.now()}`,
      balance: result.newBalance,
    })
  } catch (error) {
    res.status(500).json({ message: 'Erro ao registrar recarga', error: error.message })
  }
}

module.exports = { recharge }
