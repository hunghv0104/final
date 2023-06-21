var mongoose = require('mongoose')
var ToySchema = mongoose.Schema(
 {
  name: String,
  year: Number,
  age_restriction: Number,
  price: Number,
  category: String,
  description: String,
  image: String
 }
)

var ToyModel = mongoose.model("toy", ToySchema, "toy")

module.exports = ToyModel

