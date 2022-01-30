const mongoose = require('mongoose')
const fileSchema = require('./File')
const fieldSchema = require('./Field')
const utils = require('../libs/util')

const env = process.env.NODE_ENV || 'development'
const {STORE_LOCATION} = require(`../.credentials.${env}`)

const Schema = mongoose.Schema

const formDataSchema = new Schema ({
  userId: {
    type: String,
    required: [true, 'User.js: need\'s a user ID']
  },
  formId: {
    type: String,
    required: [true, 'User.js: need\'s a user ID']
  },
  fields: [fieldSchema],
  files: [fileSchema],
  dateSubmitted: {
    type: Date,
    default: new Date()
  }
})


fileSchema.pre('save', async function (next) {
  //debug
  console.log(this.filePath)
  if (STORE_LOCATION === 'S3') {
    //store in S3
  }
  next()
})

module.exports = mongoose.model('FormData', formDataSchema)
