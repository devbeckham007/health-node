const express = require("express");
const router = express.Router();
const { searchMedicines, readMedicines } = require("../controller/medicineController");

router.get("/", (req, res) => {
  res.render("medicines"); // matches views/medicines.hbs
});

router.post("/search", searchMedicines);
router.get("/search", searchMedicines);

module.exports = router;