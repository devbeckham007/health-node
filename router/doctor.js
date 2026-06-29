const express = require("express");
const router = express.Router();
const doctorController = require("../controller/doctorController");

// Show doctor registration form
router.get("/register/doctor/:userId", doctorController.showRegisterForm);

// Handle doctor registration submission
router.post("/register/doctor/:userId", doctorController.doctorProfile);

// Doctor dashboard
router.get("/roleDashboard/doctor", doctorController.doctorDashboard);

module.exports = router;