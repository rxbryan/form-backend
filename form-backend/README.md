# Form-backend
Self-hosted Node.js form backend for static sites 

## Description

## Api
```
GET /forms
jwt: access_token
```
returns a list of all formIds as JSON 

```
GET /forms/{formId}
jwt: access_token
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

- token: access_token
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
jwt: access_token
```
Delete submitted forms
accepts the query parameters:
- from: start date in the format `yyyy-mm-dd`
- to: defaults to current time.

```
DELETE /forms
jwt: access_token
```
accepts the query parameter: formId={formId} of form to be deleted
Delete form

### JWS
A JSON web signature is required to authenticate request to all the endpoints except the form action. 
For local development the `SECRET` can be placed in a  JSON file named `.credentials.${env}.json`
``` json
{
  "JWS_SECRET": ""
}
```
or use environment variables `JWS_SECRET = "secret"`

### Mongodb
The formData, form profile, logs are stored in either a local or remote mongodb database.
The mongodb connection string can be placed in `.credential.${env}.json`
```json
{
  "mongodb": {
    "connectionString": ""
  }
}
```
or as the environment variable `MONGODB_CONNECT`

**Note** the `env` variable is the value of `process.env.NODE_ENV`  or `development`

## License
  form-backend is licensed under the MIT License