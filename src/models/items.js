const Sequelize = require('sequelize')

module.exports = (sequelize) => {
  sequelize.define('ItemsModel', {
    sku: Sequelize.STRING,
    entity_id: Sequelize.UUID
  }, {
    identifier: { type: Sequelize.STRING, primaryKey: true },
    tableName: 'Items',
    timestamps: true,
  })
}
