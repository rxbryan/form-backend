const db = require('../libs/db')
const createError = require('../libs/error')

module.exports = (req, res, next) => {
	const queryError = new createError()
	const DATE_REGEX = /^\d{4}-\d{1,2}-\d{1,2}$/
	
	if (!req.query.from)	{
		 queryError.errorDetails({message: "'from' query parameter need's to be set", target: 'InvalidQueryParamter'})
	} else if (!DATE_REGEX.test(req.query.from)){
		queryError.errorDetails({message: "'from' query parameter value is not a valid date", target: 'InvalidQueryParamter'})
	}

	if (req.query.to) {
		if (!DATE_REGEX.test(req.query.to)) {
			queryError.errorDetails({message: "'to' query parameter value is not a valid date", target: 'InvalidQueryParamter'})
		}
	}

	if (queryError.errors() > 0) return res.status('400').json(queryError.queryParameterError())

	db.deleteFormData(req.form.formId, req.query.from, req.query.to).then(count => {
		res.status('200').json({message: `${count} form submissions deleted`})
	}).catch(err => {
		console.log(err)
		res.status('500').json(queryError.dbError({message: err.message || 'an error occurred in db.deleteFormData'}))
	})
}