const express = require("express");
const router = express.Router();
const db = require("../config/db");

// ✅ **Route to get notifications for a user (doctor/patient)**
router.get("/:medicalLicenseNumber", async (req, res) => {
  try {
    const { medicalLicenseNumber } = req.params;

    if (!medicalLicenseNumber) {
      return res.status(400).json({ error: "Invalid medical license number" });
    }

    // Get doctor ID first
    const doctorQuery = "SELECT id FROM doctors WHERE medicalLicenseNumber = ?";
    const doctorResult = await executeQuery(doctorQuery, [medicalLicenseNumber]);
    
    if (doctorResult.length === 0) {
      return res.status(404).json({ error: "Doctor not found" });
    }
    
    const doctorId = doctorResult[0].id;

    // Get notifications for the doctor
    const query = `
      SELECT n.id AS notification_id, n.message, n.created_at, n.type, n.isRead,
             a.name AS patient_name, a.date AS appointment_date, a.time AS appointment_time
      FROM notifications n
      LEFT JOIN appointments a ON n.appointmentId = a.id
      WHERE n.doctorId = ?
      ORDER BY n.created_at DESC
    `;

    console.log("Executing notifications query for doctorId:", doctorId);
    const notifications = await executeQuery(query, [doctorId]);
    console.log("Fetched notifications:", notifications);

    res.status(200).json({ notifications });
  } catch (error) {
    console.error("❌ Error fetching notifications:", error);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});

// ✅ **Route to create a notification**
router.post("/", async (req, res) => {
  try {
    const { userId, message } = req.body;

    if (!userId || !message) {
      return res
        .status(400)
        .json({ error: "User ID and message are required" });
    }

    const query = `
      INSERT INTO notifications (userId, message, created_at)
      VALUES (?, ?, NOW())
    `;

    const result = await executeQuery(query, [userId, message]);
    res.status(201).json({
      message: "✅ Notification created successfully",
      notificationId: result.insertId,
    });
  } catch (error) {
    console.error("❌ Error inserting notification:", error);
    res.status(500).json({ error: "Failed to create notification" });
  }
});

// ✅ **Helper function to execute MySQL queries**
function executeQuery(query, values) {
  return new Promise((resolve, reject) => {
    db.query(query, values, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
}

module.exports = router;
