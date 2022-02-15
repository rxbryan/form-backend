const mongoose = require('mongoose')
const fileSchema = require('./File')
const fieldSchema = require('./Field')
const utils = require('../libs/util')


const Schema = mongoose.Schema

const formDataSchema = new Schema ({
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

module.exports = mongoose.model('FormData', formDataSchema)
