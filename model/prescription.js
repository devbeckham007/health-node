const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const prescriptionSchema = new Schema({
   patient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  doctor: { type: Schema.Types.ObjectId, ref: "User", required: true },
  medicineName: { type: String, required: true },
  dosage: { type: String, required: true },
  frequency: { type: String, required: true },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date },
  notes: { type: String },
   referralCode: { type: String }


})
module.exports = mongoose.model('Prescription', prescriptionSchema)