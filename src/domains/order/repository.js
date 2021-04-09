const { Op } = require("sequelize")

class OrdersRepository {
  constructor (model, model_item, model_product) {
    this.model = model
    this.model_item = model_item
    this.model_product = model_product
  }

  static create (model, model_item, model_product) {
    return new OrdersRepository (model, model_item, model_product)
  }

  getOne = async condition => {
    try {
      const data = {}

      data.product = await this.model.findOne({
        where: condition
      })

      if (data.product) {
        data.stock = await this.model_item.count({ where: { sku: data.product.sku }})
      }

      return data
    } catch (err) {
      throw err
    }
  }

  getOneOrder = async condition => {
    try {
      return await this.model.findOne({
        where: condition
      })
    } catch (err) {
      throw err
    }
  }

  getAll = async condition => {
    try {
      return await this.model.findAndCountAll(condition)
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

  updateOne = async (condition, input) => {
    try {
      return await this.model.update(input, {
        where: condition,
        returning: true
      })
    } catch (err) {
      throw err
    }
  }

  removeOne = async (condition) => {
    try {
      const value = await this.model.findOne({
        where: condition
      })

      const remove = await this.model.destroy({
        where: condition
      })

      if (remove) return value
    } catch (err) {
      throw err
    }
  }

  removeStock = async condition => {
    try {
      return await this.model_item.destroy({
        where: condition
      })
    } catch (err) {
      throw err
    }
  }

  totalAvailable = async condition => {
    try {
      return await this.model_item.count({
        where: condition
      })
    } catch (err) {
      throw err
    }
  }

  getProducts = async condition => {
    try {
      return await this.model_product.findAll({
        where: condition
      })
    } catch (err) {
      throw err
    }
  }

  order = async field => {
    try {
      return await this.model.create(field)
    } catch (err) {
      throw err
    }
  }

  paymentCallback = async (payment_id, status) => {
    try {
      const transaction = await this.model.update({
        is_paid: status === 'success' ? true : false
      }, {
        where: {
          payment_record: {
            payment_id
          },
          is_paid: false
        },
        returning: true
      })

      // should update user transaction log to get its transaction
      // should delete some stock and need validation if stock not enough to wait some more
      const skusNeedRestock = []
      const skusContinue = []
      for (let i = 0; i < transaction[1][0].items.length; i++) {
        const validationStock = await this.model_item.findAndCountAll({
          where: {
            sku: transaction[1][0].items[i].sku
          }
        })
        if (transaction[1][0].items[i].total > validationStock.count) {
          skusNeedRestock.push(transaction[1][0].items[i].sku)
        } else {
          skusContinue.push({
            sku: transaction[1][0].items[i].sku,
            total: transaction[1][0].items[i].total
          })
        }
      }

      if (skusNeedRestock.length > 0) {
        return {
          success: false,
          message: 'Stock is not enough. will contact administrator to fill the stock',
          sku_need_restock: skusNeedRestock
        }
      }

      if (skusContinue.length > 0) {
        for (let i = 0; i < skusContinue.length; i++) {
          const skus = skusContinue[i].sku
          const total = skusContinue[i].total

          await this.model_item.destroy({
            where: {
              sku: skus
            },
            limit: total
          })
        }
      }

      return {
        success: true,
        message: 'Transaction is completed'
      }
    } catch (err) {
      throw err
    }
  }
}

module.exports = OrdersRepository