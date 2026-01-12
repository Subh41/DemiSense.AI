-- ========================================
-- DemiSense.AI - Complete Database Schema
-- ========================================

-- Create database if not exists
CREATE DATABASE IF NOT EXISTS alzheimer;
USE alzheimer;

-- ========================================
-- 1. USERS TABLE (for authentication)
-- ========================================
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    userType ENUM('patient', 'doctor') NOT NULL,
    medicalLicenseNumber VARCHAR(100) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_users_email (email),
    INDEX idx_users_type (userType),
    INDEX idx_users_license (medicalLicenseNumber)
);

-- ========================================
-- 2. PATIENTS TABLE (extended patient profiles)
-- ========================================
CREATE TABLE IF NOT EXISTS patients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NULL,
    firstName VARCHAR(100) NOT NULL,
    lastName VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    dob DATE NULL,
    gender ENUM('Male', 'Female', 'Other') NULL,
    height DECIMAL(5,2) NULL,
    weight DECIMAL(5,2) NULL,
    bloodGroup VARCHAR(10) NULL,
    address TEXT NULL,
    medicalHistory TEXT NULL,
    allergies TEXT NULL,
    currentMedications TEXT NULL,
    profileImage VARCHAR(500) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_patients_userId (userId),
    INDEX idx_patients_email (email)
);

-- ========================================
-- 3. DOCTORS TABLE (extended doctor profiles)
-- ========================================
CREATE TABLE IF NOT EXISTS doctors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NULL,
    bio TEXT NULL,
    experience INT NULL,
    degrees VARCHAR(500) NULL,
    certificates VARCHAR(500) NULL,
    specialization VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    medicalLicenseNumber VARCHAR(100) UNIQUE NOT NULL,
    consDays VARCHAR(100) NULL,
    consDate VARCHAR(100) NULL,
    timeSlot VARCHAR(100) NULL,
    profileImage VARCHAR(500) NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_doctors_userId (userId),
    INDEX idx_doctors_email (email),
    INDEX idx_doctors_license (medicalLicenseNumber),
    INDEX idx_doctors_specialization (specialization)
);

-- ========================================
-- 4. APPOINTMENTS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    specialization VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    doctorId INT NOT NULL,
    patient_id INT NOT NULL,
    medicalLicenseNumber VARCHAR(100) NOT NULL,
    status ENUM('pending', 'confirmed', 'cancelled', 'completed') DEFAULT 'pending',
    notes TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (doctorId) REFERENCES doctors(id) ON DELETE CASCADE,
    FOREIGN KEY (medicalLicenseNumber) REFERENCES doctors(medicalLicenseNumber),
    FOREIGN KEY (patient_id) REFERENCES patients(id),
    INDEX idx_appointments_patient (patient_id),
    INDEX idx_appointments_doctor (doctorId),
    INDEX idx_appointments_license (medicalLicenseNumber),
    INDEX idx_appointments_date (date),
    INDEX idx_appointments_status (status)
);

-- ========================================
-- 5. NOTIFICATIONS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NULL,
    doctorId INT NULL,
    message TEXT NOT NULL,
    type ENUM('appointment', 'system', 'message') DEFAULT 'system',
    isRead BOOLEAN DEFAULT FALSE,
    appointmentId INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (doctorId) REFERENCES doctors(id) ON DELETE SET NULL,
    FOREIGN KEY (appointmentId) REFERENCES appointments(id) ON DELETE SET NULL,
    INDEX idx_notifications_user (userId),
    INDEX idx_notifications_doctor (doctorId),
    INDEX idx_notifications_read (isRead)
);

