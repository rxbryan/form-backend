'using strict'
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const handlers = require('./handlers')
const auth = require('./libs/authentication')
const parseQuery = require('./libs/parseQuery')
const multipart = require('./libs/storeMultipart')
const storeBody = require('./libs/storeBody')
const createForm = require('./controllers/createForm')
const getForms = require('./controllers/getForms')
const getFormData = require('./controllers/getFormData')
const updateForm = require('./controllers/updateForm')
const deleteFormData = require('./controllers/deleteFormData')
const deleteForms = require('./controllers/deleteForms')

const app = new express()


let port = process.env.PORT
if (port == null || port == '') {
  port = 8459
}
app.listen(port, () => {
  console.log('App listening on port 8459')
  console.log(process.cwd())
})
process.on('uncaughtException', function (err) {
  console.error(err.stack); // either logs on console or send to other server via api call.
  process.exit(1)
})
//disable 'x-powered-by header'
app.disable('x-powered-by')
app.use(cors())

//route handling
app.get('/forms', auth.authenticateJWS, parseQuery, getForms)
app.get('/forms/:formId', auth.authenticateFormid, auth.authenticateJWS, parseQuery, getFormData)

app.post('/forms', bodyParser.json(), auth.authenticateJWS, createForm)
app.post('/form/submit/:formId', auth.authenticateFormid, multipart, 
  bodyParser.urlencoded({ extended: true }), bodyParser.json(), storeBody)

app.patch('/forms/:formId', auth.authenticateFormid, bodyParser.urlencoded({ extended: true }),
  bodyParser.json(), auth.authenticateJWS, updateForm)

app.delete('/forms/:formId', auth.authenticateJWS, auth.authenticateFormid, deleteFormData)

app.delete('/forms', auth.authenticateJWS, auth.authenticateFormid, deleteForms)

/*
app.get('/about', handlers.about)
*/

app.use(handlers.notFound)
app.use(handlers.serverError)
