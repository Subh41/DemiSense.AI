const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Function to execute MySQL queries
const executeQuery = (query, values) => {
  return new Promise((resolve, reject) => {
    db.query(query, values, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

// ✅ **Route to book an appointment**
router.post("/book", async (req, res) => {
  try {
    const {
      name,
      specialization,
      date,
      time,
      medicalLicenseNumber,
      patient_id,
    } = req.body;

    if (!medicalLicenseNumber || !patient_id) {
      return res.status(400).json({
        error: "Doctor's medical license number and Patient ID are required",
      });
    }

    console.log("Booking Appointment:", req.body);

    // Get doctor ID from medical license number
    const doctorQuery = "SELECT id FROM doctors WHERE medicalLicenseNumber = ?";
    const doctorResult = await executeQuery(doctorQuery, [medicalLicenseNumber]);
    
    if (doctorResult.length === 0) {
      return res.status(404).json({ error: "Doctor not found" });
    }
    
    const doctorId = doctorResult[0].id;

    // Insert the appointment
    const appointmentQuery = `
      INSERT INTO appointments (name, specialization, date, time, doctorId, medicalLicenseNumber, patient_id, created_at, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), 'pending')
    `;
    await executeQuery(appointmentQuery, [
      name,
      specialization,
      date,
      time,
      doctorId,
      medicalLicenseNumber,
      patient_id,
    ]);
    console.log("✅ Appointment booked successfully!");

    // Insert a notification for the doctor
    const notificationMessage = `New appointment booked for ${name} on ${date} at ${time}.`;
    const notificationQuery = `
      INSERT INTO notifications (doctorId, message, created_at)
      VALUES (?, NOW())
    `;
    await executeQuery(notificationQuery, [doctorId]);
    console.log("✅ Notification generated for doctor:", notificationMessage);

    res
      .status(200)
      .json({ message: "Appointment and notification created successfully" });
  } catch (error) {
    console.error("❌ Error booking appointment:", error);
    res.status(500).json({ error: "Failed to book appointment" });
  }
});

// ✅ **Route to fetch appointments for a specific doctor**
router.get("/doctor/:medicalLicenseNumber", async (req, res) => {
  try {
    const { medicalLicenseNumber } = req.params;
    const sql = `SELECT * FROM appointments WHERE medicalLicenseNumber = ?`;

    const appointments = await executeQuery(sql, [medicalLicenseNumber]);
    res.status(200).json(appointments);
  } catch (error) {
    console.error("❌ Error fetching doctor appointments:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ **Route to fetch appointments for a specific patient**
router.get("/patient/:patient_id", async (req, res) => {
  try {
    const { patient_id } = req.params;
    const sql = `SELECT * FROM appointments WHERE patient_id = ?`;

    const appointments = await executeQuery(sql, [patient_id]);
    res.status(200).json(appointments);
  } catch (error) {
    console.error("❌ Error fetching patient appointments:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
