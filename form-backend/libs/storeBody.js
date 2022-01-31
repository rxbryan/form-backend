const db = require('./db')

module.exports = (req, res, next) => {
  console.log(req.headers)
  console.log(req.body)
  db.storeFormData(req.userId, req.formId, req.body).then(() => {
    res.status('204').redirect(req.redirectSuccess)
  }).catch((err) => {
    console.log(err)
    res.status('200').redirect(req.redirectFailure)
  })
}