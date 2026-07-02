const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const doctorSchema = new Schema({ 
  username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  department: { type: String, required: true }, 
  licenseNumber: { type: String, required: true },
  qualifications: [String],
  yearsOfExperience: { type: Number, default: 0 },
  consultationFee: { type: Number, default: 0 },
  availability: { type: String },
 acceptedCount: { type: Number, default: 0 },  
  maxAppointments: { type: Number, default: 10 }, 
  isFull: { type: Boolean, default: false },
  ratings: [
    {
      patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient" },
      score: { type: Number, min: 1, max: 5 },
      comment: String
    }
  ]
});

module.exports = mongoose.model("Doctor", doctorSchema);
