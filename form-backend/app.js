const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const handlers = require('./handlers')
const auth = require('./libs/authentication')
const multipart = require('./libs/storeMultipart')
const storeBody = require('./libs/storeBody')
const createForm = require('./controllers/createForm')
const getForms = require('./controllers/getForms')
const getFormData = require('./controllers/getFormData')
const updateForm = require('./controllers/updateForm')

const app = new express()

let port = process.env.PORT
if (port == null || port == '') {
  port = 8459
}
app.listen(port, () => {
  console.log('App listening on port 8459')
  console.log(process.cwd())
})

app.use(cors())

//route handling
app.get('/forms', auth.authenticateJWS, getForms)
app.get('/forms/:formId', auth.authenticateJWS, getFormData)

app.post('/forms', bodyParser.json(), createForm)
app.post('/form/submit/:formId', auth.authenticateFormid, multipart, 
  bodyParser.urlencoded({ extended: true }), bodyParser.json(), storeBody)

app.patch('/forms/:formId', auth.authenticateFormid, bodyParser.urlencoded({ extended: true }),
 bodyParser.json(), auth.authenticateJWS, updateForm)

/*app.delete('//forms/:formId')
app.get('/about', handlers.about)
*/

app.use(handlers.notFound)
app.use(handlers.serverError)
