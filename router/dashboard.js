const express = require("express");
const router = express.Router();
const verifyJWT = require("../middleware/verifyJWT");



router.get("/", verifyJWT, (req, res) => {
  res.render("dashboard", {
    message: {
      username: req.user.username,
      role: req.user.role,
      email: req.user.email
    }
  });
});

module.exports = router;