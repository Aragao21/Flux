const { persistTransaction } = require('../services/transactionsService');

async function sendPix(req, res) {
  try {
    const { amount, to, description, userId: rawUserId } = req.body;
    const userId = Number(rawUserId) || 1;
    if (!amount || !to) return res.status(400).json({ message: 'Valor e destinatário são obrigatórios.' });
    const result = await persistTransaction({
      type: 'PIX_ENVIADO',
      direction: 'debit',
      amount: Number(amount),
      party: to,
      description: description || 'Envio de PIX',
      userId,
    });
    res.json({ message: 'PIX enviado com sucesso (simulado).', receipt: `FLUX-${Date.now()}`, balance: result.newBalance });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao simular PIX enviado', error: error.message });
  }
}

module.exports = { sendPix };
