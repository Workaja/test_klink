const { uuid } = require("uuidv4")
const Logger = require("../../core/logger")

const logger = new Logger()

class ItemsService {
  constructor (repository) {
    this.repository = repository
  }

  static create (repository) {
    return new ItemsService (repository)
  }

  getOne = async condition => {
    try {
      return await this.repository.getOne(condition)
    } catch (err) {
      logger.error(`Cannot getOne on items service`, err)
      throw err
    }
  }

  getAll = async condition => {
    try {
      return await this.repository.getAll(condition)
    } catch (err) {
      logger.error(`Cannot getAll on items service`, err)
      throw err
    }
  }

  storeOne = async fields => {
    try {
      return await this.repository.storeOne(fields)
    } catch (err) {
      logger.error(`Cannot storeOne on items service`, err)
      throw err
    }
  }

  getOrStoreOne = async (condition, fields) => {
    try {
      return await this.repository.getOrStoreOne(condition, fields)
    } catch (err) {
      logger.error(`Cannot getOrStoreOne on items service`, err)
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
      logger.error(`Cannot updateOne on items service`, err)
      throw err
    }
  }

  removeOne = async condition => {
    try {
      return await this.repository.removeOne(condition)
    } catch (err) {
      logger.error(`Cannot removeOne on items service`, err)
      throw err
    }
  }

  createNewStock = async (sku, stock_count = 1) => {
    try {
      const input = []
      for (let s = 0; s < stock_count; s++) {
        const params = {
          sku,
          entity_id: uuid()
        }

        input.push(params)
      }

      const checkProduct = await this.repository.getOneProduct({ sku })

      if (!checkProduct) return false

      const bulk = await this.repository.bulkCreate(input)

      if (bulk) {
        return {
          sku,
          stock_created: input.length
        }
      } else {
        return false
      }
    } catch (err) {
      logger.error(`Cannot bulk createNewStock on items service`, err)
      throw err
    }
  }
}

module.exports = ItemsService