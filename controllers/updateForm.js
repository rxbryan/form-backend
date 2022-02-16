const db = require('../libs/db')
const createError = require('../libs/error')()

module.exports = (req, res, next) => {
	let form = Object.create(null)
	const fields = ['redirectSuccess', 'redirectFailure', 'fileUpload', 'status']

	if (Object.keys(req.body).length > 4) 
		return res.status('400').json(createError.errorDetails({message: 'patch request body contains extra entities'}).badRequestError({}))

	let keys = Object.keys(req.body)
	for (let key in keys){ //needlessly complicated code
		for (let field in fields) {
			if (keys[key] === fields[field]) form[keys[key]] = req.body[keys[key]]
		}
	}
	//TO-DO check every single parameter
	if (Object.keys(form).length === 0) 
		return res.status('400').json(createError.invalidBodyError())

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