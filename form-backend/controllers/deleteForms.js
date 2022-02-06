const db = require('../libs/db')

module.exports = (req, res, next) => {
	db.deleteForm(req.formId).then(() => {
		res.status('200').json({message: `form: ${req.formId} and all form submissions has been deleted`})
	}).catch(err => {
		res.status('500').json({error: err})
	})
}