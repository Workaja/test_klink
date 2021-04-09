const Redis = require("ioredis")

const connectRedis = new Redis({
  host: process.env.APP_REDIS_HOST,
  port: process.env.APP_REDIS_PORT,
  password: process.env.APP_REDIS_PASS,
  family: process.env.APP_REDIS_FAMILY || 4,
  db: process.env.APP_REDIS_DB || 0
})

module.exports = {
  connectRedis
}