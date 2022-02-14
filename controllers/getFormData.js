const db = require('../libs/db')
const apiError = require('../libs/error')

module.exports = (req, res, next) => { 
	const createError = new apiError()
	db.getFormData(req.dbQuery).then(formdata => {
		res.status('200').json({data: formdata})
	}).catch(err => {
		res.status('200').json(createError.dbError({message: err.message || 'an error occurred in db.getFormData'}))
	})
}