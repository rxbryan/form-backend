const multiparty = require('multiparty')
const Form = require('../models/Form')
const utils = require('./util')

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
    res.status('400').json(error)
  }
}

exports.authenticateFormid = async (req, res, next) => {
  let formId = req.params.formId || req.query.formId
  console.log(req.query.formId)
  let form = await Form.findOne({'formId': formId}).catch(err => {res.redirect('/404')})
  if(form) {
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
  } else {
    return res.type('text/plain').status(404).send('404 not found') //error
  }
}
