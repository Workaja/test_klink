const Sequelize = require('sequelize')

module.exports = (sequelize) => {
  sequelize.define('ProductModel', {
    sku: Sequelize.STRING,
    name: Sequelize.STRING,
    price: Sequelize.STRING
  }, {
    identifier: { type: Sequelize.STRING, primaryKey: true },
    tableName: 'Products',
    timestamps: true,
  })
}
