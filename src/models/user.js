const Sequelize = require('sequelize')

module.exports = (sequelize) => {
  sequelize.define('UserModel', {
    email: Sequelize.STRING,
    password: Sequelize.STRING,
  }, {
    identifier: { type: Sequelize.STRING, primaryKey: true },
    tableName: 'Users',
    timestamps: true,
  })
}
