const multiparty = require('multiparty')
const Form = require('../models/Form')
const utils = require('./util')

exports.authenticateJWS = async (req, res, next) => {
  let jwt = (req.body) ? req.body.token : req.headers['jwt']

  if (jwt) {
    if (!utils.verifyJWS(jwt)) {
      let error = {
        message: 'request could not be authenticated'
      }
      res.status('400').json(error)
    }
    req.JWT = jwt
    next()
  } else {
    let error = {
      message: 'request does not contain any authencation'
    }
    res.status('400').json(error)
  }
}

exports.authenticateFormid = async (req, res, next) => {
  let formId = req.params.formId
  let form = await Form.findOne({'formId': req.params.formId}).catch(err => {res.redirect('/404')})
  if(form) {
    req.formId = form.formId
    req.redirectFailure = form.redirectUrl.failure
    req.redirectSuccess = form.redirectUrl.success
    next()
  } else {
    res.type('text/plain').status(404).send('404 not found') //error
  }
}

exports.authenticateUserId = async (req, res, next) => {
  
}