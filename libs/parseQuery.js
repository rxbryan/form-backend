const apiError = require('./error')

module.exports = (req, res, next) => {
  console.log(req.query)
  const createError = new apiError()
  const DATE_REGEX = /^\d{4}-\d{1,2}-\d{1,2}$/
  const POSITIVE_INT_REGEX = /^\d+$/
	
  if (!req.query.from)	{
    createError.errorDetails({
      message: '\'from\' query parameter not set', 
      target: 'InvalidQueryParamter'
    })
  } else if (!DATE_REGEX.test(req.query.from)){
    createError.errorDetails({
      message: '\'from\' query parameter value is not a valid date',
      target: 'InvalidQueryParamter'
    })
  }

  if (req.query.to) {
    if (!DATE_REGEX.test(req.query.to)) {
      createError.errorDetails({
        message: '\'to\' query parameter value is not a valid date'
      })
    }
  }
  if (req.query.page) {
    if(!POSITIVE_INT_REGEX.test(req.query.page)) {
      createError.errorDetails({
        message: 'page parameter must be a valid integer',
        target: 'expectedInteger'
      })
    }
  }

  if (req.query.limit) {
    if (POSITIVE_INT_REGEX.test(req.query.limit)) {
      if (req.query.limit > 100) {
        createError.errorDetails({
          message: 'limit must be <= 100',
          target: 'pageSizeTooLarge'
        })
      }
    } else {
      createError.errorDetails({
        message: 'limit must be a valid integer',
        target: 'expectedInteger'
      })
    }
  }
	
  if (createError.errors() > 0)
    return res.status('400').json(createError.queryParameterError())


  let query = {}
  query.from = new Date(req.query.from)
  query.to = req.query.to ? new Date(req.query.to) : new Date()
  query.page = req.query.page ? parseInt(req.query.page) : 1
  query.limit = req.query.limit ? (parseInt(req.query.limit) >= 10) ? parseInt(req.query.limit) : 10 : 10 
  query.formId = req.form ? req.form.formId : null
  req.dbQuery = query
  next()
}