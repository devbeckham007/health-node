const express = require("express");
const router = express.Router();
const verifyJWT = require("../middleware/verifyJWT");
const verifyRole = require("../middleware/verifyRole");
const { createPrescription, getPrescriptions, updatePrescription, deletePrescription } = require("../controller/prescontroller");

router.get("/", verifyJWT, verifyRole("patient", "doctor", "pharmacist"), getPrescriptions);
router.post("/", verifyJWT, verifyRole("doctor"), createPrescription);
router.post("/update/:id", verifyJWT, verifyRole("doctor", "pharmacist"), updatePrescription);
router.post("/delete/:id", verifyJWT, verifyRole("doctor", "pharmacist"), deletePrescription);

module.exports = router;