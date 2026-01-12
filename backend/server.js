

const express = require("express");
const cors = require("cors");
const http = require("http");
const authRoutes = require("./routes/authroutes");
const patientRoutes = require("./routes/patients");
const doctorRoutes = require("./routes/doctors");
const appointmentRoutes = require("./routes/appointments");
const notificationRoutes = require("./routes/notifications");
const patientRegistrationRoute = require("./routes/patient-registration");
const db = require("./config/db");

const app = express();
const server = http.createServer(app);

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/patient-registration", patientRegistrationRoute);

app.get("/", (req, res) => {
  res.send("API is running...");
});

// Start the server
server.listen(5000, "0.0.0.0", () => {
  console.log("✅ Backend server is running on http://localhost:5000/");
});