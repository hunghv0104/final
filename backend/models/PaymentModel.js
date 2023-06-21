const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  products: {
    type: Array,
    required: true,
    ref: 'toy'
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const PaymentModel = mongoose.model('payment', paymentSchema, 'payment');

module.exports = PaymentModel;