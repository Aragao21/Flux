const { persistTransaction } = require('../services/transactionsService');

async function sendPix(req, res) {
  try {
    const { amount, to, description } = req.body;
    if (!amount || !to) return res.status(400).json({ message: 'Valor e destinatário são obrigatórios.' });
    const result = await persistTransaction({
      type: 'PIX_ENVIADO',
      direction: 'debit',
      amount: Number(amount),
      party: to,
      description: description || 'Envio de PIX',
    });
    res.json({ message: 'PIX enviado com sucesso (simulado).', receipt: `FLUX-${Date.now()}`, balance: result.newBalance });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao simular PIX enviado', error: error.message });
  }
}

async function receivePix(req, res) {
  try {
    const { amount, from, description } = req.body;
    if (!amount || !from) return res.status(400).json({ message: 'Valor e remetente são obrigatórios.' });
    const result = await persistTransaction({
      type: 'PIX_RECEBIDO',
      direction: 'credit',
      amount: Number(amount),
      party: from,
      description: description || 'Recebimento PIX',
    });
    res.json({ message: 'PIX recebido (simulado).', receipt: `FLUX-${Date.now()}`, balance: result.newBalance });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao simular PIX recebido', error: error.message });
  }
}

module.exports = { sendPix, receivePix };
