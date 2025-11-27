const { listTransactions, summary, categoryRules } = require('../services/transactionsService');

async function getTransactions(req, res) {
  try {
    const transactions = await listTransactions();
    res.json({ transactions });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao listar transações', error: error.message });
  }
}

async function getSummary(req, res) {
  try {
    const data = await summary();
    res.json({ ...data, categoryRules });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao obter resumo', error: error.message });
  }
}

module.exports = { getTransactions, getSummary };
