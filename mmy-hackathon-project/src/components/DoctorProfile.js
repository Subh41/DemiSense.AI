import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaUpload,
  FaRegTrashAlt,
  FaCamera,
  FaUserMd,
  FaUsers,
  FaPrescription,
  FaSignOutAlt,
} from "react-icons/fa";
import DoctorMainProfile from "./DoctorMainProfile";

const DoctorProfile = () => {
  const navigate = useNavigate();
  const [bio, setBio] = useState("");
  const [experience, setExperience] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [degrees, setDegrees] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [days, setDate] = useState("");
  const [showDashboard, setShowDashboard] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [selectedDate, setSelectedDate] = useState(""); // Date state

  const timeSlots = useMemo(
    () => [
      "09:00 AM",
      "09:30 AM",
      "10:00 AM",
      "10:30 AM",
      "11:00 AM",
      "11:30 AM",
      "02:00 PM",
      "02:30 PM",
      "03:00 PM",
      "03:30 PM",
      "04:00 PM",
      "04:30 PM",
    ],
    []
  );

  const handleRegister = async () => {
    const doctorData = {
      bio,
      experience,
      degrees,
      specialization,
      email,
      phone,
      consDays: days,
      consDate: selectedDate,
      timeSlot: selectedTimeSlot,
      password: "doctor123",
    };

    try {
      const response = await fetch(
        "http://localhost:5000/api/doctors/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(doctorData),
        }
      );

      const result = await response.json();
      if (response.ok) {
        console.log("Doctor registered successfully:", result);
        setShowDashboard(true);
        localStorage.setItem(
          "doctorData",
          JSON.stringify({ ...doctorData, id: result.id })
        ); // Store doctor ID
        navigate("/doctor-main-profile");
      } else {
        console.error("Error registering doctor:", result.error);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Doctor Profile</h1>

      <div style={styles.section}>
        <h2 style={styles.subHeader}>Upload Image</h2>
        <label style={styles.uploadLabel}>
          <FaCamera style={styles.icon} /> Click to Upload
          <input type="file" accept="image/*" style={styles.fileInput} />
        </label>
      </div>

      <div style={styles.section}>
        <h2 style={styles.subHeader}>Email</h2>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          style={styles.input}
        />
      </div>

      <div style={styles.section}>
        <h2 style={styles.subHeader}>Phone Number</h2>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Enter your phone number"
          style={styles.input}
        />
      </div>

      <div style={styles.section}>
        <h2 style={styles.subHeader}>Bio</h2>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Enter your bio"
          style={styles.textarea}
        />
      </div>

      <div style={styles.section}>
        <h2 style={styles.subHeader}>Experience</h2>
        <input
          type="text"
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          placeholder="Enter your experience"
          style={styles.input}
        />
      </div>

      <div style={styles.section}>
        <h2 style={styles.subHeader}>Upload Certifications</h2>
        <label style={styles.uploadLabel}>
          <FaUpload style={styles.icon} /> Choose Files
          <input type="file" multiple style={styles.fileInput} />
        </label>
      </div>

      <div style={styles.section}>
        <h2 style={styles.subHeader}>Degrees</h2>
        <input
          type="text"
          value={degrees}
          onChange={(e) => setDegrees(e.target.value)}
          placeholder="Enter your degrees"
          style={styles.input}
        />
      </div>

      <div style={styles.section}>
        <h2 style={styles.subHeader}>Specialization</h2>
        <select
          value={specialization}
          onChange={(e) => setSpecialization(e.target.value)}
          style={styles.select}
        >
          <option value="">Select your specialization</option>
          <option value="cardiologist">Cardiologist</option>
          <option value="dermatologist">Dermatologist</option>
          <option value="neurologist">Neurologist</option>
          <option value="pediatrician">Pediatrician</option>
          <option value="orthopedic">Orthopedic</option>
          <option value="general practitioner">General Practitioner</option>
        </select>
      </div>

      <div style={styles.section}>
        <h2 style={styles.subHeader}>Consultation Days</h2>
        <select
          value={days}
          onChange={(e) => setDate(e.target.value)}
          style={styles.select}
        >
          <option value="">Select your consultation days</option>
          <option value="Monday">Monday</option>
          <option value="Tuesday">Tuesday</option>
          <option value="Wednesday">Wednesday</option>
          <option value="Thursday">Thursday</option>
          <option value="Friday">Friday</option>
          <option value="Saturday">Saturday</option>
        </select>
      </div>

      {/* Section for Date Picker and Time Slot Selection */}
      <div style={styles.section}>
        <h2 style={styles.subHeader}>Select Consultation Date</h2>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          style={styles.input}
        />
      </div>

      <div style={styles.section}>
        <h2 style={styles.subHeader}>Select Time Slot</h2>
        <select
          value={selectedTimeSlot}
          onChange={(e) => setSelectedTimeSlot(e.target.value)}
          style={styles.select}
        >
          <option value="">Select a time slot</option>
          {timeSlots.map((slot, index) => (
            <option key={index} value={slot}>
              {slot}
            </option>
          ))}
        </select>
      </div>

      <button onClick={handleRegister} style={styles.registerButton}>
        Register Profile
      </button>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "600px",
    margin: "0 auto",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#fff",
    fontFamily: "Arial, sans-serif",
    animation: "fadeIn 0.6s ease-in-out",
  },
  header: {
    textAlign: "center",
    color: "#4A90E2",
    fontSize: "2.5rem",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  subHeader: {
    color: "#4A90E2",
    fontSize: "1.2rem",
    fontWeight: "bold",
  },
  section: {
    marginBottom: "20px",
  },
  textarea: {
    width: "100%",
    height: "100px",
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "16px",
    backgroundColor: "#f9f9f9",
    boxShadow: "inset 0 0 6px rgba(0, 0, 0, 0.1)",
    transition: "border-color 0.3s",
  },
  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "16px",
    backgroundColor: "#f9f9f9",
    boxShadow: "inset 0 0 6px rgba(0, 0, 0, 0.1)",
    transition: "border-color 0.3s",
  },
  select: {
    width: "100%",
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    backgroundColor: "#f9f9f9",
    fontSize: "16px",
  },
  fileInput: {
    display: "none",
  },
  uploadLabel: {
    display: "inline-flex",
    alignItems: "center",
    backgroundColor: "#4A90E2",
    color: "#fff",
    padding: "8px 20px",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    marginTop: "10px",
  },
  icon: {
    marginRight: "8px",
    fontSize: "18px",
  },
  registerButton: {
    width: "100%",
    backgroundColor: "#4CAF50",
    color: "#fff",
    padding: "12px",
    border: "none",
    borderRadius: "6px",
    fontSize: "18px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "background-color 0.3s",
    marginTop: "20px",
    ":hover": {
      backgroundColor: "#45a049",
    },
  },
};

export default DoctorProfile;
