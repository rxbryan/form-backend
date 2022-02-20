const jws = require('jws')

let JWS_SECRET = process.env.JWS_SECRET
if  (!JWS_SECRET) {
  console.error('JWS_SECRET not defined')
  process.exit(1)
}

function checkDate(date, expires) {
  if (date+(expires*60*60*1000) < new Date().getTime())
    throw 'JWS is expired'
}

exports.verifyJWS = async (signature) => {
  if (!signature || signature.length === 0)
    throw {message: 'JWS: cannot verify signature of nothing'}

  if (!jws.verify(signature, 'HS256', JWS_SECRET)) throw {message: 'JWS signature could not be verified'}

  let dump = jws.decode(signature)
  let payload = JSON.parse(dump.payload)
  if (payload.date && isFinite(parseInt(payload.expires))) {
    checkDate(payload.date, payload.expires)
  }
  return payload
}

function randomstringv2(len, an) { // an optional string 'a' alpha or 'n' numeric
  an = an && an.toLowerCase()
  let str = '',
    i = 0,
    min = an === 'a' ? 10 : 0,
    max = an === 'n' ? 10 : 62

  for (; i++ < len;) {
    let r = Math.random()*(max - min) + min << 0
    str += String.fromCharCode(r += r > 9 ? r < 36 ? 55 : 61 : 48)
  }
  return str
}

exports.genformId = () => {
  return randomstringv2(22)
}