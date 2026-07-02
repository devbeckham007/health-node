const express     = require("express");
const router      = express.Router();
const verifyJWT   = require("../middleware/verifyJWT");
const Doctor      = require("../model/doctor");
const User        = require("../model/user");
const Prescription = require("../model/prescription");

// Import the shared helper from appointment route
const { fetchAppointmentData } = require("./appointments");

router.get("/roleDashboard", verifyJWT, async (req, res) => {
  try {
    let doctor        = null;
    let patients      = [];
    let prescriptions = [];

    // Get appointments + doctors using the shared helper
    const { appointments } = await fetchAppointmentData(req.user);

    if (req.user.role === "doctor") {
      doctor   = await Doctor.findOne({ userId: req.user.id });
      patients = await User.find({ role: "patient" });
      prescriptions = await Prescription.find({ doctorId: req.user.id });

    } else if (req.user.role === "patient") {
      prescriptions = await Prescription.find({ patientId: req.user.id });

    } else if (req.user.role === "pharmacist") {
      prescriptions = await Prescription.find({ status: "pending" });
    }

    res.render("roleDashboard", {
      message:       req.user,
      doctor,
      patients,
      appointments,        // ← now available in roleDashboard.hbs
      prescriptions,
    });

  } catch (err) {
    console.error("roleDashboard error:", err);
    res.status(500).send("Server error");
  }
});

module.exports = router;