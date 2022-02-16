const createError = require('../libs/error')()

module.exports = (req, res, next) => {
  const MULTIPART_CONTENT_TYPE_REGEX = /\bmultipart\/form-data/
  let contentType = req.headers['content-type']

  if (req.form.status === 'disabled') {
    return res.status('400').json({error: `form: ${req.form.formId} is disabled`})
  }
  
  if (!MULTIPART_CONTENT_TYPE_REGEX.test(contentType) &&
    contentType != 'application/x-www-form-urlencoded' &&
    contentType != 'application/json') {
    console.log('invalid contentType')
    return res.status('400').json(createError.contentTypeError())
  }

  if (!req.form.fileUpload && MULTIPART_CONTENT_TYPE_REGEX.test(req.headers['content-type'])) {
    return res.status('400')
      .json(createError.errorDetails({message: 'fileUpload can\'t be set to false '+
        'if content-type: multipart/form-data*'})
      .badRequestError({})
      )
  }
  next()
}