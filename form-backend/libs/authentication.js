const bcrypt = require('bcrypt')
const User = require('../models/User')
const multiparty = require('multiparty')
const Form = require('../models/Form')
const utils = require('./util')

exports.getUserIdByEmail =  async (req, res) => {

  let user = await User.find({email: req.body.email}).catch(err => {
    console.log(err)
    res.send('email address not valid') //should redirect to signup page
  })
  if (user.length > 0) {
    console.log(user[0])
    bcrypt.compare(req.body.password, user[0].password).then(() => {
      //req.userId = user.userId
      console.log(user[0].userId)
      let token = utils.createJWS({userId: user[0].userId, date: new Date().getTime()})
      res.json({"message": "success", "accessToken": token})
    }).catch( err => {
      console.log(err)
      res.send('password not correct')
    })
  } else {
    res.send('email address not found')
  }
}

exports.authenticateJWS = async (req, res, next) => {
  let jwt = (req.body) ? req.body.token : req.headers['JWT']

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
    req.userId = form.userId
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