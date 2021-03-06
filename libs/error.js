module.exports = ApiError

function ApiError (options) {
  if (!(this instanceof ApiError)) {
    return new ApiError(options)
  }
  let opts = options || {}
  this.target = opts.target || ''
  this.message = opts.message || ''
  this.details = []
  this.code = errorCode(opts.status)
}

ApiError.prototype.routes = [
  {
    PATH_REGEX: /^\/forms$/,
    methods: ['GET', 'POST', 'DELETE']
  },
  {
    PATH_REGEX: /^\/forms\/\w{22}$/,
    methods: ['GET', 'PATCH', 'DELETE']
  },
  {
    PATH_REGEX: /^\/form\/submit\/\w{22}$/,
    methods: ['POST']
  }
]

function errorCode (status) {
  let code 
  switch(status) {
  case 400:
    code = 'BadRequest'
    break
  case 401:
    code = 'Unauthorized'
    break
  case 403:
    code = 'Forbidden'
    break
  case 404:
    code = 'NotFound'
    break
  case 405:
    code = 'MethodNotAllowed'
    break
  case 500:
    code = 'InternalServerError'
    break
  default:
    code = null
    break
  }
  return code
}

ApiError.prototype.errorDetails = function errorDetails (options) {
  let opts = options || {}
  let code = opts.code || errorCode(opts.status)
  let target = opts.target || ''
  if (!opts.message) throw 'error message required to construct error object'
  let message = opts.message

  this.details.push({
    code: code,
    target: target,
    message: message
  })
  return this
}

/**
 * Construct Error object.
 */
ApiError.prototype.constructError = function() {
  let error =  {
    code: this.code,
    target: this.target,
    message: this.message,
    details: this.details
  }
  if (error.details.length > 0) this.details = []
  else delete error.details

  return error
}

ApiError.prototype.dbError = function(options) {
  let opts = options || {}
  if (!opts.message) throw 'error message required to construct error object'
  this.message = opts.message
  this.target = opts.target || 'DatabaseError'
  this.code = errorCode(opts.status||500)
  return this.constructError()
}

ApiError.prototype.formIdError = function(options) {
  let opts = options || {}
  this.message = opts.message || 'formId does not exist'
  this.target = opts.target || 'formIdError'
  this.code = errorCode(opts.status || 400)
  return this.constructError()
}

ApiError.prototype.authenticationError = function(options) {
  let opts = options || {}
  this.message = opts.message || 'request could not be authenticated'
  this.target = opts.target || 'JSON Web Signature error'
  this.code = errorCode(opts.status||403)
  return this.constructError()
}

ApiError.prototype.contentTypeError = function() {
  this.message = 'content-type header parameter invalid'
  this.target = 'InvalidHeaderValue'
  this.code = errorCode(400)
  return this.constructError()
}

/**
 * use ApiError#prototype#errorDetails to construct details array
 */
ApiError.prototype.queryParameterError = function () {
  this.message = 'invalid query parameters'
  this.target = 'queryParameterInvalid'
  this.code = errorCode(400)
  return this.constructError()
}

ApiError.prototype.badRequestError = function(options) {
  let opts = options || {}
  this.message = opts.message || 'request message not properly constructed'
  this.target = opts.target || 'BadRequest'
  this.code = errorCode(opts.status||400)
  return this.constructError()
}

ApiError.prototype.invalidBodyError = function() {
  this.message = 'entity body parameters invalid'
  this.target = 'invalidRequest'
  this.code = errorCode(400)
  return this.constructError()
}

ApiError.prototype.requestBodyError = function() {
  this.message = 'request body not present'
  this.target = 'invalidRequest'
  this.code = errorCode(400)
  return this.constructError()
}

ApiError.prototype.resourceError = function() {
  this.message = 'requested resource not found'
  this.target = 'invalidPath'
  this.code = errorCode(404)
  return this.constructError
}

ApiError.prototype.methodNotAllowed = function () {
  this.message = 'requested method not allowed'
  this.target = 'invalidMethod'
  this.code = errorCode(405)
  return this.constructError() 
}

ApiError.prototype.serverError = function() {
  this.message = 'server unable to complete request'
  this.target = 'serverError'
  this.code = errorCode(500)
  return this.constructError()
}

ApiError.prototype.errors = function() {
  return this.details.length
}

