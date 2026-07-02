const mongoose = require('mongoose')
const Schema = mongoose.Schema

const appointmentSchema = new mongoose.Schema({
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: String,
  date: Date
},
  { timestamps: true } 
);
module.exports= mongoose.model('Appointment', appointmentSchema)