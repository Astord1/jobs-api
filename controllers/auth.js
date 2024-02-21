const User = require('../models/user.js')

const {StatusCodes} = require('http-status-codes')
const bcrypt = require('bcryptjs')
const {BadRequestError, UnauthenticatedError} = require('../error')

const login = async (req, res) => {
  const {email, password} = req.body
  if(!email || !password){
    throw BadRequestError('Please provide email or password')
  }
  const user = await User.findOne({email: email})

  if(!user){
    throw UnauthenticatedError('Invalid credentials')
  }

  const isPasswordCorrect = await user.comparePassword(password)
  if(!isPasswordCorrect){
    throw new UnauthenticatedError('Invalid credentials')
  }
  const token = user.createJWT()
  res.status(StatusCodes.OK).json({user:{name: user.name}, token})
}

const register = async (req, res) => {
  const user = await User.create({...req.body})
  const token = user.createJWT()

  res.status(StatusCodes.CREATED).json({user: {name: user.name}, token})
}

module.exports = {
  login,
  register
}