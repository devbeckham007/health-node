const express      = require("express");
const router       = express.Router();
const verifyJWT    = require("../middleware/verifyJWT");
const Doctor       = require("../model/doctor");
const Appointment  = require("../model/appointModel");
const { getAppointments, respondToAppointment } = require("../controller/appointController");

// ── Shared helper — both routes use this ──────────────────────
// Exported so roleDashboard route can import and reuse it too
const fetchAppointmentData = async (user) => {
  let doctors      = [];
  let appointments = [];

  if (user.role === "patient") {
    doctors = await Doctor.find({ isFull: { $ne: true } });
    appointments = await Appointment.find({ patientId: user.id })
      .populate({ path: "doctorId", model: "Doctor" })
      .sort({ createdAt: -1 });

  } else if (user.role === "doctor") {
    const doctorDoc = await Doctor.findOne({ userId: user.id });
    doctors = doctorDoc ? [doctorDoc] : [];
    if (doctorDoc) {
      appointments = await Appointment.find({ doctorId: doctorDoc._id })
        .populate({ path: "patientId", model: "User", select: "username email" })
        .sort({ createdAt: -1 });
    }
  }

  return { doctors, appointments };
};

// GET /appointments — full appointments page
router.get("/", verifyJWT, async (req, res) => {
  try {
    const { doctors, appointments } = await fetchAppointmentData(req.user);
    res.render("appointments", { user: req.user, doctors, appointments });
  } catch (err) {
    console.error("Error fetching appointments:", err);
    res.status(500).send("Server error");
  }
});

// GET /appointments/:appointmentId/respond
router.get("/:appointmentId/respond", verifyJWT, (req, res) => {
  res.render("respondForm", { appointmentId: req.params.appointmentId });
});

// POST /appointments
router.post("/", verifyJWT, getAppointments);

// POST /appointments/:appointmentId/respond
router.post("/:appointmentId/respond", verifyJWT, respondToAppointment);

module.exports = router;
module.exports.fetchAppointmentData = fetchAppointmentData;


// const express = require("express");
// const router = express.Router();
// const verifyJWT = require("../middleware/verifyJWT");
// const Doctor = require("../model/doctor");
// const Appointment = require("../model/appointModel");
// const { getAppointments, respondToAppointment } = require("../controller/appointController");

// router.get("/", verifyJWT, async (req, res) => {
//   try {
//     let doctors = [];
//     let appointments = [];

//     if (req.user.role === "patient") {
//       doctors = await Doctor.find({ isFull: { $ne: true } });


//       appointments = await Appointment.find({ patientId: req.user.id })
//         .populate("doctorId")   
//         .sort({ createdAt: -1 });

//     } else if (req.user.role === "doctor") {
//       const doctorDoc = await Doctor.findOne({ userId: req.user.id });
//       doctors = doctorDoc ? [doctorDoc] : [];

//       if (doctorDoc) {
//         appointments = await Appointment.find({ doctorId: doctorDoc._id })
//           .populate("patientId", "username email") // patientId refs User model
//           .sort({ createdAt: -1 });
//       }
//     }

//     res.render("appointments", {
//       user: req.user,
//       doctors,
//       appointments
//     });

//   } catch (err) {
//     console.error("Error fetching appointments:", err);
//     res.status(500).send("Server error");
//   }
// });

// // GET respond form
// router.get("/:appointmentId/respond", verifyJWT, (req, res) => {
//   res.render("respondForm", { appointmentId: req.params.appointmentId });
// });

// // POST book appointment
// router.post("/", verifyJWT, getAppointments);

// // POST respond to appointment
// router.post("/:appointmentId/respond", verifyJWT, respondToAppointment);

// module.exports = router;
