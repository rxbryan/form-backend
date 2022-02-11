const utils = require('../libs/util')
const db = require('../libs/db')
const apiError = require('../libs/error')

module.exports = (req, res, next) => {
const requestError = new apiError()

	if (!(Object.keys(req.body).length > 0)) {
		return res.status('400').json(requestError.requestBodyError())
	}

	utils.decodeJWS(req.JWT).then(payload => {
		let form = {}

		if (!req.body.redirectFailure) {
			requestError.errorDetails({message: 'redirectFailure undefined', target: 'invalidEntityBodyParamter'})
		}
		if (!req.body.redirectSuccess) {
			requestError.errorDetails({message: 'redirectSuccess undefined', target: 'invalidEntityBodyParamter'})
		}
		if (requestError.errors() > 0) {
			return res.status('400').json(requestError.invalidBodyError())
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

		db.storeForm(form).then(() => {
			res.status('201').set('Location', req.headers['host']+`/forms/submit/${form.formId}`).json({
				formId: form.formId,
				action: `Your hostname/forms/submit/${form.formId}`
			})
		}).catch(error => {
				res.status('200').json(requestError.dbError(
					{status: 500, message: error['message'] || 'an error occurred in db#storeForm'}))
			})
	}).catch(error => {
		res.status('400').json(
			requestError.errorDetails({message: error.message, target: 'decodeJWS'}).authenticationError())
	})
	
}