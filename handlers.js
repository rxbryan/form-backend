const createError = require('./libs/error')()

exports.notFound = (req, res) => {
  for (route of createError.routes) {
    if (route.PATH_REGEX.test(req.path)) {
      if (!route.methods.includes(req.method.toUpperCase)) {
        createError.errorDetails({message: `${req.method.toUpperCase()} not allowed on resource`})
      }
      return res.status('400').json(createError.methodNotAllowed())
    }
  }
  return res.status('404').json(createError.resourceError({}))
}

/* eslint-disable no-unused-vars */
exports.serverError = (err, req, res, next) => {
  console.error(err)
  //properly report invalid json request body error
  if (err.type === 'entity.parse.failed')
    return res.status('400').json(createError.errorDetails({message: 'invalid JSON body'}).badRequestError())
  else
    return res.status('500').json(createError.serverError())
}
/* eslint-enable no-unused-vars */