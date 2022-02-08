const db = require('../libs/db')
const apiError = require('../libs/error')

module.exports = (req, res, next) => {
	const createError = new apiError()
	const DATE_REGEX = /^\d{4}-\d{1,2}-\d{1,2}$/
	
	if (!req.query.from)	{
		createError.errorDetails({
			message: "'from' query parameter not set", 
			target: 'InvalidQueryParamter'
		})
	} else if (!DATE_REGEX.test(req.query.from)){
		createError.errorDetails({
			message: "'from' query parameter value is not a valid date",
			target: 'InvalidQueryParamter'
		})
	}

	if (req.query.to) {
		if (!DATE_REGEX.test(req.query.to)) {
			createError.errorDetails({
				message: "'to' query parameter value is not a valid date"
			})
		}
	}

	if (req.query.limit) {
		if (req.query.limit < 10)
			req.query.limit = 10
		else if (req.query.limit > 100)
			createError.errorDetails({
				message: 'limit must be <= 100',
				target: 'pageSizeTooLarge'
			})
	}
	
	if (createError.errors() > 0)
		return res.status('400').json(createError.queryParameterError())

	let query = {}
	query.from = new Date(req.query.from)
	query.to = new Date(req.query.to) || new Date()
	query.page = req.query.page || 1
	query.limit = req.query.limit
	query.formId = req.form.formId 

	db.getFormData(query).then(formdata => {
		res.status('200').json({data: formdata})
	}).catch(err => {
		res.status('200').json(err)
	})
}