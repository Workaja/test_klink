const _ = require("lodash")
const isEmail = require("isemail")

const validateAuth = (req, res, next) => {
  const status = []
  if (_.isEmpty(req.body.email)) {
    status.push({ field: 'email', message: 'email is required' })
  } else
  if (!isEmail.validate(req.body.email || ``)) status.push({ field: 'email', message: 'please provide correct email' })
  
  if (_.isEmpty(req.body.password)) {
    status.push({ field: 'email', message: 'password is required' })
  } else
  if (req.body.password.length < 8) {
    status.push({ field: 'password', message: 'password is minimum 8 characters' })
  } else
  if (req.body.password.length > 16) status.push({ field: 'password', message: 'password is maximum 16 characters' })

  if (status.length > 0) res.status(400).json({
    message: 'error',
    fields: status
  })

  next()
}

module.exports = validateAuth