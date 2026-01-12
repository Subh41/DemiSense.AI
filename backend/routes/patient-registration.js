const express = require("express");
const router = express.Router();

// Simple patient registration form page
router.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>Patient Registration - DemiSense.AI</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
            .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            h1 { color: #4A90E2; text-align: center; margin-bottom: 30px; }
            .form-group { margin-bottom: 20px; }
            label { display: block; margin-bottom: 5px; font-weight: bold; color: #333; }
            input, select, textarea { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; font-size: 16px; }
            button { background: #4A90E2; color: white; padding: 12px 24px; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; width: 100%; }
            button:hover { background: #357ABD; }
            .back-link { text-align: center; margin-top: 20px; }
            .back-link a { color: #4A90E2; text-decoration: none; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Patient Registration</h1>
            <form action="/api/patients/add" method="POST">
                <div class="form-group">
                    <label for="firstName">First Name</label>
                    <input type="text" id="firstName" name="firstName" required>
                </div>
                <div class="form-group">
                    <label for="lastName">Last Name</label>
                    <input type="text" id="lastName" name="lastName" required>
                </div>
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" name="email" required>
                </div>
                <div class="form-group">
                    <label for="phone">Phone</label>
                    <input type="tel" id="phone" name="phone" required>
                </div>
                <div class="form-group">
                    <label for="dob">Date of Birth</label>
                    <input type="date" id="dob" name="dob" required>
                </div>
                <div class="form-group">
                    <label for="gender">Gender</label>
                    <select id="gender" name="gender" required>
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="height">Height (cm)</label>
                    <input type="text" id="height" name="height">
                </div>
                <div class="form-group">
                    <label for="weight">Weight (kg)</label>
                    <input type="text" id="weight" name="weight">
                </div>
                <div class="form-group">
                    <label for="bloodGroup">Blood Group</label>
                    <select id="bloodGroup" name="bloodGroup">
                        <option value="">Select Blood Group</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="address">Address</label>
                    <textarea id="address" name="address" rows="3"></textarea>
                </div>
                <div class="form-group">
                    <label for="medicalHistory">Medical History</label>
                    <textarea id="medicalHistory" name="medicalHistory" rows="4"></textarea>
                </div>
                <div class="form-group">
                    <label for="allergies">Allergies</label>
                    <textarea id="allergies" name="allergies" rows="2"></textarea>
                </div>
                <div class="form-group">
                    <label for="currentMedications">Current Medications</label>
                    <textarea id="currentMedications" name="currentMedications" rows="2"></textarea>
                </div>
                <button type="submit">Register Patient</button>
            </form>
            <div class="back-link">
                <a href="http://localhost:3000/doctor-main-profile">← Back to Doctor Dashboard</a>
            </div>
        </div>
    </body>
    </html>
  `);
});

module.exports = router;
