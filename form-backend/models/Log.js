const mongoose = require('mongoose')

const Schema = mongoose.Schema
const logSchema = new Schema({
  clientAddress: String,
  date: {
    type: Date,
    default: new Date()
  },
  method: String,
  url: String,
  statusCode: String,
  httpVersion: String,
  referer: String,
  userAgent: String,
  responseTime: String,
  totaltime: String
})

module.exports = mongoose.model('Logs', logSchema)