const db = require('../libs/db')
const csurf = require('csrf')()
const utils = require('../libs/util')
const env = process.env.NODE_ENV || 'development'
const {CSRF_SECRET} = require(`../.credentials.${env}`)

module.exports  = (req, res, next) => {
	//TODO: log user registration
	console.log(req.body)

	if (!csurf.verify(CSRF_SECRET, req.body.csrfToken)) {
		console.log('csrf token verification failed')
		return res.redirect('404')
	}

	res.locals.inputError = Object.create(null)

	if (!utils.validatePassword(req.body.password)) {
		res.locals.inputError.password = `password must be atleast eight characters`
	} 
	if (req.body.firstName < 2 || req.body.lastName < 2) {
		res.locals.inputError.name = 'your names should not be less than 2 characters '
	}
	if (!utils.validateUserEmail(req.body.email)){
		res.locals.inputError.email = 'pls correct your email address'
	}

	if (Object.keys(res.locals.inputError).length > 0) {
		return res.send(res.locals.inputError)
	} else {
			db.storeUser(req.body).then(()=>{
			res.send('thank you for registering')
			}).catch(err => {
			res.send(err)
			}) //TODO better error handling*/
	}
}
