const Prescription = require("../model/prescription");
const User = require("../model/user"); // Make sure you have a User model
const generateReferralCode = require("../utils/referral");

// Doctor creates prescription
const createPrescription = async (req, res) => {
  try {
    if (req.user.role !== "doctor") {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const { medicineName, dosage, frequency, startDate, endDate, notes, patientId } = req.body;
    if (!patientId) {
      return res.status(400).json({ error: "Patient ID is required" });
    }
    const singlePatientId = Array.isArray(patientId) ? patientId[0] : patientId;


    const referralCode = generateReferralCode();

    const newPrescription = new Prescription({
      patient: singlePatientId,
      doctor: req.user.id,
      medicineName,
      dosage,
      frequency,
      startDate,
      endDate,
      notes,
      referralCode
    });

    await newPrescription.save();
    res.redirect('/medicines')
    // res.status(201).json({ message: "Prescription created successfully", prescription: newPrescription });
  } catch (error) {
    console.error("Error creating prescription:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Role-based prescription retrieval
const getPrescriptions = async (req, res) => {
  try {
    let prescriptions;

    if (req.user.role === "patient") {
      prescriptions = await Prescription.find({ patient: req.user.id })
        .populate("doctor", "username email");
    } else if (req.user.role === "doctor") {
      prescriptions = await Prescription.find({ doctor: req.user.id })
        .populate("patient", "username email");
    } else if (req.user.role === "pharmacist") {
      prescriptions = await Prescription.find()
        .populate("doctor", "username email")
        .populate("patient", "username email");
    }

    //  Doctors need patient list for dropdown
    let patients = [];
    if (req.user.role === "doctor") {
      patients = await User.find({ role: "patient" });
    }

    res.render("prescriptions", {
      message: {
        id: req.user.id,
        username: req.user.username,
        role: req.user.role,
        email: req.user.email
      },
      prescriptions,
      patients
    });
  } catch (error) {
    console.error("Error fetching prescriptions:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const updatePrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id);
    if (!prescription) {
      return res.status(404).json({ error: "Prescription not found" });
    }

    if (req.user.role === "doctor") {
      Object.assign(prescription, req.body);
      await prescription.save();
      return res.json({ message: "Prescription updated successfully", prescription });
    }

    if (req.user.role === "pharmacist") {
      if (req.body.referralCode !== prescription.referralCode) {
        return res.status(400).json({ error: "Invalid referral code" });
      }
      Object.assign(prescription, req.body);
      await prescription.save();
      return res.json({ message: "Prescription updated successfully", prescription });
    }
  } catch (error) {
    console.error("Error updating prescription:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const deletePrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id);
    if (!prescription) {
      return res.status(404).json({ error: "Prescription not found" });
    }
    await Prescription.findByIdAndDelete(req.params.id);
    res.json({ message: "Prescription deleted" });
  } catch (error) {
    console.error("Error deleting prescription:", error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { createPrescription, getPrescriptions, updatePrescription, deletePrescription };