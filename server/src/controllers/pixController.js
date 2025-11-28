const { persistTransaction } = require('../services/transactionsService')

async function sendPix(req, res) {
  try {
    const { amount, to, description, userId: rawUserId, tag, categoryId } = req.body
    const userId = Number(rawUserId) || 1
    if (!amount || !to)
      return res.status(400).json({ message: 'Valor e destinatário são obrigatórios.' })
    const result = await persistTransaction({
      type: 'PIX_ENVIADO',
      direction: 'debit',
      amount: Number(amount),
      party: to,
      description: description || 'Envio de PIX',
      userId,
      tag: tag || 'Transferência',
      categoryId: categoryId ? Number(categoryId) : null,
    })
    res.json({
      message: 'PIX enviado com sucesso.',
      receipt: `FLUX-${Date.now()}`,
      balance: result.newBalance,
    })
  } catch (error) {
    res.status(500).json({ message: 'Erro ao registrar PIX', error: error.message })
  }
}

module.exports = { sendPix }
