const sqlite3 = require('sqlite3').verbose()
const path = require('path')

const dbPath = path.join(__dirname, '..', '..', 'data', 'flux.db')
const db = new sqlite3.Database(dbPath)

console.log('Limpando banco de dados...')

db.serialize(() => {
  // Deletar todas as transações
  db.run('DELETE FROM transactions', (err) => {
    if (err) {
      console.error('Erro ao deletar transações:', err)
    } else {
      console.log('✅ Todas as transações foram deletadas')
    }
  })

  // Resetar saldo de todos os usuários para 5000
  db.run('UPDATE users SET balance = 5000', (err) => {
    if (err) {
      console.error('Erro ao atualizar saldo:', err)
    } else {
      console.log('✅ Saldo de todos os usuários resetado para R$ 5000,00')
    }
  })

  // Verificar resultado
  db.all('SELECT username, balance FROM users', (err, rows) => {
    if (err) {
      console.error('Erro ao verificar usuários:', err)
    } else {
      console.log('\n📊 Usuários após limpeza:')
      rows.forEach((row) => {
        console.log(`   - ${row.username}: R$ ${row.balance.toFixed(2)}`)
      })
    }
  })

  db.get('SELECT COUNT(*) as count FROM transactions', (err, row) => {
    if (err) {
      console.error('Erro ao verificar transações:', err)
    } else {
      console.log(`\n💳 Total de transações: ${row.count}`)
    }
  })
})

setTimeout(() => {
  db.close(() => {
    console.log('\n✅ Banco de dados limpo com sucesso!')
  })
}, 2000)
