const Sequelize = require('sequelize')

module.exports = (sequelize) => {
  sequelize.define('OrdersModel', {
    user_id: Sequelize.INTEGER,
    items: Sequelize.JSON,
    is_paid: Sequelize.BOOLEAN,
    payment_record: Sequelize.JSON
  }, {
    identifier: { type: Sequelize.STRING, primaryKey: true },
    tableName: 'Orders',
    timestamps: true,
  })
}
