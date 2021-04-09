const Logger = require("../../core/logger")

const logger = new Logger()

class AuthService {
  constructor (repository) {
    this.repository = repository
  }

  static create (repository) {
    return new AuthService (repository)
  }

  getOne = async condition => {
    try {
      return await this.repository.getOne(condition)
    } catch (err) {
      logger.error(`Cannot getOne on auth service`, err)
      throw err
    }
  }

  getOneWithTransaction = async condition => {
    try {
      return await this.repository.getOneWithTransaction(condition)
    } catch (err) {
      logger.error(`Cannot getOne on auth service`, err)
      throw err
    }
  }

  storeOne = async fields => {
    try {
      return await this.repository.storeOne(fields)
    } catch (err) {
      logger.error(`Cannot storeOne on auth service`, err)
      throw err
    }
  }

  getOrStoreOne = async (condition, fields) => {
    try {
      return await this.repository.getOrStoreOne(condition, fields)
    } catch (err) {
      logger.error(`Cannot getOrStoreOne on auth service`, err)
      throw err
    }
  }
}

module.exports = AuthService