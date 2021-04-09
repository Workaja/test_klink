const { Op } = require("sequelize")
const Logger = require("../../core/logger")
const { pagination } = require("../../utils/helpers")

const logger = new Logger()

class ItemsController {
  constructor (service) {
    this.service = service
  }

  static create (service) {
    return new ItemsController (service)
  }

  list = async (req, res, next) => {
    try {
      const { query: { keyword, sort, limit, page }} = req

      let condition = {}

      if (keyword) {
        condition = {
          where: {
            sku: {
              [Op.iLike]: `%${keyword}%`
            }
          }
        }
      }

      if (sort) {
        const sortable = []
        const sorts = sort.split(",")
        for (let i = 0; i < sorts.length; i++) {
          sortable.push(sorts[i].split(" "))
        }
        condition.order = sortable
      }

      condition.limit = limit || process.env.APP_PAGE_LIMIT
      
      const pages = parseInt(page || 1)

      condition.offset = (pages - 1 > 1 ?? 0) * parseInt(condition.limit)

      const response = await this.service.getAll(condition)

      
      res.json({
        data: response,
        pagination: pagination({ page: pages, count: response.count, limit: condition.limit })
      })
    } catch (err) {
      logger.error(`Item list failed, from try catch`, err)
      next(err)
    }
  }

  detail = async (req, res, next) => {
    try {
      const { params: { id } } = req

      const condition = {
        id
      }

      const response = await this.service.getOne(condition)

      if (response) res.json({
        data: response
      })

      res.status(400).json({
        message: 'Item not found'
      })
    } catch (err) {
      logger.error(`Item detail failed, from try catch`, err)
      next(err)
    }
  }

  create = async (req, res, next) => {
    try {
      const { body: { sku, stock_count } } = req

      const create = await this.service.createNewStock(sku, Number(stock_count))

      if (create) {
        logger.info(`Stock item create success, from service`)
        return res.json({
          data: create
        })
      }

      res.status(500).json({
        message: 'Stock item create failed'
      })
    } catch (err) {
      logger.error(`Stock item create failed, from try catch`, err)
      next(err)
    }
  }

  remove = async (req, res, next) => {
    try {
      const { params: { id }, query: { sku } } = req

      const condition = {}

      if (!sku) condition.id = id
      if (sku) condition.sku = sku

      const remove = await this.service.removeOne(condition)

      if (remove) {
        logger.info(`Item remove success, from service`)
        return res.json({
          message: 'Item removed',
          sku: sku ? true : false
        })
      }

      res.status(500).json({
        message: 'Item remove failed'
      })
    } catch (err) {
      logger.error(`Item remove failed, from try catch`, err)
      next(err)
    }
  }
}

module.exports = ItemsController