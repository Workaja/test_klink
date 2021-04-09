const express = require("express")

const router = express.Router()

const validateAuth = require("../middlewares/validateAuth")
const auth = require("../middlewares/auth")

module.exports = ({
  authController
}) => {
  router.post("/login", [validateAuth], (req, res, next) => authController.login(req, res, next))
  router.post("/register", [validateAuth], (req, res, next) => authController.register(req, res, next))
  
  router.get("/profile", [auth], (req, res, next) => authController.profile(req, res, next))

  return router
}