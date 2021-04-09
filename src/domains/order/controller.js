const { uuid } = require("uuidv4")
const { Op } = require("sequelize")
const { connectRedis } = require("../../core/database")
const Logger = require("../../core/logger")

const logger = new Logger()

class OrdersController {
  constructor (service) {
    this.service = service
  }

  static create (service) {
    return new OrdersController (service)
  }

  myCart = async (req, res, next) => {
    try {
      const { user: { id } } = req

      const key = `user:${id}:cart`

      connectRedis.get(key).then(async (val) => {
        const data = JSON.parse(val)

        if (!data || !data.items || data.items.length === 0) return res.json({
          message: 'No item on cart'
        })

        const skus = []
        const temp = []
        let grandTotal = 0
        for (let i = 0; i < data.items.length; i++) {
          temp.push(data.items[i])
          skus.push(data.items[i].sku)
        }

        const products = await this.service.getProducts({
          sku: {
            [Op.in]: skus
          }
        })

        if (products) {
          for (let i = 0; i < products.length; i++) {
            const price = products[i].price
            const skus = products[i].sku

            for (let x = 0; x < temp.length; x++) {
              if (temp[x].sku === skus) {
                temp[x].price = price
                temp[x].total_price = price * temp[x].total
                grandTotal += temp[x].total_price
              }
            }
          }

          return res.json({
            ...data,
            items: temp,
            grand_total: grandTotal
          })
        }
      }).catch(err => {
        logger.error('Unable to load my cart', err)
        next(err)
      })

    } catch (err) {
      logger.error(`My cart list failed, from try catch`, err)
      next(err)
    }
  }

  addToCart = async (req, res, next) => {
    try {
      const { user: { id }, body: { sku, total } } = req

      const totalItem = await this.service.totalAvailable({ sku })

      if (totalItem < total) {
        return res.status(500).json({
          message: `This item stock is not enough`
        })
      }

      const key = `user:${id}:cart`

      connectRedis.get(key).then(async val => {
        const data = val ? JSON.parse(val) : {
          items: []
        }

        const skus = []
        const temp = []
        for (let i = 0; i < data.items.length; i++) {
          if (data.items[i].sku === sku) {
            temp.push({
              ...data.items[i],
              total: data.items[i].total + total
            })
          } else {
            temp.push(data.items[i])
          }
          skus.push(data.items[i].sku)
        }

        if (!skus.includes(sku)) {
          temp.push({
            sku,
            total
          })
        }

        data.items = temp
        data.last_added_item = [{ sku, total }]

        const set = await connectRedis.set(key, JSON.stringify(data))

        if (set === "OK") return res.json(data)
      })
    } catch (err) {
      logger.error(`Add to cart failed, from try catch`, err)
      next(err)
    }
  }

  updateCart = async (req, res, next) => {
    try {
      const { user: { id }, body: { sku, total } } = req

      const totalItem = await this.service.totalAvailable({ sku })

      if (totalItem < total) {
        return res.status(500).json({
          message: `This item stock is not enough`
        })
      }

      const key = `user:${id}:cart`

      connectRedis.get(key).then(async val => {
        const data = val ? JSON.parse(val) : {
          items: []
        }

        const skus = []
        const temp = []
        for (let i = 0; i < data.items.length; i++) {
          if (data.items[i].sku === sku) {
            if (total > 0) {
              temp.push({
                ...data.items[i],
                total
              })
            }
          } else {
            temp.push(data.items[i])
          }
          skus.push(data.items[i].sku)
        }

        data.items = temp

        const set = await connectRedis.set(key, JSON.stringify(data))

        if (set === "OK") return res.json(data)
      })
    } catch (err) {
      logger.error(`Update cart failed, from try catch`, err)
      next(err)
    }
  }

  removeFromCart = async (req, res, next) => {
    try {
      const { user: { id }, body: { sku } } = req

      const key = `user:${id}:cart`

      connectRedis.get(key).then(async val => {
        const data = val ? JSON.parse(val) : {
          items: []
        }

        const temp = []
        for (let i = 0; i < data.items.length; i++) {
          if (data.items[i].sku !== sku) {
            temp.push({
              ...data.items[i],
              total
            })
          }
        }

        data.items = temp

        const set = await connectRedis.set(key, JSON.stringify(data))

        if (set === "OK") return res.json(data)
      })
    } catch (err) {
      logger.error(`Remove from cart failed, from try catch`, err)
      next(err)
    }
  }

  checkOut = async (req, res, next) => {
    try {
      const { user: { id }, body: { payment_code } } = req

      const paymentStrategy = await this.service.getPaymentStrategy(payment_code)

      if (!paymentStrategy) return res.status(500).json({
        message: 'Invalid request of payment type code'
      })

      // load data from cart
      const key = `user:${id}:cart`

      connectRedis.get(key).then(async val => {
        const data = JSON.parse(val)

        if (!data || !data.items || data.items.length === 0) return res.json({
          message: 'No item on cart'
        })

        const skus = []
        const temp = []
        let grandTotal = 0
        for (let i = 0; i < data.items.length; i++) {
          temp.push(data.items[i])
          skus.push(data.items[i].sku)
        }

        const products = await this.service.getProducts({
          sku: {
            [Op.in]: skus
          }
        })

        if (products) {
          for (let i = 0; i < products.length; i++) {
            const price = products[i].price
            const skus = products[i].sku

            for (let x = 0; x < temp.length; x++) {
              if (temp[x].sku === skus) {
                temp[x].price = price
                temp[x].total_price = price * temp[x].total
                grandTotal += temp[x].total_price
              }
            }
          }

          const params = {
            user_id: id,
            items: temp,
            is_paid: false,
            payment_record: {
              strategy: paymentStrategy,
              final_price: grandTotal + Number(paymentStrategy.fee),
              tax10p: Math.ceil(0.10 * Number(grandTotal + paymentStrategy.fee)),
              grand_total: grandTotal + Number(paymentStrategy.fee) + Math.ceil(0.10 * Number(grandTotal + paymentStrategy.fee)),
              payment_id: uuid()
            }
          }

          const order = await this.service.order(params)

          if (order) {
            await connectRedis.del(key)

            return res.json(order)
          }
        }
      })

      // create order
      // all item on redis will be put on order table
    } catch (err) {
      logger.error(`Failed to make order`, err)
      next(err)
    }
  }

  checkOrder = async (req, res, next) => {
    try {
      const { params: { id } } = req

      const order = await this.service.getOneOrder({ id })

      return res.json(order)
    } catch (err) {
      logger.error('Failed to get order', err)
      next(err)
    }
  }

  paymentCallback = async (req, res, next) => {
    try {
      const { body: { payment_id, status } } = req

      // simulate the callback from payment aggr/gate
      const callback = await this.service.paymentCallback(payment_id, status)

      return res.json(callback)
    } catch (err) {
      logger.error(`Failed to use payment callback`, err)
      next(err)
    }
  }
}

module.exports = OrdersController