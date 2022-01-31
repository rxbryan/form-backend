const db =  require('../libs/db')

module.exports = async (req, res, next) => {


  db.storeFormData(req.formData.fields, req.formData.files, req.userId, req.formId).catch(err => {
    console.log(err)
    res.redirect(303, req.redirectFailure)
  })
} 