class ProductRepository {
  constructor (model, model_item) {
    this.model = model
    this.model_item = model_item
  }

  static create (model, model_item) {
    return new ProductRepository (model, model_item)
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
}

module.exports = ProductRepository