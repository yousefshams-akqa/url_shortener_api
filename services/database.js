const postgres = require('postgres')
const constants = require('../constants/constants')

const connectionString = constants.DATABASE_URL
const sql = postgres(connectionString, { ssl: 'require' })

module.exports = sql