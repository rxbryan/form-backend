const db = require('../libs/db')

module.exports = (req, res, next) => {
	let form = {}
	const fields = ['redirectSuccess', 'redirectFailure', 'fileUpload', 'status']
	if (req.body.token) delete req.body.token

	if (Object.keys(req.body).length > 4) 
		return res.status('400').json({error: 'patch request body contains extra entities'})

	let keys = Object.keys(req.body)
	for (let key in keys){ //needlessly complicated code
		for (let field in fields) {
			if (keys[key] === fields[field]) form[keys[key]] = req.body[keys[key]]
		}
	}
	//TO-DO check every single parameter
	if (Object.keys(form).length === 0) 
		return res.status('400').json({error: 'request body contains invalid parameters'})

	db.updateForm(req.params.formId, form).then((form)=> {
		res.status('204').json(form)
	}).catch (err => {
		console.log(err)
		return res.status('200').json({error: 'patch request failed to be stored in database'})
	})

}