const bcrypt = require("bcrypt")
const { condition } = require("sequelize")
const { encode } = require("../../core/jwt")
const Logger = require("../../core/logger")

const logger = new Logger()

class AuthController {
  constructor (service) {
    this.service = service
  }

  static create (service) {
    return new AuthController (service)
  }

  login = async (req, res, next) => {
    try {
      const { body: { email, password } } = req

      const condition = { email }

      const checkLogin = await this.service.getOne(condition)

      if (checkLogin) {
        const checkPassword = bcrypt.compareSync(password, checkLogin.password)

        if (checkPassword) {
          const jwtEncode = encode(checkLogin);

          logger.info(`Auth success, from service`)
          return res.json({
            token: jwtEncode,
            message: `Auth success`
          })
        }
        
        logger.error(`Auth failed, invalid password`)
        return res.status(402).json({
          message: 'Invalid password'
        })
      }

      logger.error(`Auth failed, from service`)
      return res.status(500).json({
        message: 'Auth failed'
      })
    } catch (err) {
      logger.error(`Auth failed, from try catch`, err)
      next(err)
    }
  }

  register = async (req, res, next) => {
    try {
      const { body: { email, password } } = req

      const condition = {
        email
      }

      const fields = {
        email,
        password: bcrypt.hashSync(password, 10)
      }

      const [lookup, doRegister] = await this.service.getOrStoreOne(condition, fields)

      if (doRegister) {
        logger.info(`Register success, from service`)
        
        const jwtEncode = encode(lookup);

        logger.info(`Register success, from service`)
        return res.json({
          token: jwtEncode,
          message: `Register success`
        })
      }

      if (lookup) {
        logger.info(`Email already registered`)
        return res.status(400).json({
          message: `Email already registered`
        })
      }

      logger.error(`Register failed, from service`)
      return res.status(500).json({
        message: 'Register failed'
      })
    } catch (err) {
      logger.error(`Register failed, from try catch`, err)
      next(err)
    }
  }

  profile = async (req, res, next) => {
    try {
      const { user: { id } } = req

      const data =  await this.service.getOneWithTransaction({ id })

      return res.json({
        profile: data.profile,
        transaction: data.transaction
      })
    } catch (err) {
      logger.error('Failed to get profile. from try catch', err)
      next(err)
    }
  }
}

module.exports = AuthController