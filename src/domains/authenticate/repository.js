const Logger = require("../../core/logger")

class AuthRepository {
  constructor (model, model_order) {
    this.model = model
    this.model_order = model_order
  }

  static create (model, model_order) {
    return new AuthRepository (model, model_order)
  }

  getOne = async condition => {
    try {
      return await this.model.findOne({
        where: condition
      })
    } catch (err) {
      throw err
    }
  }

  getOneWithTransaction = async condition => {
    try {
      const profile = await this.model.findOne({
        where: condition,
        attributes: [
          'id', 'email'
        ]
      })

      const transaction = await this.model_order.findAll({
        where: {
          user_id: condition.id,
          is_paid: true
        },
        attributes: [
          'id', 'items', 'is_paid'
        ]
      })

      return { profile, transaction }
    } catch (err) {
      throw err
    }
  }

  storeOne = async input => {
    try {
      return await this.model.create(input)
    } catch (err) {
      throw err
    }
  }

  getOrStoreOne = async (condition, input) => {
    try {
      return await this.model.findOrCreate({
        where: condition,
        defaults: input
      })
    } catch (err) {
      throw err
    }
  }
}

module.exports = AuthRepository