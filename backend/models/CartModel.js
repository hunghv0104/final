const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'toy'
  }]
});

CartModel = mongoose.model('cart', CartSchema, "cart");

module.exports = CartModel