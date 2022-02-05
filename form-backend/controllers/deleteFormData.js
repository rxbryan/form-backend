const db = require('../libs/db')

module.exports = (req, res, next) => {
	console.log('you fucked up')
	let DATE_REGEX = /^\d{4}-\d{1,2}-\d{1,2}$/
	if (!req.query.from)	{
		return res.status('400').json({error: "'from' query parameter need's to be set"})
	} else if (!DATE_REGEX.test(req.query.from)){
		return res.status('400').json({error: "'from' query parameter value invalid"})
	} else if (req.query.to) {
		if (!DATE_REGEX.test(req.query.to)) {
			return res.status('400').json({error: "'to' query parameter value invalid"})
		}
	}

	db.deleteFormData(req.formId, req.query.from, req.query.to).then(count => {
		res.status('200').json({message: `${count} form submissions deleted`})
	}).catch(err => {
		console.log(err)
		res.status('200').json({message: 'no submissions to delete'})
	})
}