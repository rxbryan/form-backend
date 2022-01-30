const env = process.env.NODE_ENV || 'development'
const utils = require('../libs/util')

const csurf = require('csrf')()
const {CSRF_SECRET} = require(`../.credentials.${env}`) 

module.exports = (req, res, next) => {
	if (!csurf.verify(CSRF_SECRET, req.body.csrfToken)) {
		res.redirect('/404')
	}
  res.locals.inputError = Object.create(null)
  if (!utils.validateUserEmail(req.body.email)) {
    res.locals.inputError.email = 'email address is invalid'
  }
  if (!utils.validatePassword(req.body.password)) {
    res.locals.inputError.password = 'password must be more than eight characters'
  }
  if (Object.keys(res.locals.inputError).length > 0) {
    res.send(res.locals.inputError)
  }
  next()
}