var mongoose = require('mongoose')
var UserSchema = mongoose.Schema(
 {
  fname: String,
  lname: String,
  email: {type: String, unique: true},
  password: String,
  userType: String,
  cart: [
   { type: mongoose.Schema.Types.ObjectId, ref: 'ToyModel' }
  ]
 }
)

var UserModel = mongoose.model("user", UserSchema, "user")

module.exports = UserModel

