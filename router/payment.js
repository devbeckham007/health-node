
const express = require("express");
const router = express.Router();
const { initializePayment, verifyPayment } = require("../controller/paymentController");

// Show payment.hbs
router.get("/", (req, res) => {
  const { drug, amount } = req.query;
  res.render("payment", { drug, amount });
});

// Initialize payment
router.post("/paystack", initializePayment);

// Verify payment
router.get("/paystack/verify/:reference", verifyPayment);

module.exports = router;