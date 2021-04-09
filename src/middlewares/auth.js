const { decode } = require("../core/jwt")

const auth = async (req, res, next) => {

  if (req.headers.authorization) {
    const jwt = decode(req.headers.authorization, true)
    
    if (jwt) {
      req.user = {
        id: jwt.user
      }
  
      return next()
    }

    return res.status(400).json({
      message: 'Please login'
    })
  }
  return res.status(500).json({
    message: 'Invalid credential'
  })
}

module.exports = auth