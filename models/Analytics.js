const mongoose = require('mongoose')

const Schema = mongoose.Schema
const analyticsSchema = new Schema ({
  clientip: String,
  date: {
    type: Date,
    default: new Date()
  },
  url: String,
  token: String,
  formid: String,
  referer: String, //referer address
  origin: String, //cors control header
  requestIntent: String,
  statusCode: String,
  userAgent: String
})

module.exports = mongoose.model('Analytics', analyticsSchema)