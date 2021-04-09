const jwt = require("jsonwebtoken")

const secret = process.env.JWT_SECRET

const encode = (body) => {
  const token = jwt.sign(
    {
      user: body.id
    }, secret,
    {
      algorithm: 'HS256',
      issuer: `klink_${process.env.NODE_ENV}`,
      expiresIn: '7d'
    }
  )

  return token
}

const decode = (token, bearer = false) => {
  let TOKEN = ``

  if (bearer) {
    TOKEN = token.split('Bearer ')[1]
  } else {
    TOKEN = token
  }

  const data = jwt.decode(TOKEN)

  return data
}

const verify = (token, bearer = false) => {
  let TOKEN = ``

  if (bearer) {
    TOKEN = token.split('Bearer ')[1]
  } else {
    TOKEN = token
  }

  return jwt.verify(TOKEN, secret, {
    algorithm: 'HS256',
    issuer: `klink_${process.env.NODE_ENV}`,
    maxAge: '7d'
  }, (err, decoded) => {    
    if (err) {
      throw err
    }

    return {
      success: true,
      ...decoded
    }
  })
}

module.exports = {
  encode,
  decode,
  verify
}