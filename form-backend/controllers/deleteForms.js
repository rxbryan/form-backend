const db = require('../libs/db')
const apiError = require('../libs/error')
module.exports = (req, res, next) => {
	const createError = new apiError()
	db.deleteForm(req.formId).then(() => {
		res.status('200').json({message: `form: ${req.formId} and all form submissions has been deleted`})
	}).catch(err => {
		res.status('500').json(createError.dbError({message: err.message || 'an error occurred in db.deleteForm'}))
	})
}