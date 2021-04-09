require("dotenv").config()

const express = require("express")

const authRest = require("./routes/auth")
const generalRest = require("./routes/rest")
const Logger = require("./core/logger")
const { logo, arrowSeparator } = require("./utils/helpers")

const { models } = require("./core/database.model")

const AuthController = require("./domains/authenticate/controller")
const AuthService = require("./domains/authenticate/service")
const AuthRepository = require("./domains/authenticate/repository")

const ProductController = require("./domains/products/controller")
const ProductService = require("./domains/products/service")
const ProductRepository = require("./domains/products/repository")

const ItemsController = require("./domains/items/controller")
const ItemsService = require("./domains/items/service")
const ItemsRepository = require("./domains/items/repository")

const OrdersController = require("./domains/order/controller")
const OrdersService = require("./domains/order/service")
const OrdersRepository = require("./domains/order/repository")

const authRepository = AuthRepository.create(models.UserModel, models.OrdersModel)
const authService = AuthService.create(authRepository)
const authController = AuthController.create(authService)

const productRepository = ProductRepository.create(models.ProductModel, models.ItemsModel)
const productService = ProductService.create(productRepository)
const productController = ProductController.create(productService)

const itemsRepository = ItemsRepository.create(models.ItemsModel, models.ProductModel)
const itemsService = ItemsService.create(itemsRepository)
const itemsController = ItemsController.create(itemsService)

const ordersRepository = OrdersRepository.create(models.OrdersModel, models.ItemsModel, models.ProductModel)
const ordersService = OrdersService.create(ordersRepository)
const ordersController = OrdersController.create(ordersService)

const server = express()
const logger = new Logger()

server.use(express.json())

/**
 * Middleware here
 */

/**
 * Routing here
 */
server.use("/auth", authRest({ authController }))
server.use("/rest", generalRest({ productController, itemsController, ordersController }))

/**
 * Init the KLINK server with express
 */
server.listen(process.env.NODE_PORT, () => {
  logger.tx(arrowSeparator('l'))
  logger.tx(`This express is using port ${process.env.NODE_PORT}`)
  logger.tx(`${logo()} server is initialized!`)
  logger.tx(arrowSeparator('r'))
})