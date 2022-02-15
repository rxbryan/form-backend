const Form = require('../models/Form')
const utils = require('./util')
const createError = require('./error')

const authError = new createError()

exports.authenticateJWS = async (req, res, next) => {
  const jws = req.headers['jwt'] || req.body && req.body.token || undefined
  if (jws) {
    if (!utils.verifyJWS(jws)) {
      console.log('request does not contain any authentication')
      return res.status('403').json(authError.authenticationError())
    }
    req.JWT = jws
    next()
  } else {
    return res.status('403').json(authError.authenticationError({target: 'NoAUTH'}))
  }
}

exports.authenticateFormid = async (req, res, next) => {
  let formId = req.params.formId || req.query.formId || undefined
  let form = await Form.findOne({'formId': formId}).catch(err => console.log(err))
  if(!form) {
    console.log('formId not found in db')
    return res.status('401').json(authError.formIdError())
    //heroku router throws a code=H18 error when we close the connection
    //without completely reading the request body. This is not much we can do about 
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
