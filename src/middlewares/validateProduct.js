const _ = require("lodash")

const validateProduct = (req, res, next) => {
  const status = []
  if (_.isEmpty(req.body.sku)) {
    status.push({ field: 'sku', message: 'sku is required' })
  }
  
  if (_.isEmpty(req.body.name)) {
    status.push({ field: 'name', message: 'name is required' })
  }

  if (!req.body.price) {
    status.push({ field: 'price', message: 'price is required' })
  }

  if (status.length > 0) res.status(400).json({
    message: 'error',
    fields: status
  })

  next()
}

const validateProductId = (req, res, next) => {
  const status = []
  if (_.isEmpty(req.params.id)) {
    status.push({ field: 'id', message: 'product id is required' })
  }
  
  if (status.length > 0) res.status(400).json({
    message: 'error',
    fields: status
  })

  next()
}

module.exports = {
  validateProduct,
  validateProductId
}