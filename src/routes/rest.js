const express = require("express")

const router = express.Router()

const auth = require("../middlewares/auth")

const { validateProduct, validateProductId } = require("../middlewares/validateProduct")

module.exports = ({
  productController,
  itemsController,
  ordersController
}) => {
  router.get("/products", [auth], (req, res, next) => productController.list(req, res, next))
  router.get("/products/:id", [auth], (req, res, next) => productController.detail(req, res, next))
  router.post("/products", [validateProduct, auth], (req, res, next) => productController.create(req, res, next))
  router.put("/products", [validateProduct, auth], (req, res, next) => productController.update(req, res, next))
  router.delete("/products/:id", [validateProductId, auth], (req, res, next) => productController.remove(req, res, next))

  router.get("/item-stock", [auth], (req, res, next) => itemsController.list(req, res, next))
  router.get("/item-stock/:id", [auth], (req, res, next) => itemsController.detail(req, res, next))
  router.post("/item-stock", [auth], (req, res, next) => itemsController.create(req, res, next))
  router.delete("/item-stock/:id", [auth], (req, res, next) => itemsController.remove(req, res, next))

  router.get("/cart", [auth], (req, res, next) => ordersController.myCart(req, res, next))
  router.put("/cart", [auth], (req, res, next) => ordersController.addToCart(req, res, next))
  router.patch("/cart", [auth], (req, res, next) => ordersController.updateCart(req, res, next))
  router.delete("/cart", [auth], (req, res, next) => ordersController.removeFromCart(req, res, next))
  router.post("/cart/checkout", [auth], (req, res, next) => ordersController.checkOut(req, res, next))

  router.get("/order/:id", [auth], (req, res, next) => ordersController.checkOrder(req, res, next))

  router.post("/order/hook", (req, res, next) => ordersController.paymentCallback(req, res, next))

  return router
}