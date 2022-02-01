const db = require('../libs/db')
const utils = require('../libs/util')

module.exports = (req, res, next) => {
  let forms = db.getAllForms()
  let data = []
  for (let form of forms) {
    data.push(form.formId)
  }
  res.status('200').json({forms: data})
}