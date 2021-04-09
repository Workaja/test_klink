const Logger = require("../../core/logger")

const logger = new Logger()

class ProductService {
  constructor (repository) {
    this.repository = repository
  }

  static create (repository) {
    return new ProductService (repository)
  }

  getOne = async condition => {
    try {
      return await this.repository.getOne(condition)
    } catch (err) {
      logger.error(`Cannot getOne on products service`, err)
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
}

module.exports = ProductService