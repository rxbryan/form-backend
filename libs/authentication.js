const Form = require('../models/Form')
const utils = require('./util')
const createError = require('./error')

exports.authenticateJWS = async (req, res, next) => {
  const jws = req.headers['jwt'] || req.body && req.body.token || undefined
  if (jws) {
    if (!utils.verifyJWS(jws)) {
      let error = {
        message: 'request could not be authenticated'
      }
      return res.status('400').json(error)
    }
    req.JWT = jws
    next()
  } else {
    let error = {
      message: 'request does not contain any authencation'
    }
    return res.status('400').json(error)
  }
}

exports.authenticateFormid = async (req, res, next) => {
  const authError = new createError()
  let formId = req.params.formId || req.query.formId || undefined
  let form = await Form.findOne({'formId': formId}).catch(err => console.log(err))
  console.log('form: '+form)
  if(!form) {
    console.log('formId not found in db')
    return res.status('401').json(authError.formIdError())
    //heroku router throws a code=H18 error when we close the connection without fully reading the request body 
  }
  req.form = {
    formId: form.formId,
    status: form.status,
    fileUpload: form.fileUpload,
    redirectFailure: form.redirectUrl.failure,
    redirectSuccess: form.redirectUrl.success
  }
  req.formId = form.formId
  req.redirectFailure = form.redirectUrl.failure
  req.redirectSuccess = form.redirectUrl.success

  next()
}
