/* const {CustomAPIError} = require('../error') */
const {StatusCodes} = require('http-status-codes')

const ErrorHandlerMiddleware = async(err, req, res, next) => {
  console.log(err)
  const customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'Something went wrong. Try again later'
  }

  /* if(err instanceof CustomAPIError){
    return res.status(err.statusCode).json({msg: err.message})
  } */

  if(err.code && err.code === 11000){
    customError.msg = `Duplicate value entered for ${Object.keys(err.keyValue)} fields. Please enter another value`
    customError.statusCode = StatusCodes.BAD_REQUEST
  }

  if(err.name === 'ValidationError'){
    customError.msg = Object.values(err.errors).map(e => e.message).join(', ')
    customError.statusCode = StatusCodes.BAD_REQUEST
  }

  if(err.name === 'CastError'){
    customError.msg = `No item found with id: ${err.value}`
    customError.statusCode = StatusCodes.NOT_FOUND
  }
 /*  return res.status(customError.statusCode).json(err) */
  return res.status(customError.statusCode).json({msg: customError.msg})
}

module.exports = ErrorHandlerMiddleware