const express = require("express");
const router = express.Router();
const { createMedicine, readMedicines, updateMedicine, deleteMedicine} = require("../controller/medicineController");
const verifyJWT = require("../middleware/verifyJWT");
const verifyRole = require("../middleware/verifyRole");

router.get("/medicines", verifyJWT, verifyRole("doctor"), (req, res) => {
  res.render("medicines", { username: req.user.username });
});



// ✅ Pass the middleware function, don’t call it immediately
router.get("/", verifyJWT, verifyRole("doctor"), readMedicines);
router.post("/", verifyJWT, verifyRole("doctor", "pharmacist"), createMedicine);
router.post("/update/:id", verifyJWT, verifyRole("doctor", "pharmacist"), updateMedicine);
router.post("/delete/:id", verifyJWT, verifyRole("doctor", "pharmacist"), deleteMedicine);
module.exports = router;