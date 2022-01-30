const express = require('express')
const expressHandlebars = require('express-handlebars')
const bodyParser = require('body-parser')

const handlers = require('./handlers')
const auth = require('./libs/authentication')
const formHandler = require('./controllers/formHandler')
const registerUser = require('./controllers/registerUser')
const loginUser = require('./controllers/loginUser')
const createForm = require('./controllers/createForm')

const app = new express()
app.engine('handlebars', expressHandlebars({
  defaultLayout: 'main',
}))

app.set('view engine', 'handlebars')

app.use(express.static(__dirname + '/public'))
app.use(/\/auth\/((login)|(register))/, bodyParser.urlencoded({ extended: true }), bodyParser.json())

let port = process.env.PORT
if (port == null || port == '') {
  port = 8459
}
app.listen(port, () => {
  console.log('App listening on port 8459')
  console.log(process.cwd())
})

//route handling
app.get('/signup', handlers.signup)

app.get('/login', handlers.login )

/*
app.get('/user/forms', )
app.get('user/forms/:formId', )


*/
app.post('/auth/register', registerUser )
app.post('/auth/login',loginUser, auth.getUserIdByEmail)
app.post('/user/forms', createForm)
app.post('form/submit/:formId', auth.authenticateFormid, formHandler)

/*
app.get('/user/token', )
app.get('/user/subscriptions', )
app.get('/about', handlers.about)
app.get('signup/verify-email*')
app.get('/login/forgot-passwrd')

app.get('/user', )
app.post('/user/forms/:formId', )
app.post('/user/token', )
app.post('user/subscriptions', )

app.put('/user')
app.patch('/user/forms/:formId')
app.patch('/user', )

app.delete('/user/token')
app.delete('/user/forms/:formId')*/
//Error notFound
app.use(handlers.notFound)

//serverError response
app.use(handlers.serverError)
