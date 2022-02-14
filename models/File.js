const mongoose = require('mongoose')

const Schema = mongoose.Schema
const fileSchema = new Schema ({
  fieldName: String,
  originalFilename: String,
  fileSizeInBytes: Number,
  fileUrl: String,
  filePath: String,
  contentType: String,
  sha512:String, 
  MD5: String
})

//To-do: Implement sha/md5 hashing to prevent storing duplicete files

//const fileDocument =  mongoose.model('fileDocument', fileSchema)
module.exports = fileSchema