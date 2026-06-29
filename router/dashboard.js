const express = require("express");
const router = express.Router();

// Public landing page — no verifyJWT, everyone sees this
router.get("/", (req, res) => {
  res.render("dashboard");
});

module.exports = router;
