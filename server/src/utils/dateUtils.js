/**
 * Utilitários para formatação de datas com timezone de Brasília
 */

// Define o timezone de Brasília
const TIMEZONE = 'America/Sao_Paulo'

/**
 * Formata uma data para o timezone de Brasília
 * @param {Date|string} date - Data a ser formatada
 * @returns {string} Data formatada no formato ISO com timezone
 */
function toBrazilTime(date) {
  const d = date instanceof Date ? date : new Date(date)
  return d.toLocaleString('pt-BR', { timeZone: TIMEZONE })
}

/**
 * Retorna a data/hora atual no timezone de Brasília
 * @returns {Date} Data atual
 */
function now() {
  return new Date()
}

/**
 * Formata data para exibição no formato brasileiro
 * @param {Date|string} date - Data a ser formatada
 * @param {boolean} includeTime - Se deve incluir hora
 * @returns {string} Data formatada
 */
function formatBrazilDate(date, includeTime = false) {
  const d = date instanceof Date ? date : new Date(date)

  const options = {
    timeZone: TIMEZONE,
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }

  if (includeTime) {
    options.hour = '2-digit'
    options.minute = '2-digit'
    options.second = '2-digit'
  }

  return d.toLocaleString('pt-BR', options)
}

/**
 * Retorna o timestamp atual para o banco de dados
 * @returns {string} Timestamp em formato ISO
 */
function getCurrentTimestamp() {
  return new Date().toISOString()
}

module.exports = {
  toBrazilTime,
  now,
  formatBrazilDate,
  getCurrentTimestamp,
  TIMEZONE,
}
