const csurf = require('csrf')()

const env = process.env.NODE_ENV || 'development'
const {CSRF_SECRET} = require(`./.credentials.${env}`)

exports.login = async (req, res) => {
  res.locals.csrfToken = await csurf.create(CSRF_SECRET)
  res.render('login', {layout: null})
}
 
exports.signup = async (req, res) => {
  res.locals.csrfToken = await csurf.create(CSRF_SECRET)
  res.render('signup', {layout: null})
}

exports.notFound = (req, res) => {
  res.render('404')
}


// Express recognizes the error handler by way of its four
// arguments, so we have to disable ESLint's no-unused-vars rule
/* eslint-disable no-unused-vars */
exports.serverError = (err, req, res, next) => {
  console.error(err.message)
  res.render('500')
}
/* eslint-enable no-unused-vars */