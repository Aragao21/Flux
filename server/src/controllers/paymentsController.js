const { persistTransaction } = require('../services/transactionsService');

async function payBill(req, res) {
  try {
    const { amount, barcode, description } = req.body;
    if (!amount || !barcode) return res.status(400).json({ message: 'Valor e código de barras são obrigatórios.' });
    const result = await persistTransaction({
      type: 'PAGAMENTO',
      direction: 'debit',
      amount: Number(amount),
      party: barcode,
      description: description || 'Pagamento de conta',
    });
    res.json({ message: 'Pagamento simulado realizado.', receipt: `FLUX-${Date.now()}`, balance: result.newBalance });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao simular pagamento', error: error.message });
  }
}

module.exports = { payBill };
