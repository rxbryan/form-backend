const db = require('./libs/db')

exports.notFound = (req, res) => {
  console.log(req.headers)
  res.status('404').send('404 not found')
}

/* eslint-disable no-unused-vars */
exports.serverError = (err, req, res, next) => {
  console.error(err.message)
  res.status('500').send('server error')
}
/* eslint-enable no-unused-vars */