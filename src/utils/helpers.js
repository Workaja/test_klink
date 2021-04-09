const chalk = require("chalk")

const logo = () => {
  const opener = chalk.yellow("[")
  const closer = chalk.yellow("]")
  const theK = chalk.green("K")
  const theLink = chalk.redBright("LINK")

  return `${opener}${theK}${theLink}${closer}`
}

const arrowSeparator = to => {
  let bar = `----------------------------------------`
  if (to === 'r') bar = `>>>${bar}D>`
  if (to === 'l') bar = `<Q${bar}<<<`

  return chalk.blackBright(bar)
}

const pagination = query => {
  const { page, count, limit } = query
  return {
    page: page,
    next: count > (page * limit) ? page + 1 : false,
    prev: page > 1 ? page - 1 : false,
    max_page: Math.ceil(count / limit)
  }
}

module.exports = {
  logo,
  arrowSeparator,
  pagination
}