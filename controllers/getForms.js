const db = require('../libs/db')
const apiError = require('../libs/error')

module.exports = async (req, res, next) => {
  const createError = new apiError()
  await db.getAllForms(req.dbQuery).then(data => {
    res.status('200')
    .json({message: `returning Page: ${req.dbQuery.page}. Limit: ${req.dbQuery.limit}`, forms: data})
  }).catch(err => {
    res.status('200').json(createError.dbError({
      status: 400,
      message: err.message || 'an error occurred in db.getAllForms'
    }))
  })
}