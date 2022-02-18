const Form = require('../models/Form')
const utils = require('./util')
const authError = require('./error')()

exports.authenticateJWS = (req, res, next) => {
  const JWS = req.headers['jwt'] || req.body && req.body.access_token || undefined
  let options = JWS ? {} : {target: 'NoAUTH'}

  if (!utils.verifyJWS(JWS)) {
    console.log('request does not contain any authentication')
    return res.status('403').json(authError.authenticationError(options))
  }

  if (req.body) delete req.body.access_token
  req.JWT = JWS
  next()
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
  next()
}
