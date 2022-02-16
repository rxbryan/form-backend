const db = require('./db')

module.exports = (req, res, next) => {
  db.storeFormData(req.form.formId, req.body).then(() => {
    return res.redirect(req.form.redirectSuccess)
  }).catch((err) => {
    console.log(err)
    return res.redirect(req.form.redirectFailure)
  })
}