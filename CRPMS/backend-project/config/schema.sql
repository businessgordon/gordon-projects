-- Create and use database
CREATE DATABASE IF NOT EXISTS CRPMS;
USE CRPMS;

-- Users table
CREATE TABLE IF NOT EXISTS User (
  UserID INT AUTO_INCREMENT PRIMARY KEY,
  Username VARCHAR(100) NOT NULL UNIQUE,
  Password VARCHAR(255) NOT NULL,
  FullName VARCHAR(150),
  CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Services table
CREATE TABLE IF NOT EXISTS Services (
  ServiceCode VARCHAR(20) PRIMARY KEY,
  ServiceName VARCHAR(100) NOT NULL,
  ServicePrice DECIMAL(12,2) NOT NULL
);

-- Car table
CREATE TABLE IF NOT EXISTS Car (
  PlateNumber VARCHAR(20) PRIMARY KEY,
  Type VARCHAR(50) NOT NULL,
  Model VARCHAR(100) NOT NULL,
  ManufacturingYear INT NOT NULL,
  DriverPhone VARCHAR(20) NOT NULL,
  MechanicName VARCHAR(100) NOT NULL
);

-- ServiceRecord table
CREATE TABLE IF NOT EXISTS ServiceRecord (
  RecordNumber INT AUTO_INCREMENT PRIMARY KEY,
  ServiceDate DATE NOT NULL,
  PlateNumber VARCHAR(20) NOT NULL,
  ServiceCode VARCHAR(20) NOT NULL,
  FOREIGN KEY (PlateNumber) REFERENCES Car(PlateNumber) ON DELETE CASCADE,
  FOREIGN KEY (ServiceCode) REFERENCES Services(ServiceCode) ON DELETE CASCADE
);

-- Payment table
CREATE TABLE IF NOT EXISTS Payment (
  PaymentNumber INT AUTO_INCREMENT PRIMARY KEY,
  AmountPaid DECIMAL(12,2) NOT NULL,
  PaymentDate DATE NOT NULL,
  RecordNumber INT NOT NULL,
  UserID INT,
  FOREIGN KEY (RecordNumber) REFERENCES ServiceRecord(RecordNumber) ON DELETE CASCADE,
  FOREIGN KEY (UserID) REFERENCES User(UserID) ON DELETE SET NULL
);

-- Seed services
INSERT IGNORE INTO Services (ServiceCode, ServiceName, ServicePrice) VALUES
  ('SRV001', 'Engine Repair', 150000),
  ('SRV002', 'Transmission Repair', 80000),
  ('SRV003', 'Oil Change', 60000),
  ('SRV004', 'Chain Replacement', 40000),
  ('SRV005', 'Disc Replacement', 400000),
  ('SRV006', 'Wheel Alignment', 5000);
