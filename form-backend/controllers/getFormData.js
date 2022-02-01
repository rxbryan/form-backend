const db = require('../libs/db')

module.exports = (req, res, next) => {
	db.getFormData(req.params.formId).then(formdata => {
		res.status('200').json({data: formdata})
	}).catch(err => {
		res.status('200').json(err)
	})
}