exports.notFound = (req, res) => {
  console.log(req.headers)
  res.status('404').json({message: '404 not found'})
}

/* eslint-disable no-unused-vars */
exports.serverError = (err, req, res, next) => {
  console.error(err)
  res.status('500').json({message: 'server error'})
}
/* eslint-enable no-unused-vars */