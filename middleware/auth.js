const { UnauthenticatedError } = require("../error")
const jwt = require('jsonwebtoken')
const authenticationMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization

  if(!authHeader || !authHeader.startsWith('Bearer ')){
    throw new UnauthenticatedError("No token provided")
  }

  const token = authHeader.split(' ')[1]

  try{
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const {userId, name} = decoded

    req.user = {userId, name}
    next()
  }catch(err){
    throw new UnauthenticatedError('Not authorized to access this route')
  }
}

module.exports = authenticationMiddleware