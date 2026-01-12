# 🧠 DemiSense.AI

> **Advanced AI-Powered Medical Platform for Brain Disorder Detection and Healthcare Management**

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/react-18+-blue.svg)](https://reactjs.org/)
[![MySQL](https://img.shields.io/badge/mysql-8.0+-orange.svg)](https://www.mysql.com/)

---

## 🌟 **Overview**

DemiSense.AI is a comprehensive medical AI platform that provides early detection of brain disorders through CT scan analysis, complete healthcare management, and telemedicine services. Our platform leverages advanced deep learning models to analyze medical images and generate detailed diagnostic reports.

### 🎯 **Key Features**

- 🧠 **AI-Powered CT Scan Analysis** - Deep learning models for brain disorder detection
- 📄 **Professional PDF Reports** - Medical reports with site details and prescriptions
- 👥 **Multi-Role System** - Separate interfaces for patients and doctors
- 📅 **Appointment Management** - Real-time booking and notifications
- 💬 **Secure Messaging** - Doctor-patient communication system
- 🪙 **Token-Based System** - Scan credits and subscription management
- 📚 **Educational Content** - Medical resources and blog platform
- 🚨 **Emergency Portal** - Urgent medical assistance
- 💝 **Donation System** - Platform support and funding

---

## 🏗️ **Architecture**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Frontend │◄──►│  Node.js Backend│◄──►│   MySQL Database│
│                 │    │                 │    │                 │
│ • CT Scan Upload│    │ • RESTful API   │    │ • 12 Tables     │
│ • User Profiles │    │ • JWT Auth      │    │ • Foreign Keys  │
│ • Real-time UI  │    │ • Socket.io     │    │ • Indexes       │
│ • PDF Reports   │    │ • File Upload   │    │ • Sample Data   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

---

## 🚀 **Quick Start**

### Prerequisites

- Node.js 18+ 
- MySQL 8.0+
- npm or yarn

### 1. Clone the repository
git clone https://github.com/your-username/DemiSense.AI.git
cd DemiSense.AI

### 2. Database Setup

```bash
# Login to MySQL
mysql -u root -p

# Create database
CREATE DATABASE alzheimer;
USE alzheimer;

# Import database schema
SOURCE backend/database_schema.sql;

# If upgrading existing database
SOURCE backend/fix_missing_columns.sql;
```

### **3. Backend Setup**

```bash
cd backend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your database credentials

# Start development server
npm run dev
# or production
npm start
```

Backend will run on: `http://localhost:5000`

### **4. Frontend Setup**

```bash
cd mmy-hackathon-project

# Install dependencies
npm install

# Start development server
npm start
```

Frontend will run on: `http://localhost:3000`

---

## 📁 **Project Structure**

```
DemiSense.AI-master/
├── 📂 mmy-hackathon-project/          # React Frontend
│   ├── 📂 src/
│   │   ├── 📂 components/              # 20+ React Components
│   │   │   ├── CTScanUpload.js       # CT Scan Analysis
│   │   │   ├── PatientProfile.js     # Patient Management
│   │   │   ├── DoctorProfile.js      # Doctor Dashboard
│   │   │   ├── AppointmentDetailsModal.js
│   │   │   ├── EmergencyPortal.js     # Emergency Services
│   │   │   └── ...                    # Other components
│   │   ├── 📂 pages/                  # Page Components
│   │   │   ├── Home.js               # Landing Page
│   │   │   └── NotFound.js           # 404 Page
│   │   ├── App.js                     # Main App with Routing
│   │   └── index.js                   # App Entry Point
│   ├── 📂 public/
│   │   └── index.html                 # HTML Template
│   └── package.json                   # Frontend Dependencies
├── 📂 backend/                         # Node.js Backend
│   ├── 📂 routes/                      # API Routes
│   │   ├── authroutes.js              # Authentication
│   │   ├── appointments.js            # Appointment Management
│   │   ├── doctors.js                  # Doctor Profiles
│   │   ├── patients.js                 # Patient Management
│   │   ├── notifications.js           # Real-time Notifications
│   │   └── patient-registration.js    # Patient Registration
│   ├── 📂 config/
│   │   └── db.js                      # Database Configuration
│   ├── server.js                      # Main Server File
│   ├── database_schema.sql            # Complete Database Schema
│   ├── fix_missing_columns.sql        # Migration Script
│   └── package.json                   # Backend Dependencies
├── 📂 DL_Folder/                       # Deep Learning Models
│   ├── MRIvsNON-MRI.ipynb            # MRI Classification
│   └── cnn-brain.ipynb               # Brain Analysis Models
├── 📂 Blog/                           # Blog Content
├── 📄 PROJECT_STATUS.md               # Detailed Project Status
└── 📄 README.md                       # This File
```

---

## 🔧 **Technology Stack**

### **Frontend**
- **React 18.0.0** - UI Framework
- **React Router DOM 7.1.5** - Client-side Routing
- **Framer Motion 12.0.6** - Animations
- **Lucide React 0.474.0** - Icon Library
- **Axios 1.7.9** - HTTP Client
- **jsPDF 2.5.2** - PDF Generation
- **Socket.io Client 4.8.1** - Real-time Communication
- **TailwindCSS 4.0.3** - Styling Framework

### **Backend**
- **Node.js** - Runtime Environment
- **Express 4.21.2** - Web Framework
- **MySQL 2.18.1** - Database Driver
- **JWT 9.0.2** - Authentication
- **Bcrypt 5.1.1** - Password Hashing
- **Socket.io 4.8.1** - Real-time Server
- **Multer 1.4.5** - File Upload Handling
- **CORS 2.8.5** - Cross-Origin Resource Sharing

### **Database**
- **MySQL 8.0+** - Primary Database
- **12 Tables** with proper relationships
- **Foreign Key Constraints** for data integrity
- **Optimized Indexes** for performance

---

## 🎯 **Core Features**

### **🧠 CT Scan Analysis**
- Upload CT scans in multiple formats (DICOM, JPG, PNG)
- AI-powered analysis using deep learning models
- Detection of 10+ brain disorders
- Professional PDF report generation
- Accuracy metrics and confidence scores

### **👥 User Management**
- **Patient Portal**: Medical history, appointments, reports
- **Doctor Dashboard**: Patient management, schedule, analytics
- **Admin Panel**: System management and oversight
- Secure authentication with JWT tokens

### **📅 Appointment System**
- Real-time appointment booking
- Calendar integration
- Automated notifications
- Video consultation support
- Prescription management

### **💬 Communication**
- Secure doctor-patient messaging
- File sharing capabilities
- Real-time notifications
- Appointment reminders

### **📚 Educational Content**
- Medical articles and resources
- Video tutorials
- Interactive learning modules
- Expert blog posts

---

## 📊 **Database Schema**

### **Primary Tables**
- `users` - Authentication and user management
- `patients` - Patient medical records
- `doctors` - Doctor profiles and credentials
- `appointments` - Appointment scheduling
- `notifications` - Real-time alerts
- `messages` - Communication logs
- `scan_analysis` - CT scan results
- `blog_posts` - Content management
- `donations` - Payment tracking
- `educational_content` - Learning resources

### **Key Relationships**
- Users → Patients/Doctors (1:1)
- Doctors → Appointments (1:N)
- Patients → Appointments (1:N)
- Appointments → Notifications (1:N)
- Users → Messages (1:N)

---

## 🔐 **Security Features**

- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - Bcrypt encryption
- **CORS Protection** - Cross-origin security
- **Input Validation** - Data sanitization
- **File Upload Security** - Type and size validation
- **SQL Injection Prevention** - Parameterized queries

---

## 🚀 **Deployment**

### **Development Environment**
```bash
# Backend
cd backend && npm run dev

# Frontend  
cd mmy-hackathon-project && npm start
```

### **Production Environment**
```bash
# Backend
cd backend && npm start

# Frontend
cd mmy-hackathon-project && npm run build
```

### **Environment Variables**
```env
# Backend .env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=alzheimer
JWT_SECRET=your_jwt_secret
```

---

## 📱 **API Endpoints**

### **Authentication**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### **Patients**
- `POST /api/patients/add` - Add patient profile
- `GET /api/patients/profile` - Get patient profile

### **Doctors**
- `POST /api/doctors/register` - Doctor registration
- `POST /api/doctors/login` - Doctor login

### **Appointments**
- `POST /api/appointments/book` - Book appointment
- `GET /api/appointments/doctor/:license` - Get doctor appointments
- `GET /api/appointments/patient/:id` - Get patient appointments

### **Notifications**
- `GET /api/notifications/:license` - Get notifications
- `POST /api/notifications` - Create notification

---

## 🧪 **Testing**

```bash
# Frontend tests
cd mmy-hackathon-project
npm test

# Backend tests (when implemented)
cd backend
npm test
```

---

## 📈 **Performance Features**

- **Optimized Database Queries** - Indexed columns
- **Lazy Loading** - Component-level code splitting
- **Caching Strategy** - Redis integration ready
- **Image Optimization** - Compressed medical images
- **API Rate Limiting** - Prevent abuse

---

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📞 **Contact & Support**

- **Platform**: DemiSense.AI
- **Email**: subhojitdas0019@gmail.com
- **Phone**: +91 8910250019
- **Website**: www.demisense.ai

---

## 🙏 **Acknowledgments**

- Medical AI research community
- Open source contributors
- Healthcare professionals for insights
- Patients and caregivers for feedback

---

## 📊 **Project Status**

✅ **Version**: 1.0.0  
✅ **Status**: Production Ready  
✅ **Last Updated**: January 2026  
✅ **Documentation**: Complete  

---

**🚀 DemiSense.AI - Empowering Healthcare with AI**

*Making early brain disorder detection accessible to everyone*
