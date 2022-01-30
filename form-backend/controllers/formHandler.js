const multiparty = require('multiparty')
const db =  require('../libs/db')
const fs = require('fs')
const pathUtils = require('path')


const env = process.env.NODE_ENV || 'development'
const {STORE_LOCATION} = require(`../.credentials.${env}`)

const storeDir = pathUtils.join(process.cwd(), 'uploads')
if (!fs.existsSync(storeDir)) fs.mkdirSync(storeDir)

module.exports.formHandler = async (req, res, next) => {
  let options = (STORE_LOCATION === 'S3') ? {} : {uploadDir: storeDir}
  let form = new multiparty.Form(options)
  form.on('error', err => {
    console.log('error parsing form ' + err.stack)
  })

  form.on('close', () => {
    console.log('upload completed')
  })

  const parseForm = async () => {
    return new Promise((resolve, reject) => {
          form.parse(req, (err, fields, files) => {
            if (err) {
              reject (err)
            }
            else {
              resolve ({fields: fields, files: files})
            }
          })
        })
  }

  let formData = await parseForm.catch(err => {
    console.log(err) // todo log error
    res.redirect(303, req.redirectFailure) //to failure page
  })

  db.storeFormData(formData.fields, formData.files, req.userId, req.formId).catch(err => {
    console.log(err)
    res.redirect(303, req.redirectFailure)
  })
} 