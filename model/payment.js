const mongoose = require('mongoose');
const Schema = mongoose.Schema

const paymentSchema = new Schema(
    {
  reference: String,
  email: String,
  amount: Number,
  status: String,
  date: { type: Date, default: Date.now }

    }
)

module.exports = mongoose.model('Payment', paymentSchema)