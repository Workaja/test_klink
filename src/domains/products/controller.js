const { Op } = require("sequelize")
const Logger = require("../../core/logger")
const { pagination } = require("../../utils/helpers")

const logger = new Logger()

class ProductController {
  constructor (service) {
    this.service = service
  }

  static create (service) {
    return new ProductController (service)
  }

  list = async (req, res, next) => {
    try {
      const { query: { keyword, sort, limit, page }} = req

      let condition = {}

      if (keyword) {
        condition = {
          where: {
            [Op.or]: [
              {
                name: {
                  [Op.iLike]: `%${keyword}%`
                }
              },
              {
                sku: {
                  [Op.iLike]: `%${keyword}%`
                }
              }
            ]
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
      logger.error(`Product list failed, from try catch`, err)
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

      if (response.product) return res.json({
        data: {
          ...response.product.dataValues,
          stock_count: response.stock
        }
      })

      res.status(400).json({
        message: 'Order not found'
      })
    } catch (err) {
      logger.error(`Order detail failed, from try catch`, err)
      next(err)
    }
  }
}

module.exports = ProductController