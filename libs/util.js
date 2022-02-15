const jws = require('jws')

//const env = process.env.NODE_ENV || 'development'


try {
  var JWS_SECRET = process.env.JWS_SECRET //|| require(`../.credentials.${env}`).JWS_SECRET
  if (!JWS_SECRET) {
    console.log('JWS_SECRET config var undefined')
    process.exit(1)
  }
} catch (err) {
  console.error('JWS_SECRET not defined')
  process.exit(1)
}

/*
*payload is an object of arbitrary key:value pairs
*/
function verifyJWS (signature) {
  return jws.verify(signature, 'HS256', JWS_SECRET)
}

exports.verifyJWS = verifyJWS

exports.createJWS = (payload) => {
  const signature = jws.sign({
    header: {alg: 'HS256'},
    payload: payload,
    secret: JWS_SECRET
  })
  return signature
}

exports.decodeJWS = async (signature) => {
  console.log('signature: '+ signature)
  if (!signature || signature.length === 0)
    throw {message: 'JWS: cannot verify signature of nothing'}

  if (!verifyJWS(signature)) throw {message: 'JWS signature could not be verified'}

  let dump = jws.decode(signature)
  return dump.payload
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