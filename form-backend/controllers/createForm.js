const utils = require('../libs/util')
const db = require('../libs/db')


// TO-DO robust error reporting
module.exports = (req, res, next) => {
	if (!req.body) {
		return res.status('400').json({error: "request body empty"})
	}
	console.log(req.body)
	utils.decodeJWS(req.body.token).then(payload => {
		console.log(payload)
		req.currentUser = Object.create(null)
		let form = Object.create(null)
		let parsed = JSON.parse(payload)

		form.userId = parsed.userId
		if (!req.body.redirectFailure) {
			throw {error: 'There is no redirect url for failed submission' }
		} else {
			//check if string is a url
		}

		if (!req.body.redirectSuccess) {
			throw {error: 'Unable to create form without redirect url for successful submission'}
		} else {
			//TO-DO check if string is a url
		}

		if (req.body.fileUpload === true)	{
			form.fileUpload = true
		} else {
			form.fileUpload = false
		}

		if (req.body.status === 'enabled') {
			form.status = req.body.status
		} else {
			form.status = 'disabled'
		}

		form.formId = utils.genformId()
		form.redirectUrl = {
			success: req.body.redirectFailure,
			failure: req.body.redirectSuccess
		}
		console.log(form)

		db.storeForm(form).then(() => {
			console.log('stored form')
			res.status('201').json({
				formId: form.formId,
				action: `Your hostname/form/submit/${form.formId}`
			})
		}).catch(error => {
				res.status('200').json({error: 'form some reason we '+
					'were unable to create your form. Please try again'})
			})
	}).catch(error => {
		res.status('400').json(error)
	})
}