const Job = require('../models/Job')
const {StatusCodes} = require('http-status-codes')
const { NotFoundError, BadRequestError } = require('../error')

const getAllJobs = async (req, res) => {
  const jobs = await Job.find({createdBy: req.user.userId}).sort()
  res.status(StatusCodes.OK).json(jobs)
}

const getJob = async (req,res) => {
  const {userId} = req.user
  const {id: jobId} = req.params
  
  const job = await Job.findOne({
    _id: jobId,
    createdBy: userId
  })

  if(!job){
    throw new NotFoundError(`No job with an id of ${jobId}`)
  }

  res.status(StatusCodes.OK).json(job)
}

const createJob = async(req, res) => {
  req.body.createdBy = req.user.userId
  const job = await Job.create(req.body)
  res.status(StatusCodes.CREATED).json(job)
}

const updateJob = async(req, res) => {
  const {
    user: {userId},
    params: {id: jobId},
    body: {company, position}
  } = req

  if(company === "" || position === ""){
    throw new BadRequestError('Company and position cannot be an empty value ')
  }

  const job = await Job.findOneAndUpdate(
    {_id: jobId, createdBy: userId}, 
    {company, position},
    {new: true, runValidators: true}
    )

  if(!job){
    throw new NotFoundError(`No job with an id of ${jobId}`)
  }

  res.status(StatusCodes.OK).json(job)
}

const deleteJob = async(req, res) => {
  const {
    user: {userId},
    params: {id: jobId}
  } = req
  
  const job = await Job.findOneAndDelete({_id: jobId, createdBy: userId}, {new: true})

  res.status(StatusCodes.OK).json(job)
}

module.exports = {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob
}