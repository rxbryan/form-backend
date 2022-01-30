const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const bcrypt = require('bcrypt')
const utils = require('../libs/util')
const subscriptionSchema = require('./Subscription')

const Schema = mongoose.Schema
const UserSchema = new Schema({
  name: {
    firstName: {
      type: String,
      required: [true, 'please provide a firstName for this customer']
    },
    lastName: {
      type: String,
      required: [true, 'please provide a lastName for this customer']
    }
  },
  email: {
    type: String,
    required: [true, 'an email address is required'],
    unique: true
  },
  altEmail: {
    type: String,
    unique: true
  },
  businessName: String,
  password: String,
  userId: {
    type: String,
    required: [true, 'you can\'t store a user with an id String'],
    unique: [true, 'randomstringv2 failed to generate unique string']
  },
  noofFormSubmits: Number,
  storageUsed: Number,
  signUpDate: {
    type: Date,
    default: new Date()
  },
  status: {
    type: String,
    enum: ['unverified', 'active', 'disabled', 'deactivated'],
    default: 'unverified'
  }
})

UserSchema.pre('save', function (next) {
  console.log(this.email)
  try {
    utils.validateUserEmail(this.email)
  } catch(err) {
    next(err)
  }
  next()
})

UserSchema.pre('save',function (next) {
  bcrypt.hash(this.password, 10, (error, hash) => {
    //console.log(this.password)
    this.password = hash
    //console.log(hash)
    next()
  })
})

UserSchema.pre('validate', async function(next){
  let id = await utils.genUserId()
  //console.log(id)
  this.userId = id
  next()
})

UserSchema.plugin(uniqueValidator)
module.exports = mongoose.model('User', UserSchema)