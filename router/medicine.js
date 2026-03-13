// router/medicine.js
const express = require("express");
const router = express.Router();
const { searchMedicines, readMedicines } = require("../controller/medicineController");

// Debug log to see when this router is loaded
console.log("Medicine router loaded");

// List all routes in this router
router.use((req, res, next) => {
  console.log("Incoming request:", req.method, req.originalUrl);
  next();
});

// Routes
router.get("/", readMedicines);
router.post("/search", searchMedicines);   // ✅ must exist for POST
router.get("/search", searchMedicines);    // optional, if you want GET too

module.exports = router;