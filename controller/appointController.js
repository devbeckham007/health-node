const Appointment = require("../model/appointModel");
const User        = require("../model/user");
const Doctor      = require("../model/doctor");
const nodemailer  = require("nodemailer");
const mongoose    = require("mongoose");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  family: 4, // Force IPv4 to avoid potential IPv6 issues
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

transporter.verify((error) => {
  if (error) {
    console.error("[Email] Transporter error:", error.message);
  } else {
    console.log("[Email] Ready to send emails");
  }
});


async function getAppointmentPageData(user) {
  let doctors      = [];
  let appointments = [];

  if (user.role === "patient") {
    doctors = await Doctor.find({ isFull: { $ne: true } });
    appointments = await Appointment.find({ patientId: user.id })
      .populate({ path: "doctorId", model: "Doctor" })
      .sort({ createdAt: -1 });

  } else if (user.role === "doctor") {
    const doctorDoc = await Doctor.findOne({ userId: user.id });
    doctors = doctorDoc ? [doctorDoc] : [];
    if (doctorDoc) {
      appointments = await Appointment.find({ doctorId: doctorDoc._id })
        .populate({ path: "patientId", model: "User" })
        .sort({ createdAt: -1 });
    }
  }

  return { doctors, appointments };
}

async function sendEmail(to, subject, text) {
  try {
    console.log("[Email] Sending to:", to);
    await transporter.sendMail({
      from: `"HealthNode" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text
    });
    console.log("[Email] Sent successfully to:", to);
  } catch (err) {
    console.error("[Email] Failed to send to", to, "—", err.message);
  }
}



const getAppointments = async (req, res) => {
  try {
    const { patientId, doctorId } = req.body;

    // Validate IDs
    if (!mongoose.Types.ObjectId.isValid(patientId)) {
      const data = await getAppointmentPageData(req.user);
      return res.render("appointments", { user: req.user, ...data, error: "Invalid patient ID" });
    }
    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
      const data = await getAppointmentPageData(req.user);
      return res.render("appointments", { user: req.user, ...data, error: "Invalid doctor ID" });
    }

    const doctor  = await Doctor.findById(doctorId);
    const patient = await User.findById(patientId);

    if (!doctor) {
      const data = await getAppointmentPageData(req.user);
      return res.render("appointments", { user: req.user, ...data, error: "Doctor not found" });
    }
    if (!patient) {
      const data = await getAppointmentPageData(req.user);
      return res.render("appointments", { user: req.user, ...data, error: "Patient not found" });
    }

    // Check if doctor is already full
    const count = await Appointment.countDocuments({ doctorId: doctor._id, status: "accepted" });
    if (count >= doctor.maxAppointments) {
      doctor.isFull = true;
      await doctor.save();
    }

    if (doctor.isFull) {
      const data = await getAppointmentPageData(req.user);
      return res.render("appointments", {
        user: req.user, ...data,
        error: "That doctor is fully booked. Please choose another."
      });
    }

    // Create appointment
    const appointment = new Appointment({
      doctorId:  doctor._id,
      patientId: patient._id,
      status:    "pending"
    });
    await appointment.save();

    // Email the doctor
    await sendEmail(
      doctor.email,
      "New Appointment Request — HealthNode",
      `Hi Dr. ${doctor.username},\n\nPatient ${patient.username} has requested an appointment with you.\n\nAccept or decline here:\n${process.env.BASE_URL}/appointments/${appointment._id}/respond\n\nRegards,\nHealthNode`
    );

    const data = await getAppointmentPageData(req.user);
    return res.render("appointments", {
      user: req.user, ...data,
      success: `Appointment request sent to Dr. ${doctor.username}.`
    });

  } catch (error) {
    console.error("[Appointments] Booking error:", error);
    res.status(500).json({ error: "Server error" });
  }
};


const respondToAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { action, date }  = req.body;

    // Populate both refs with their correct models
    const appointment = await Appointment.findById(appointmentId)
      .populate({ path: "doctorId",  model: "Doctor" })
      .populate({ path: "patientId", model: "User" });

    if (!appointment) {
      const data = await getAppointmentPageData(req.user);
      return res.render("appointments", { user: req.user, ...data, error: "Appointment not found" });
    }

    const patientEmail = appointment.patientId.email;
    const patientName  = appointment.patientId.username;
    const doctorName   = appointment.doctorId.username;

    if (action === "declined") {
      appointment.status = "declined";
      await appointment.save();

      await sendEmail(
        patientEmail,
        "Appointment Declined — HealthNode",
        `Hi ${patientName},\n\nDr. ${doctorName} has declined your appointment request.\n\nPlease visit HealthNode to book with another available doctor.\n\nRegards,\nHealthNode`
      );

      const data = await getAppointmentPageData(req.user);
      return res.render("appointments", {
        user: req.user, ...data,
        success: "Appointment declined and patient notified."
      });
    }

    if (action === "accepted") {
      appointment.status = "accepted";
      appointment.date   = date ? new Date(date) : null;
      await appointment.save();

      // Update doctor's accepted count
      const doctorDoc = appointment.doctorId;
      doctorDoc.acceptedCount = (doctorDoc.acceptedCount || 0) + 1;
      if (doctorDoc.acceptedCount >= doctorDoc.maxAppointments) {
        doctorDoc.isFull = true;
      }
      await doctorDoc.save();

      await sendEmail(
        patientEmail,
        "Appointment Accepted — HealthNode",
        `Hi ${patientName},\n\nDr. ${doctorName} has accepted your appointment request.\n\nDate: ${date || "To be confirmed"}\n\nPlease log in to HealthNode for full details.\n\nRegards,\nHealthNode`
      );

      const data = await getAppointmentPageData(req.user);
      return res.render("appointments", {
        user: req.user, ...data,
        success: `Appointment accepted. ${patientName} has been notified.`
      });
    }

    // Unknown action fallback
    return res.redirect("/appointments");

  } catch (error) {
    console.error("[Appointments] Respond error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { getAppointments, respondToAppointment };