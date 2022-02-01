const csurf = require('csrf')()
const db = require('./libs/db')

const env = process.env.NODE_ENV || 'development'
const {CSRF_SECRET} = require(`./.credentials.${env}`)

exports.notFound = (req, res) => {
  console.log(req.headers)
  res.status('404').send('not found')
}


// Express recognizes the error handler by way of its four
// arguments, so we have to disable ESLint's no-unused-vars rule
/* eslint-disable no-unused-vars */
exports.serverError = (err, req, res, next) => {
  console.error(err.message)
  res.status('500').send('server error')
}
/* eslint-enable no-unused-vars */