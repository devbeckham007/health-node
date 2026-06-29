const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const doctorSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  department: { type: String, required: true }, 
  licenseNumber: { type: String, required: true },
  qualifications: [String],
  yearsOfExperience: { type: Number, default: 0 },
  consultationFee: { type: Number, default: 0 },
  availability: { type: String },
  ratings: [
    {
      patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient" },
      score: { type: Number, min: 1, max: 5 },
      comment: String
    }
  ]
});

module.exports = mongoose.model("Doctor", doctorSchema);
