const mongoose = require("mongoose");
const Doctor   = require("../model/doctor");
const User     = require("../model/user");

const showRegisterForm = (req, res) => {
  res.render("doctor", { userId: req.params.userId });
};

const doctorProfile = async (req, res) => {
  try {
    const { username, email, department, licenseNumber, qualifications, yearsOfExperience, consultationFee, availability } = req.body;
    const { userId } = req.params;

    if (!username || !email || !department || !licenseNumber || !qualifications || !yearsOfExperience || !consultationFee || !availability) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newDoctor = new Doctor({
      userId,
      username,
      email,
      department,
      licenseNumber,
      qualifications: qualifications.split(","),
      yearsOfExperience,
      consultationFee,
      availability
    });

    await newDoctor.save();
    res.redirect("/login");
  } catch (error) {
    console.error("Error registering doctor:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

const doctorDashboard = async (req, res) => {
  try {
    // 1. Fetch this doctor's extended profile
    const doctor = await Doctor.findOne({
      userId: new mongoose.Types.ObjectId(req.user.id)
    });
    console.log("Doctor profile:", doctor);

    // 2. Fetch all patients so doctor can create prescriptions
    const patients = await User.find({ role: "patient" }).select("username email _id");
    console.log("Patients found:", patients.length);

    // 3. Render — message must have username, email, role for the template
    return res.render("roleDashboard", {
      message: {
        username: req.user.username,
        email:    req.user.email,
        role:     req.user.role,
      },
      doctor,           // null if no profile yet → template shows "Complete your profile"
      patients,         // [] if no patients yet → template shows "No patients registered"
    });

  } catch (error) {
    console.error("Error loading doctor dashboard:", error.message, error.stack);
    res.status(500).send("Server error");
  }
};

module.exports = { showRegisterForm, doctorProfile, doctorDashboard };
