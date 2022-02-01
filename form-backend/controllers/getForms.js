const db = require('../libs/db')

module.exports = async (req, res, next) => {
  let forms = await db.getAllForms().then(forms => {
    let data = []
    for (let form of forms) {
      data.push(form.formId)
    }
    res.status('200').json({forms: data})
  }).catch(err => {
    res.status('200').json(err)
  })
}