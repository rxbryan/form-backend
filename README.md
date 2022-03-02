# Form-backend
Self-hosted Node.js form backend for static sites 

## Api
```
GET /forms
jws: access_token
```
returns a list of all formIds as JSON 

```
GET /forms/{formId}
jws: access_token
```
accepts the query parameters:
- from: start date in the format `yyyy-mm-dd`
- to: defaults to current time.
- page: defaults to 1
- limit: number of items returned per page. default = 10, max = 100 

```
POST /forms
```
Create a new form. Returns a status of `201` and formId of new form on success
The access token can be passed in the form body `token=value` or as a header parameter

The following parameters should be passed either as a JSON or form body of the request

- access_token: access_token
- redirectUrlSuccess: redirect url on successful submission
- redirectUrlFailure: redirect url if an error occurs
- fileUpload: boolean `true` or `false`. defaults to `false`
- status: `enabled` or `disabled`. defaults to `enabled` 

```
POST /forms/submit/{formId}
```
form action

```
PATCH /forms/{formId}
```
Update form options provided when form was created. Returns form object on success

```
DELETE /forms/{formId}
jws: access_token
```
Delete submitted forms
accepts the query parameters:
- from: start date in the format `yyyy-mm-dd`
- to: defaults to current time.

```
DELETE /forms
jws: access_token
```
accepts the query parameter: formId={formId} of form to be deleted
Delete form

### JWS
A JSON web signature is required to authenticate request to all the endpoints except the form action. 
The `secret` should be stored in environment variables 

```bash
JWS_SECRET={secret}
```
For Heroku:
```bash
heroku config:set --app appname JWS_SECRET={secret}
```
**Note** replace {secret} with your secret

Generate new JWS
```js
const jws = require('jws')
const SECRET = process.env.JWS_SECRET

const signature = jws.sign({
  header : {alg: 'HS256'},
  payload: {
    UserId: "signup",
    scope: "register user",
    date: new Date().getTime(),
    expires: 720 //1 month in hrs
  },
  secret: SECRET
})

console.log(signature)
```
### Mongodb

The formData, form profile, logs are stored in either a local or remote mongodb database.
The mongodb connection string should be stored in the environment variable `MONGODB_URI`

**Note** the `env` variable is the value of `process.env.NODE_ENV`  or `development`

## Demo

A demo is available here: [https://node-form-backend.herokuapp.com/](https://node-form-backend.herokuapp.com/)

**PS** contact me at my email for an access token

## Author

[Bryan Elee](https://github.com/rxbryan) ([rxbryn@gmail.com](mailto:rxbryn@gmail.com))

## License

[MIT License](http://www.opensource.org/licenses/mit-license.php)