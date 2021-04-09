const Logger = require("../../core/logger")

const logger = new Logger()

class OrdersService {
  constructor (repository) {
    this.repository = repository
  }

  static create (repository) {
    return new OrdersService (repository)
  }

  getOne = async condition => {
    try {
      return await this.repository.getOne(condition)
    } catch (err) {
      logger.error(`Cannot getOne on order service`, err)
      throw err
    }
  }

  getOneOrder = async condition => {
    try {
      return await this.repository.getOneOrder(condition)
    } catch (err) {
      logger.error(`Cannot getOne on order service`, err)
      throw err
    }
  }

  getAll = async condition => {
    try {
      return await this.repository.getAll(condition)
    } catch (err) {
      logger.error(`Cannot getAll on products service`, err)
      throw err
    }
  }

  storeOne = async fields => {
    try {
      return await this.repository.storeOne(fields)
    } catch (err) {
      logger.error(`Cannot storeOne on products service`, err)
      throw err
    }
  }

  getOrStoreOne = async (condition, fields) => {
    try {
      return await this.repository.getOrStoreOne(condition, fields)
    } catch (err) {
      logger.error(`Cannot getOrStoreOne on products service`, err)
      throw err
    }
  }

  updateOne = async (condition, fields) => {
    try {
      const update = await this.repository.updateOne(condition, fields)

      if (update) {
        return update[1][0]
      }
    } catch (err) {
      logger.error(`Cannot updateOne on products service`, err)
      throw err
    }
  }

  removeOne = async condition => {
    try {
      return await this.repository.removeOne(condition)
    } catch (err) {
      logger.error(`Cannot removeOne on products service`, err)
      throw err
    }
  }

  removeStock = async condition => {
    try {
      return await this.repository.removeStock(condition)
    } catch (err) {
      logger.error(`Cannot removeStock on products service`, err)
      throw err
    }
  }

  totalAvailable = async condition => {
    try {
      return await this.repository.totalAvailable(condition)
    } catch (err) {
      logger.error(`Cannot get totalAvailable on order service`, err)
      throw err
    }
  }

  getProducts = async condition => {
    try {
      return await this.repository.getProducts(condition)
    } catch (err) {
      logger.error(`Cannot get getProducts on order service`, err)
      throw err
    }
  }

  getPaymentStrategy = async payment_code => {
    try {
      const payStr = [
        {
          code: 'xendot',
          name: 'Xendot',
          fee: 2000
        },
        {
          code: 'madtrains',
          name: 'MadTrains',
          fee: 1800
        },
        {
          code: 'hawa',
          name: 'HawaPay',
          fee: 1000
        }
      ]

      let selected = false
      for(let p = 0; p < payStr.length; p++) {
        if (payStr[p].code === payment_code) {
          selected = payStr[p]
        }
      }

      if (selected === false) {
        return false
      }

      return selected
    } catch (err) {
      throw err
    }
  }

  order = async params => {
    try {
      return await this.repository.order(params)
    } catch (err) {
      throw err
    }
  }

  paymentCallback = async (payment_id, status) => {
    try {
      return await this.repository.paymentCallback(payment_id, status)
    } catch (err) {
      throw err
    }
  }
}

module.exports = OrdersService