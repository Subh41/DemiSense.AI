//// filepath: /c:/Users/soumy/OneDrive/Pictures/Documents/Desktop/alzheimer/DemiSense.AI/mmy-hackathon-project/src/components/AppointmentDetailsModal.js
import React, { useState, useMemo } from "react";
import {
  Calendar,
  Clock,
  User,
  Phone,
  MessageSquare,
  Stethoscope,
  X,
  FileText,
} from "lucide-react";

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    backgroundColor: "white",
    borderRadius: "0.75rem",
    padding: "2rem",
    width: "80vw",
    overflow: "scroll",
    height: "80vh",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  closeButton: {
    background: "none",
    border: "none",
    cursor: "pointer",
    position: "absolute",
    top: "1rem",
    right: "1rem",
  },
  title: {
    marginBottom: "1rem",
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "#2563EB",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  formGroup: {
    marginBottom: "1rem",
  },
  label: {
    display: "flex",
    alignItems: "center",
    marginBottom: "0.5rem",
  },
  input: {
    padding: "0.5rem",
    borderRadius: "0.25rem",
    border: "1px solid #ccc",
    width: "80%",
  },
  select: {
    padding: "0.5rem",
    borderRadius: "0.25rem",
    border: "1px solid #ccc",
    width: "80%",
  },
  textarea: {
    padding: "0.5rem",
    borderRadius: "0.25rem",
    border: "1px solid #ccc",
    width: "100%",
    minHeight: "40px",
  },
  timeSlots: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.5rem",
  },
  timeSlot: {
    padding: "0.5rem 1rem",
    borderRadius: "0.25rem",
    border: "1px solid #ccc",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  selectedTimeSlot: {
    backgroundColor: "#2563eb",
    color: "white",
    border: "1px solid #2563eb",
  },
  submitButton: {
    backgroundColor: "#007BFF",
    color: "white",
    padding: "0.75rem 1.5rem",
    borderRadius: "0.5rem",
    border: "none",
    cursor: "pointer",
    transition: "background-color 0.3s, transform 0.2s",
    fontSize: "1rem",
    fontWeight: "600",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
};

const AppointmentDetailsModal = ({ onAppointmentBooked, onClose, doctors }) => {
  const [formData, setFormData] = useState({
    specialization: "",
    doctor: "",
    date: "",
    time: "",
    name: "",
    phone: "",
    symptoms: "",
    medicalHistory: "",
    medications: "",
    allergies: "",
  });

  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [errors, setErrors] = useState({});
  // Add after other useState declarations
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [notification, setNotification] = useState('');

  // Add these handler functions before the return statement
  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);
    setFormData({ ...formData, doctor });
    setErrors({ ...errors, doctor: undefined });
  };

  // Replace the existing specializations array
  const specializations = [
    { name: 'General Medicine', doctors: ['Dr. John Smith', 'Dr. Jane Doe'] },
    { name: 'Cardiology', doctors: ['Dr. Emily Johnson', 'Dr. Michael Brown'] },
    { name: 'Dermatology', doctors: ['Dr. Sarah Wilson', 'Dr. David Lee'] },
    { name: 'Orthopedics', doctors: ['Dr. Chris Evans', 'Dr. Natalie Portman'] },
    { name: 'Pediatrics', doctors: ['Dr. Robert Downey', 'Dr. Scarlett Johansson'] },
    { name: 'Neurology', doctors: ['Dr. Tom Hanks', 'Dr. Meryl Streep'] },
    { name: 'Gynecology', doctors: ['Dr. Anne Hathaway', 'Dr. Hugh Jackman'] },
    { name: 'Ophthalmology', doctors: ['Dr. Chris Hemsworth', 'Dr. Gal Gadot'] },
    { name: 'ENT', doctors: ['Dr. Will Smith', 'Dr. Jennifer Aniston'] },
    { name: 'Dentistry', doctors: ['Dr. Dwayne Johnson', 'Dr. Emma Watson'] }
  ];

  const minDate = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + 4);
    return date.toISOString().split("T")[0];
  }, []);

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

  const validateForm = () => {
    let newErrors = {};
    if (!formData.specialization) newErrors.specialization = "Specialization is required";
    if (!formData.doctor) newErrors.doctor = "Please select a doctor";
    if (!formData.date) newErrors.date = "Appointment date is required";
    if (!formData.time) newErrors.time = "Please select a time slot";
    if (!formData.name) newErrors.name = "Full name is required";
    if (!formData.phone || !/^\d{10}$/.test(formData.phone)) newErrors.phone = "Valid phone number is required";
    if (!formData.symptoms) newErrors.symptoms = "Symptoms are required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const appointmentDetails = {
        ...formData,
        id: Date.now(), // using timestamp as an id
        status: "Scheduled",
        // For demonstration, a static doctor identifier is used.
        // In a real app, pass the current doctor's license number.
        medicalLicenseNumber: 1,
        patient_id: "0",
      };

      try {
        console.log("Booking Appointment:", appointmentDetails);
        const response = await fetch(
          "http://localhost:5000/api/appointments/book",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(appointmentDetails),
          }
        );
        const result = await response.json();
        if (response.ok) {
          console.log("✅ Appointment booked successfully:", result);
        } else {
          console.error("❌ Failed to book appointment:", result.error);
        }
      } catch (error) {
        console.error("❌ Error booking appointment:", error);
      }
      onAppointmentBooked(appointmentDetails);
      onClose(); // Close the modal after booking
    }
  };

  const handleTimeSlotSelect = (time) => {
    setSelectedTimeSlot(time);
    setFormData({ ...formData, time });
    setErrors({ ...errors, time: undefined });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  return (
    <div
      style={styles.overlay}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={styles.modal}>
        <button onClick={onClose} style={styles.closeButton}>
          <X size={24} />
        </button>

        <h2 style={styles.title}>Schedule Your Appointment</h2>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>
              <Stethoscope size={20} color="#2563EB" />
              Medical Specialty
            </label>
            <select
              value={formData.specialization}
              onChange={(e) => {
                const selectedSpec = e.target.value;
                setFormData({ ...formData, specialization: selectedSpec, doctor: '' });
                setSelectedDoctor('');
                setErrors({ ...errors, specialization: undefined });
              }}
              style={styles.select}
              required
            >
              <option value="">Select Specialty</option>
              {specializations.map((spec) => (
                <option key={spec.name} value={spec.name}>
                  {spec.name}
                </option>
              ))}
            </select>
            {errors.specialization && (
              <span style={{ color: "red" }}>{errors.specialization}</span>
            )}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>
              <User size={20} color="#2563EB" />
              Available Doctors
            </label>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {specializations
                .find(spec => spec.name === formData.specialization)
                ?.doctors.map((doctor) => (
                <li
                  key={doctor}
                  onClick={() => handleDoctorSelect(doctor)}
                  style={{
                    cursor: 'pointer',
                    padding: '8px',
                    margin: '4px 0',
                    backgroundColor: selectedDoctor === doctor ? '#EBF5FF' : 'transparent',
                    borderRadius: '4px',
                    color: selectedDoctor === doctor ? '#2563EB' : 'black'
                  }}
                >
                  {doctor}
                </li>
              ))}
            </ul>
            {errors.doctor && <span style={{ color: "red" }}>{errors.doctor}</span>}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>
              <Calendar size={20} color="#2563EB" />
              Appointment Date
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => {
                setFormData({ ...formData, date: e.target.value });
                setErrors({ ...errors, date: undefined });
              }}
              style={styles.input}
              min={minDate}
              required
            />
            {errors.date && <span style={{ color: "red" }}>{errors.date}</span>}
          </div>

          <div style={{ ...styles.formGroup, ...styles.fullWidth }}>
            <label style={styles.label}>
              <Clock size={20} color="#2563EB" />
              Available Time Slots
            </label>
            <div style={styles.timeSlots}>
              {timeSlots.map((time) => (
                <div
                  key={time}
                  onClick={() => handleTimeSlotSelect(time)}
                  style={{
                    ...styles.timeSlot,
                    ...(selectedTimeSlot === time
                      ? styles.selectedTimeSlot
                      : {}),
                  }}
                >
                  {time}
                </div>
              ))}
            </div>
            {errors.time && <span style={{ color: "red" }}>{errors.time}</span>}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>
              <User size={20} color="#2563EB" />
              Full Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                setErrors({ ...errors, name: undefined });
              }}
              style={styles.input}
              required
            />
            {errors.name && <span style={{ color: "red" }}>{errors.name}</span>}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>
              <Phone size={20} color="#2563EB" />
              Phone Number
            </label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => {
                setFormData({ ...formData, phone: e.target.value });
                setErrors({ ...errors, phone: undefined });
              }}
              style={styles.input}
              required
            />
            {errors.phone && (
              <span style={{ color: "red" }}>{errors.phone}</span>
            )}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>
              <MessageSquare size={20} color="#2563EB" />
              Symptoms
            </label>
            <textarea
              value={formData.symptoms}
              onChange={(e) => {
                setFormData({ ...formData, symptoms: e.target.value });
                setErrors({ ...errors, symptoms: undefined });
              }}
              style={styles.textarea}
              required
            />
            {errors.symptoms && (
              <span style={{ color: "red" }}>{errors.symptoms}</span>
            )}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>
              <FileText size={20} color="#2563EB" />
              Medical History (Optional)
            </label>
            <textarea
              value={formData.medicalHistory}
              onChange={(e) =>
                setFormData({ ...formData, medicalHistory: e.target.value })
              }
              style={styles.textarea}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>
              <FileText size={20} color="#2563EB" />
              Current Medications (Optional)
            </label>
            <textarea
              value={formData.medications}
              onChange={(e) =>
                setFormData({ ...formData, medications: e.target.value })
              }
              style={styles.textarea}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>
              <FileText size={20} color="#2563EB" />
              Allergies (Optional)
            </label>
            <textarea
              value={formData.allergies}
              onChange={(e) =>
                setFormData({ ...formData, allergies: e.target.value })
              }
              style={styles.textarea}
            />
          </div>

          <button type="submit" style={styles.submitButton}>
            Book Appointment
          </button>
        </form>
      </div>
    </div>
  );
};

export default AppointmentDetailsModal;
