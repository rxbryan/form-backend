const fs = require('fs')
const pathUtils = require('path')
const multiparty = require('multiparty')
const db = require('./db')

const env = process.env.NODE_ENV || 'development'
const STORE = process.env.STORE || require(`../.credentials.${env}`).STORE_LOCATION

if (!STORE) {
  console.log('STORE var undefined')
  process.exit(1)
}

const storeDir = pathUtils.join(process.cwd(), 'uploads')
if (!fs.existsSync(storeDir)) fs.mkdirSync(storeDir)

const MULTIPART_CONTENT_TYPE_REGEX = /\bmultipart\/form-data/

module.exports = async (req, res, next) => {

  if (!MULTIPART_CONTENT_TYPE_REGEX.test(req.headers['content-type'])){
    console.log('content-type not multipart/form-data')
    return next()
  }

  let options = (STORE === 'S3') ? {} : {uploadDir: storeDir}
  let form = new multiparty.Form(options)
  form.on('error', err => {
      console.log('error parsing form ' + err.stack)
    })

  form.on('close', () => {
      console.log('upload completed')
  })

  const parseForm = () => {
    return new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject (err)
        else resolve ({fields, files})
      })
    })
  }

  parseForm().then(({fields, files}) => {
    db.storeFormData(req.form.formId, fields, files)
      .then(() => {
        return res.redirect(req.form.redirectSuccess)
      }).catch(err => {
        console.log(err) 
        return res.redirect(req.form.redirectFailure) //redirect to failure page
      })
  }).catch(err => {
    console.log(err)
    return res.redirect(req.form.redirectFailure)
  })
 
}