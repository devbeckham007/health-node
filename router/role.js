const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const verifyJWT = require("../middleware/verifyJWT");
const Doctor=require('../model/doctor')
const User = require("../model/user"); // <-- import your User model


router.get("/roleDashboard", verifyJWT, async (req, res) => {
  let patients = [];
  let doctor = null;

  console.log("✅ Hit /roleDashboard");
  console.log("✅ req.user:", req.user);

  if (req.user.role === "doctor") {
    patients = await User.find({ role: "patient" });
    doctor = await Doctor.findOne({ userId: new mongoose.Types.ObjectId(req.user.id) });

    console.log("✅ patients found:", patients.length);
    console.log("✅ doctor found:", doctor);
  }

  return res.render("roleDashboard", {
    message: {
      username: req.user.username,
      role: req.user.role,
      email: req.user.email,
    },
    patients,
    doctor
  });
});
module.exports = router;
// const express    = require('express');
// const router     = express.Router();
// const verifyJWT  = require('../middleware/verifyJWT');
// const User       = require('../model/user');
// const doctorController = require("../controller/doctorController");


// router.get('/', verifyJWT, async (req, res) => {
//   let patients = [];

//   if (req.user.role === "doctor") {
//     // fetch patients from DB
//     patients = await User.find({ role: "patient" });
//   }

//   return res.render("roleDashboard", {
//     message: {
//       username: req.user.username,
//       role: req.user.role,
//       email: req.user.email
//     },
//     patients
//   });
// });
//  router.get("/", verifyJWT, doctorController.doctorDashboard);
// module.exports = router;



// // const express = require("express");
// // const router = express.Router();
// // const doctorController = require("../controller/doctorController");
// // const verifyJWT = require("../middleware/verifyJWT");
// // const User = require("../model/user"); // <-- import your User model

// // router.get("/", (req, res) => {
// //     res.render("roleDashboard");
// // });
// // router.get("/", verifyJWT, async (req, res) => {
// //   let patients = [];

// //   if (req.user.role === "doctor") {
// //     // fetch patients from DB
// //     patients = await User.find({ role: "patient" });
// //   }

// //   res.render("roleDashboard", {
// //     message: {
// //       username: req.user.username,
// //       role: req.user.role,
// //       email: req.user.email
// //     },
// //     patients
// //   });
// // });
// // router.get("/", verifyJWT, doctorController.doctorDashboard);
// // module.exports = router;