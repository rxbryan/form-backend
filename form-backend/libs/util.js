const fs = require('fs')
const pathUtils = require('path')
const bcrypt = require('bcrypt')
const jws = require('jws')

const env = process.env.NODE_ENV || 'development'
const {JWS_SECRET} = require(`../.credentials.${env}`)

function verifyJWS (signature) {
  console.log('verifyJWS')
  return jws.verify(signature, 'HS256', JWS_SECRET)
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
/*
*const storeDir = pathUtils.join(process.cwd(), 'cache')
*if (!fs.existsSync(storeDir)) fs.mkdirSync(storeDir)

exports.storefileLocal = async (path) => {
  const oldPath = pathUtils.resolve(path)
  const newPath = pathUtils.resolve(storeDir, pathUtils.basename(oldPath))
  //debug
  console.log('oldPath: '+oldPath, '\nnewPath: '+newPath)

  const renamefile = () => {
    return new Promise ((resolve, reject) => {
      fs.rename(oldPath, newPath, err => {
        if(err) {
          //debug
          console.log('error occurred in fs.rename')
          if(err.code === 'EXDEV') {
            //debug
            console.log(`error:${err.code} occurred in fs.rename`)
            copy().then(resolve(newPath)).catch((err)=>{reject (err)})
          } else {
            //debug
            console.log(`error:${err.code} occurred in fs.rename`)
            reject (err)
          }
        }
        resolve(newPath)   //refactor asap
      })
    })
  }

  const copy = () => {
    return new Promise ((resolve, reject) => {
      const readStream = fs.createReadStream(oldPath)
      const writeStream = fs.createWriteStream(newPath)

      readStream.on('error', () => { throw new Error('readStream error')})
      writeStream.on('error', () => { throw new Error('writeStream error')})

      readStream.on('close', () => {
        fs.unlink(oldPath, (err, data) => {
          if(err) {
            reject(err)
          } else {
            resolve(data)
          }
        })
      })

      readStream.pipe(writeStream)
    })
  }

  return renamefile().then((path)=>{console.log(path); return path})
}
*/

exports.validateUserEmail = (email) => {
  //This regex was adapted from an email validation regex at https://www.regular-expressions.info/index.html
  /*/^(?=[A-Z0-9][A-Z0-9@._%+-]{5,253}+$)[A-Z0-9._%+-]{1,64}+@(?:(?=[A-Z0-9-]{1,63}+\.)[A-Z0-9]++(?:-[A-Z0-9]++)*+\.){1,8}+[A-Z]{2,63}+$/*/
  
  // slightly modified version of the official W3C HTML5 email regex:
  // https://html.spec.whatwg.org/multipage/forms.html#valid-e-mail-address
  // adapted from Ethan Brown's Web Development with Node and Express

  let VALID_EMAIL_REGEX = new RegExp('^[a-zA-Z0-9.!#$%&\'*+\/=?^_`{|}~-]+@' +
    '[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?' +
    '(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$')

  if ((email != undefined) && VALID_EMAIL_REGEX.test(email)) {
    //sendValidationEmail(email) //to-do 
    return email
  }
  else {
    return false
  }

}

exports.validatePassword = (password) => {
  if(password.length < 8) {
    return false
  } else {
    return password
  }
}


exports.genUserId = async () => {
  return randomstringv2(30)
}

exports.genformId = () => {
  return randomstringv2(22)
}

/*
*payload is an object of arbitrary key:value pairs
*
*/
exports.createJWS =  (payload) => {
  const signature = jws.sign({
    header: {alg: 'HS256'},
    payload: payload,
    secret: JWS_SECRET
  })
  return signature
}


exports.decodeJWS = async (signature) => {
  if (!signature || signature.length === 0)
    throw {error: "cannot verify signature of nothing"}

  if (!verifyJWS(signature)) throw {error: "could not verify signature"}

  let dump = jws.decode(signature)
  return dump.payload
}