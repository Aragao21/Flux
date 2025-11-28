const { persistTransaction } = require('../services/transactionsService');

async function payBill(req, res) {
  try {
    const { amount, barcode, description, userId: rawUserId } = req.body;
    const userId = Number(rawUserId) || 1;
    if (!amount || !barcode) return res.status(400).json({ message: 'Valor e código de barras são obrigatórios.' });
    const result = await persistTransaction({
      type: 'PAGAMENTO',
      direction: 'debit',
      amount: Number(amount),
      party: barcode,
      description: description || 'Pagamento de conta',
      userId,
    });
    res.json({ message: 'Pagamento registrado com sucesso.', receipt: `FLUX-${Date.now()}`, balance: result.newBalance });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao registrar pagamento', error: error.message });
  }
}

module.exports = { payBill };
