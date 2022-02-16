const db = require('../libs/db')
const createError = require('../libs/error')()

module.exports = (req, res, next) => {
	let form = Object.create(null)
	const fields = ['redirectSuccess', 'redirectFailure', 'fileUpload', 'status']

	let keys = Object.keys(req.body)
	for (let key of keys){
		let match = false
		for (let field of fields) {
			if (key === field) {
				form[key] = req.body[key]
				match = true
			}
		}
		if (match === false)
			createError.errorDetails({message: `'${key}' is not a valid parameter`})
	}

	if (Object.keys(form).length === 0 || createError.errors() > 0) 
		return res.status('400')
			.json(createError.badRequestError({message: 'request body contains extra parameters'}))

	db.updateForm(req.params.formId, form).then((form)=> {
		console.log(`${req.params.formId} successfully updated`)
		res.status('204').json(form)
	}).catch (err => {
		console.log(err)
		return res.status('200').json(createError
			.errorDetails({message: 'patch request was not stored database'})
			.dbError({message: err.message || 'DatabaseError'}))
	})
}