const { persistTransaction } = require('../services/transactionsService');

async function purchase(req, res) {
  try {
    const { amount, merchant } = req.body;
    if (!amount) return res.status(400).json({ message: 'Informe o valor da compra.' });
    await persistTransaction({
      type: 'COMPRA_CASHBACK',
      direction: 'debit',
      amount: Number(amount),
      party: merchant || 'Loja Flux',
      description: 'Compra com cashback',
    });
    const cashbackTx = await persistTransaction({
      type: 'CASHBACK_BONUS',
      direction: 'credit',
      amount: Number(amount) * 0.05,
      party: 'Cashback Flux',
      description: 'Bônus 5%',
    });
    res.json({ message: 'Compra simulada com cashback creditado.', balance: cashbackTx.newBalance });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao registrar compra', error: error.message });
  }
}

async function insurance(req, res) {
  try {
    const { amount, provider } = req.body;
    if (!amount) return res.status(400).json({ message: 'Informe o valor do seguro.' });
    const result = await persistTransaction({
      type: 'SEGURO',
      direction: 'debit',
      amount: Number(amount),
      party: provider || 'Seguro Flux',
      description: 'Assinatura de seguro',
    });
    res.json({ message: 'Seguro simulado com sucesso.', balance: result.newBalance });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao registrar seguro', error: error.message });
  }
}

async function loan(req, res) {
  try {
    const { amount, description } = req.body;
    if (!amount) return res.status(400).json({ message: 'Informe o valor do empréstimo.' });
    const result = await persistTransaction({
      type: 'EMPRESTIMO',
      direction: 'credit',
      amount: Number(amount),
      party: 'Linha Flux',
      description: description || 'Crédito liberado',
    });
    res.json({ message: 'Empréstimo liberado no saldo simulado.', balance: result.newBalance });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao registrar empréstimo', error: error.message });
  }
}

module.exports = { purchase, insurance, loan };