-- ========================================
-- 6. FEEDBACK TABLE (for appointment feedback)
-- ========================================
CREATE TABLE IF NOT EXISTS feedback (
    id INT AUTO_INCREMENT PRIMARY KEY,
    appointmentId INT NOT NULL,
    patientId INT NOT NULL,
    doctorId INT NOT NULL,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    feedbackText TEXT NOT NULL,
    feedbackDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    isPublic BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (appointmentId) REFERENCES appointments(id) ON DELETE CASCADE,
    FOREIGN KEY (patientId) REFERENCES patients(id) ON DELETE CASCADE,
    FOREIGN KEY (doctorId) REFERENCES doctors(id) ON DELETE CASCADE
);

-- ========================================
-- 7. MESSAGES TABLE (for doctor-patient messaging)
-- ========================================
CREATE TABLE IF NOT EXISTS messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    senderId INT NOT NULL,
    receiverId INT NOT NULL,
    senderType ENUM('patient', 'doctor') NOT NULL,
    receiverType ENUM('patient', 'doctor') NOT NULL,
    message TEXT NOT NULL,
    appointmentId INT NULL,
    isRead BOOLEAN DEFAULT FALSE,
    messageType ENUM('text', 'file', 'image') DEFAULT 'text',
    attachmentUrl VARCHAR(500) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (senderId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (receiverId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (appointmentId) REFERENCES appointments(id) ON DELETE SET NULL,
    INDEX idx_messages_sender (senderId),
    INDEX idx_messages_receiver (receiverId),
    INDEX idx_messages_read (isRead)
);

-- ========================================
-- 8. TOKEN_WALLET TABLE (for scan tokens)
-- ========================================
CREATE TABLE IF NOT EXISTS token_wallet (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    tokensAvailable INT DEFAULT 1,
    tokensUsed INT DEFAULT 0,
    lastRefillDate DATE NULL,
    subscriptionStatus ENUM('free', 'premium', 'trial') DEFAULT 'free',
    subscriptionExpiryDate DATE NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- ========================================
-- 9. SCAN_ANALYSIS TABLE (for CT scan results)
-- ========================================
CREATE TABLE IF NOT EXISTS scan_analysis (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patientId INT NOT NULL,
    fileName VARCHAR(255) NOT NULL,
    disorderType VARCHAR(100) NOT NULL,
    accuracy VARCHAR(10) NOT NULL,
    confidence VARCHAR(20) NOT NULL,
    findings JSON NOT NULL,
    recommendations JSON NOT NULL,
    analysisDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reportGenerated BOOLEAN DEFAULT FALSE,
    reportPath VARCHAR(500) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patientId) REFERENCES patients(id) ON DELETE CASCADE,
    INDEX idx_scan_patient (patientId),
    INDEX idx_scan_disorder (disorderType)
);

-- ========================================
-- 10. BLOG_POSTS TABLE (for blog functionality)
-- ========================================
CREATE TABLE IF NOT EXISTS blog_posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    authorId INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    excerpt VARCHAR(500) NULL,
    featuredImage VARCHAR(500) NULL,
    status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    category VARCHAR(100) NULL,
    tags VARCHAR(500) NULL,
    viewCount INT DEFAULT 0,
    likeCount INT DEFAULT 0,
    publishedAt TIMESTAMP NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (authorId) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_blog_author (authorId),
    INDEX idx_blog_status (status),
    INDEX idx_blog_published (publishedAt)
);

-- ========================================
-- 11. DONATIONS TABLE (for donation tracking)
-- ========================================
CREATE TABLE IF NOT EXISTS donations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    donorId INT NULL,
    amount DECIMAL(10,2) NOT NULL,
    donationType ENUM('one_time', 'monthly') DEFAULT 'one_time',
    purpose VARCHAR(255) NULL,
    message TEXT NULL,
    isAnonymous BOOLEAN DEFAULT FALSE,
    transactionId VARCHAR(255) NULL,
    status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (donorId) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_donations_status (status),
    INDEX idx_donations_created (createdAt)
);

