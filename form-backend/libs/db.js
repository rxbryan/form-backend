const mongoose = require('mongoose')
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

exports.storeFormData = async (formId, fields, files) => {
  const formData = new FormData()
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

  var status = await formData.save().catch()
  if (status.errors) throw status 
}


exports.storeForm = async (fields) => {
 const form = new Form(fields)
 var status = form.save().catch()
 if (status.errors) throw status 
}

exports.getFormData = async (formId) => {
  const formData = await FormData.find({formId: formId}).catch(err => {
    console.log(err)
    throw err
  })

  if (formData) {
    return formData
  } else {
    let error = {
      message: 'no formdata found in database'
    }
    throw error
  }
}

exports.getAllForms = async () => {
  const forms = Form.find().catch(err => {
    console.log(err)
    throw err //TO-DO: improve error handling
  })

  if (forms) {
    return forms
  } else {
    throw {error: 'No forms found in database'}
  }
}

exports.updateForm = async (formId, data) => {
  const form = await Form.findOne({formId: formId}).catch(err => {
    console.log(err)
    throw err
  })
  
  if (!form) throw 'Form not found'

  Object.keys(data).forEach(key => {
    if (key === 'redirectSuccess') {
      form.redirectUrl.success = data[key]
    } else if (key === 'redirectFailure') {
      form.redirectUrl.failure = data[key]
    } else {
    form[key] = data[key]
    }
  })
  let status = await form.save().catch()
  if (status.errors) throw status
}