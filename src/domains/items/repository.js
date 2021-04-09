class ItemsRepository {
  constructor (model, model_product) {
    this.model = model
    this.model_product = model_product
  }

  static create (model, model_product) {
    return new ItemsRepository (model, model_product)
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

  getOneProduct = async condition => {
    try {
      return await this.model_product.findOne({
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
      return await this.model.destroy({
        where: condition
      })
    } catch (err) {
      throw err
    }
  }

  bulkCreate = async input => {
    try {
      return await this.model.bulkCreate(input)
    } catch (err) {
      throw err
    }
  }
}

module.exports = ItemsRepository