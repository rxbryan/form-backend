const db = require('./db')

module.exports = (req, res, next) => {
  if (req.form.status === 'disabled') {
    return res.status('400').json({error: `form: ${req.form.formId} is disabled`})
  }
  db.storeFormData(req.formId, req.body).then(() => {
    return res.status('204').redirect(req.form.redirectSuccess)
  }).catch((err) => {
    console.log(err)
    return res.status('200').redirect(req.form.redirectFailure)
  })
}