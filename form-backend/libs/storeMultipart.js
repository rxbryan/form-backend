const fs = require('fs')
const pathUtils = require('path')
const multiparty = require('multiparty')
const db = require('./db')

const env = process.env.NODE_ENV || 'development'
const {STORE_LOCATION} = require(`../.credentials.${env}`)

const storeDir = pathUtils.join(process.cwd(), 'uploads')
if (!fs.existsSync(storeDir)) fs.mkdirSync(storeDir)

module.exports = async (req, res, next) => {
  if (!req.form.fileUpload && /\bmultipart\/form-data/.test(req.headers['content-type'])) {
    return res.status('400')
    .json({error: 'fileUpload set to false and content-type set to multipart/Form-data'})
  }
  if (!/\bmultipart\/form-data/.test(req.headers['content-type'])){ 
    next()
  } else {
    let options = (STORE_LOCATION === 'S3') ? {} : {uploadDir: storeDir}
    let form = new multiparty.Form(options)
    form.on('error', err => {
      //console.log('error parsing form ' + err.stack)
      //throw err
    })

    form.on('close', () => {
      console.log('upload completed')
    })

    const parseForm = () => {
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

    parseForm().then(formdata => {
      db.storeFormData(req.formId, formdata.fields, formdata.files)
      .then(() => {
        res.status('204').redirect(req.redirectSuccess)
      }).catch(err => {
        console.log(err) // todo log error
        res.redirect(303, req.redirectFailure) //to failure page
      })
    }).catch(err => {
        console.log(err) // todo log error
        res.redirect(303, req.redirectFailure)
      })
  }
}