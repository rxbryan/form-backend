'using strict'
const express = require('express')
const cors = require('cors')
const handlers = require('./handlers')
const auth = require('./libs/authentication')
const parseQuery = require('./libs/parseQuery')
const multipart = require('./libs/storeMultipart')
const storeBody = require('./libs/storeBody')
const createForm = require('./controllers/createForm')
const submitController = require('./controllers/submitForm')
const getForms = require('./controllers/getForms')
const getFormData = require('./controllers/getFormData')
const updateForm = require('./controllers/updateForm')
const deleteFormData = require('./controllers/deleteFormData')
const deleteForms = require('./controllers/deleteForms')

process.on('uncaughtException', function (err) {
  console.error(err.stack)
  process.exit(1)
})

const app = new express()

let port = process.env.PORT
if (port == null || port == '') {
  port = 8459
}
app.listen(port, () => {
  console.log('App listening on port 8459')
  console.log(process.cwd())
})

//disable 'x-powered-by header'
app.disable('x-powered-by')
app.use(cors())

app.param('formId' ,auth.authenticateFormid)
const forms = app.route('/forms')

//route handling
forms.get(auth.authenticateJWS, parseQuery, getForms)
forms.post(express.json(), auth.authenticateJWS, createForm)
forms.delete(auth.authenticateFormid, auth.authenticateJWS, deleteForms)

app.get('/forms/:formId', auth.authenticateJWS, parseQuery, getFormData)
app.patch('/forms/:formId', express.urlencoded({ extended: true }),
  express.json(), auth.authenticateJWS, updateForm)
app.delete('/forms/:formId', auth.authenticateJWS, deleteFormData)

app.post('/form/submit/:formId', submitController, multipart, 
  express.urlencoded({ extended: true }), express.json(), storeBody)

//error handling
app.use(handlers.notFound)
app.use(handlers.serverError)
