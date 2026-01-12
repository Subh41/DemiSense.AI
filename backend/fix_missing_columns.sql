-- ========================================
-- FIX MISSING COLUMNS MIGRATION
-- ========================================

USE alzheimer;

-- Add missing userId column to doctors table if it doesn't exist
ALTER TABLE doctors 
ADD COLUMN IF NOT EXISTS userId INT NULL AFTER id,
ADD FOREIGN KEY IF NOT EXISTS (userId) REFERENCES users(id) ON DELETE SET NULL;

-- Add missing userId column to patients table if it doesn't exist
ALTER TABLE patients 
ADD COLUMN IF NOT EXISTS userId INT NULL AFTER id,
ADD FOREIGN KEY IF NOT EXISTS (userId) REFERENCES users(id) ON DELETE SET NULL;

-- Add indexes for userId columns if they don't exist
ALTER TABLE doctors 
ADD INDEX IF NOT EXISTS idx_doctors_userId (userId);

ALTER TABLE patients 
ADD INDEX IF NOT EXISTS idx_patients_userId (userId);

-- Update sample data to link users with doctors and patients
UPDATE doctors SET userId = 2 WHERE email = 'doctor@demisense.ai';
UPDATE patients SET userId = 3 WHERE email = 'patient@demisense.ai';

-- Insert corresponding user records for doctor and patient
INSERT IGNORE INTO users (id, email, password, userType, medicalLicenseNumber) 
VALUES 
(2, 'doctor@demisense.ai', '$2b$10$example_hash', 'doctor', 'MD123456'),
(3, 'patient@demisense.ai', '$2b$10$example_hash', 'patient', NULL);
