const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const utils = require('../libs/util')

const Schema = mongoose.Schema
const formSchema = new Schema({
  userId:{
    type: String,
    required: [true, 'Form.js: need\'s a user ID']
  },
  formId: {
    type: String,
    required: [true, 'Form.js: need\'s a form ID'],
    unique: [true, 'Form.js: formId not unique']
  },
  hostname: [String],
  redirectUrl: {
    success: String,
    failure: String
  },
  fileUpload: Boolean,
  status: {
    type: String,
    enum: ['enabled', 'disabled', 'deleted'],
    default: 'enabled'
  },
  storageUsed: Number,
  totalSubmits: {
    type: Number,
    default: 0
  },
  created: {
    type: Date,
    default: new Date()
  }
})


formSchema.plugin(uniqueValidator)
module.exports = mongoose.model('Form', formSchema)
