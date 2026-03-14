const express = require("express");
const router = express.Router();
const verifyJWT = require("../middleware/verifyJWT");
const User = require("../model/user"); // <-- import your User model

router.get("/", verifyJWT, async (req, res) => {
  let patients = [];

  if (req.user.role === "doctor") {
    // fetch patients from DB
    patients = await User.find({ role: "patient" });
  }

  res.render("dashboard", {
    message: {
      username: req.user.username,
      role: req.user.role,
      email: req.user.email
    },
    patients
  });
});

module.exports = router;