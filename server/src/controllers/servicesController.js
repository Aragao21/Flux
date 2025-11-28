const { persistTransaction } = require('../services/transactionsService')

async function purchase(req, res) {
  try {
    const { amount, merchant, userId: rawUserId, tag, categoryId } = req.body
    const userId = Number(rawUserId) || 1
    if (!amount) return res.status(400).json({ message: 'Informe o valor da compra.' })
    await persistTransaction({
      type: 'COMPRA_CASHBACK',
      direction: 'debit',
      amount: Number(amount),
      party: merchant || 'Loja Flux',
      description: 'Compra com cashback',
      userId,
      tag: tag || 'Compras',
      categoryId: categoryId ? Number(categoryId) : null,
    })
    const cashbackTx = await persistTransaction({
      type: 'CASHBACK_BONUS',
      direction: 'credit',
      amount: Number(amount) * 0.05,
      party: 'Cashback Flux',
      description: 'Bônus 5%',
      userId,
      tag: 'Cashback',
      categoryId: categoryId ? Number(categoryId) : null,
    })
    res.json({
      message: 'Compra registrada com cashback creditado.',
      balance: cashbackTx.newBalance,
    })
  } catch (error) {
    res.status(500).json({ message: 'Erro ao registrar compra', error: error.message })
  }
}

async function insurance(req, res) {
  try {
    const { amount, provider, userId: rawUserId, tag, categoryId } = req.body
    const userId = Number(rawUserId) || 1
    if (!amount) return res.status(400).json({ message: 'Informe o valor do seguro.' })
    const result = await persistTransaction({
      type: 'SEGURO',
      direction: 'debit',
      amount: Number(amount),
      party: provider || 'Seguro Flux',
      description: 'Assinatura de seguro',
      userId,
      tag: tag || 'Seguro',
      categoryId: categoryId ? Number(categoryId) : null,
    })
    res.json({ message: 'Seguro ativado com sucesso.', balance: result.newBalance })
  } catch (error) {
    res.status(500).json({ message: 'Erro ao registrar seguro', error: error.message })
  }
}

async function loan(req, res) {
  try {
    const {
      amount,
      description,
      userId: rawUserId,
      tag,
      installments,
      dueDate,
      categoryId,
    } = req.body
    const userId = Number(rawUserId) || 1
    if (!amount) return res.status(400).json({ message: 'Informe o valor do empréstimo.' })

    const installmentsCount = parseInt(installments) || 1
    const installmentAmount = Number(amount) / installmentsCount

    // Liberar o crédito total
    const result = await persistTransaction({
      type: 'EMPRESTIMO',
      direction: 'credit',
      amount: Number(amount),
      party: 'Linha Flux',
      description:
        description ||
        `Crédito liberado - ${installmentsCount}x de R$ ${installmentAmount.toFixed(2)}`,
      userId,
      tag: tag || 'Empréstimo',
      categoryId: categoryId ? Number(categoryId) : null,
    })

    // Criar lançamentos futuros para as parcelas (se mais de 1)
    if (installmentsCount > 1 && dueDate) {
      const baseDate = new Date(dueDate)

      for (let i = 1; i <= installmentsCount; i++) {
        const parcDate = new Date(baseDate)
        parcDate.setMonth(parcDate.getMonth() + (i - 1))

        await persistTransaction({
          type: 'PAGAMENTO',
          direction: 'debit',
          amount: installmentAmount,
          party: 'Parcela Empréstimo Flux',
          description: `Parcela ${i}/${installmentsCount} - Empréstimo`,
          userId,
          tag: 'Empréstimo',
          categoryId: categoryId ? Number(categoryId) : null,
          createdAt: parcDate.toISOString(),
        })
      }
    }

    res.json({
      message: `Empréstimo de R$ ${Number(amount).toFixed(
        2,
      )} liberado em ${installmentsCount}x de R$ ${installmentAmount.toFixed(2)}`,
      balance: result.newBalance,
    })
  } catch (error) {
    res.status(500).json({ message: 'Erro ao registrar empréstimo', error: error.message })
  }
}

module.exports = { purchase, insurance, loan }