-- ========================================
-- 12. EDUCATIONAL_CONTENT TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS educational_content (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    contentType ENUM('article', 'video', 'infographic') DEFAULT 'article',
    category VARCHAR(100) NOT NULL,
    difficulty ENUM('beginner', 'intermediate', 'advanced') DEFAULT 'beginner',
    estimatedReadTime INT NULL,
    featuredImage VARCHAR(500) NULL,
    videoUrl VARCHAR(500) NULL,
    authorId INT NOT NULL,
    viewCount INT DEFAULT 0,
    isPublished BOOLEAN DEFAULT FALSE,
    publishedAt TIMESTAMP NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (authorId) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_educational_author (authorId),
    INDEX idx_educational_category (category),
    INDEX idx_educational_published (isPublished)
);

-- ========================================
-- INDEXES FOR PERFORMANCE
-- ========================================

-- Users table indexes (email, type, license already indexed inline in users table)

-- Patients table indexes (email, userId already indexed inline in patients table)

-- Doctors table indexes (email, license, specialization already indexed inline in doctors table)

-- Appointments table indexes (patient, doctor, license, date, status already indexed inline in appointments table)

-- Additional indexes for performance optimization
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_created ON notifications(created_at);

CREATE INDEX idx_messages_type ON messages(messageType);
CREATE INDEX idx_messages_created ON messages(created_at);

CREATE INDEX idx_scan_analysis_date ON scan_analysis(analysisDate);

CREATE INDEX idx_blog_status ON blog_posts(status);
CREATE INDEX idx_blog_published ON blog_posts(publishedAt);

CREATE INDEX idx_educational_category ON educational_content(category);
CREATE INDEX idx_educational_published ON educational_content(isPublished);

CREATE INDEX idx_donations_status ON donations(status);
CREATE INDEX idx_donations_created ON donations(createdAt);

-- ========================================
-- SAMPLE DATA (Optional - for testing)
-- ========================================

-- Insert sample admin user
INSERT IGNORE INTO users (email, password, userType, medicalLicenseNumber) 
VALUES ('admin@demisense.ai', '$2b$10$example_hash', 'admin', NULL);

-- Insert sample users for doctor and patient
INSERT IGNORE INTO users (email, password, userType, medicalLicenseNumber) 
VALUES 
('doctor@demisense.ai', '$2b$10$example_hash', 'doctor', 'MD123456'),
('patient@demisense.ai', '$2b$10$example_hash', 'patient', NULL);

-- Insert sample doctor (link to user if userId column exists)
INSERT IGNORE INTO doctors (bio, experience, degrees, specialization, email, phone, medicalLicenseNumber, password)
VALUES ('Experienced neurologist specializing in brain disorders', 10, 'MD, PhD', 'Neurology', 'doctor@demisense.ai', '+1234567890', 'MD123456', '$2b$10$example_hash');

-- Insert sample patient (link to user if userId column exists)
INSERT IGNORE INTO patients (firstName, lastName, email, phone, dob, gender)
VALUES ('John', 'Doe', 'patient@demisense.ai', '+1234567890', '1990-01-01', 'Male');

-- Link users to doctor and patient records (this will work if userId columns exist)
UPDATE doctors SET userId = (SELECT id FROM users WHERE email = 'doctor@demisense.ai' AND userType = 'doctor') WHERE email = 'doctor@demisense.ai';
UPDATE patients SET userId = (SELECT id FROM users WHERE email = 'patient@demisense.ai' AND userType = 'patient') WHERE email = 'patient@demisense.ai';

-- ========================================
-- NOTES FOR DEVELOPERS
-- ========================================

/*
1. All tables use InnoDB engine for foreign key support
2. All tables have created_at and updated_at timestamps
3. Foreign key constraints ensure data integrity
4. Indexes are added for frequently queried columns
5. JSON columns are used for flexible data storage (findings, recommendations)
6. ENUM types are used for controlled vocabularies
7. Passwords should be hashed using bcrypt before storing
8. All dates are in YYYY-MM-DD format
9. All timestamps are in UTC by default
10. Consider adding more indexes based on query patterns
*/
