const chalk = require("chalk")
const { DateTime } = require("luxon")

class Logger {
  info = (msg, obj) => {
    let message = chalk.cyan(msg)

    if (obj) return console.log(`[KLINK][INFO][${DateTime.now().toISO()}] ${message}`, obj)

    return console.log(`[KLINK][INFO][${DateTime.now().toISO()}] ${message}`)
  }

  error = (msg, obj) => {
    let message = chalk.red(msg)

    if (obj) return console.log(`[KLINK][ERROR][${DateTime.now().toISO()}] ${message}`, obj)

    return console.log(`[KLINK][ERROR][${DateTime.now().toISO()}] ${message}`)
  }

  tx = (msg) => {
    return console.log(`${msg}`)
  }
}

module.exports = Logger