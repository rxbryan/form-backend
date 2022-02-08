const mongoose = require('mongoose')
const FormData = require('../models/Form-data')
const Form = require('../models/Form')
//const utils = require('./util')

const env = process.env.NODE_ENV || 'development' //to-do: remove this later

try {
  var connectionString = process.env.MONGODB_CONNECT || require(`../.credentials.${env}`).mongodb.connectionString
} catch (err) {
  console.error('MongoDB connection string missing')
  process.exit(1)
}

if (!connectionString){
  console.error('MongoDB connection string missing')
  process.exit(1)
}

mongoose.connect(connectionString, {useNewUrlParser: true})
const db = mongoose.connection 

db.on('error', err => {
  console.error('MongoDB error: ' + err.message)
  process.exit(1)
})

db.once('open', () => {
  console.log('MongoDB connection established')
})

exports.deleteFormData = deleteFormData

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
 var status = await form.save().catch()
 if (status.errors) throw status 
}

exports.getFormData = async (query) => {
  const formData = await FormData.find({formId: query.formId}).catch(err => {
    console.log(err)
    return err
  })
  if (formData.message) throw formData
  if ((formData.length/query.limit) < query.page) throw {message: 'page parameter too big'}

  let data = []
  const startPos = (query.page--) * query.limit
  let matches = 0
  //debug
  console.log('query: ' + query)
  console.log('startPos: ' + startPos)

  for (let k in formData) {
    if ((formData[k].dateSubmitted.getTime() > query.from.getTime()) &&
     (formData[k].dateSubmitted < query.to.getTime())) {
      matches++
      if (matches > startPos) data.push(formData[k])
      if (data.length === query.limit) break
    }
  }
  console.log('matches: ' + matches)
  return data
}

exports.getAllForms = async () => {
  const forms = Form.find().catch(err => {
    console.log(err)
    //throw err //TO-DO: improve error handling
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
    //throw err
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

async function deleteFormData(formId, from, to) {
  const formData = await FormData.find({formId: formId}).catch(err => {
    console.log(err)
  }) 
  if (formData.length === 0) throw {message: 'FormData not found'}

  let startdate = (from) ? new Date(from).getTime() : 0
  let enddate = (to) ? new Date(to).getTime() : new Date().getTime()

  let count = 0
  for (let i in formData) {
    if ((formData[i].dateSubmitted.getTime() >= startdate) && (formData[i].dateSubmitted.getTime() <= enddate)) {
      await formData[i].remove().catch(err => {
        console.log(err)
      })//handle error
      count++
    }
  }
  return count
}

exports.deleteForm = async (formId) => {
  let ret = await deleteFormData(formId).catch(err => {
    console.log(err)
    return err
  }) 
  await Form.deleteOne({formId: formId}).catch(err => {
    console.log(err)
  })// error checking
}