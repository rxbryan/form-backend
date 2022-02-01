const mongoose = require('mongoose')
const User = require('../models/User')
const FormData = require('../models/Form-data')
const Form = require('../models/Form')
//const utils = require('./util')

const env = process.env.NODE_ENV || 'development' //to-do: remove this later

const {mongodb} = require(`../.credentials.${env}`)
console.log(mongodb.connectionString)
if (!mongodb.connectionString){
  console.error('MongoDB connection string missing')
  process.exit(1)
}

mongoose.connect(mongodb.connectionString, {useNewUrlParser: true})
const db = mongoose.connection 

db.on('error', err => {
  console.error('MongoDB error: ' + err.message)
  process.exit(1)
})

db.once('open', () => {
  console.log('MongoDB connection established')
})

exports.storeUser = async (fields) => {
  let temp = {
    name: {
      firstName: fields.firstName,
      lastName: fields.lastName
    },
    email: fields.email,
    businessName: fields.businessName,
    password: fields.password
  }

  const user = new User(temp)
  var status = await user.save().catch()
  if (status.errors) throw status
}

exports.storeFormData = async (userid, formId, fields, files) => {
  const formData = new FormData()
  formData.userId = userid
  formData.formId = formId

  Object.keys(fields).forEach( k => {
    formData.fields.push({fieldName: k, value: fields[k]})
  })

  if (files != undefined) {
    Object.keys(files).forEach( k => {
      files[k].forEach( (arr) => {
        if (arr.originalFilename) {
          formData.files.push({
            fieldName: arr.fieldName,
            originalFilename: arr.originalFilename,
            fileSizeInBytes: arr.size,
            filePath: arr.path,
            contentType: arr.headers['content-type']
          })
        } else {
          //do nothing
        }
      })
    })
  }

  var status = formData.save().catch()
  if (status.errors) throw status 
}


exports.storeForm = async (fields) => {
 const form = new Form(fields)
 var status = form.save().catch()
 if (status.errors) throw status 
}

exports.getUser

exports.getFormData = async (formId) => {
  const formData = await FormData.find({formId: formId}).catch(err => {
    console.log(err)
  })

  if (formData) {
    return formData
  } else {
    let error = {
      message: new Error ('no formdata found in database')
    }
    throw error
  }
}

exports.getAllForms = async () => {
  const forms = Form.find().catch(err => {
    console.log(err)
  })

  if (forms) {
    return forms
  } else {
    let error = {
      message: 'There are no forms available'
    }
    throw error
  }
}