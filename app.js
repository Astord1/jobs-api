const express = require('express')
const app = express()

require('dotenv').config()
require('express-async-errors')

const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss')
const rateLimit = require('express-rate-limit')

const notFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')
const authenticationMiddleware = require('./middleware/auth')

const authRouter = require('./routes/auth')
const jobsRouter = require('./routes/jobs')

const connectDB = require('./db/connect')

app.use(helmet())
app.use(cors())
/* app.use(xss())  <-- I don't know how to use it */
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100
}))
app.use(express.json())

app.use('/api/v1/auth/', authRouter)
app.use('/api/v1/jobs/', authenticationMiddleware, jobsRouter)

app.use(errorHandlerMiddleware)
app.use(notFoundMiddleware)

app.get('/', async(req, res) => {
  res.json({msg: 'success'})
})

const port = process.env.port || 3000

const start = async() => {
  try{
    await connectDB(process.env.MONGO_URI)
    app.listen(port, (req, res) => {
      console.log(`Server is running on port ${port}`)
    })
  }catch(err){
    throw err
  }
}

start()