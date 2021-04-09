/* eslint-disable global-require */
const Sequelize = require('sequelize')

const options = {
  pool: {
    max: 5,
    min: 0,
    acquire: 15000,
    idle: 10000
  }
}

// create sequelize
const seq = new Sequelize(
  process.env.APP_DATABASE_NAME,
  process.env.APP_DATABASE_USER,
  process.env.APP_DATABASE_PASS,
  {
    host: process.env.APP_DATABASE_HOST,
    dialect: process.env.APP_DATABASE_DIALECT
  },
  options
)

// setup models
const models = [
  require('../models/user'),
  require('../models/product'),
  require('../models/items'),
  require('../models/orders')
]

// inject connection
for (const model of models) {
  model(seq)
}

module.exports = seq
