const mongoose = require('mongoose')

const Schema = mongoose.Schema
const fieldSchema = new Schema({
  fieldName: String,
  value: [String]
})

//const field = mongoose.model('fields', fieldSchema)
module.exports = fieldSchema