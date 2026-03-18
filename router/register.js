const express = require("express");
const router = express.Router();
const { registerUser } = require("../controller/registerController");
const { loginUser } = require("../controller/authController");

// Default landing page → register
router.get("/", (req, res) => {
  res.render("register");
});

// Handle registration form
router.post("/register", registerUser);

// Show login page
router.get("/login", (req, res) => {
  res.render("login");
});

// Handle login form
router.post("/login", loginUser);

module.exports = router;