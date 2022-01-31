const db = require('./db')

module.exports = (req, res, next) => {
  console.log(req.headers)
  console.log(req.body)
  db.storeFormData(req.userId, req.formId, req.body).then(() => {
    res.status('204').end()
  }).catch((err) => {
    console.log(err)
    res.status('200').json({
      error: 'for some reason the formdata was no stored in the database. Please do not try again'
    })
  })
}