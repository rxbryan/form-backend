const mongoose = require('mongoose')

const Schema = mongoose.Schema
const errorSchema = new Schema({
  clientAddress: String,
  date: {
    type: Date,
    default: new Date
  },
  method: String,
  url: String,
  statusCode: String,
  httpVersion: String,
  referer: String,
  userAgent: String,
  error: {
    code: String,
    event: String, //form submission, user registration/signin, stmp, database, file storage
    message: String
  }
})

module.exports = mongoose.model('Error', errorSchema)