-- CWSMS MySQL Database schema and sample data

CREATE DATABASE IF NOT EXISTS CWSMS;
USE CWSMS;

CREATE TABLE IF NOT EXISTS Users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(128) NOT NULL,
  email VARCHAR(192) NOT NULL UNIQUE,
  password VARCHAR(256) NOT NULL,
  role ENUM('admin','manager','staff') DEFAULT 'admin',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_email (email)
);

CREATE TABLE IF NOT EXISTS Cars (
  plate_number VARCHAR(32) PRIMARY KEY,
  car_type VARCHAR(64),
  car_size VARCHAR(64),
  driver_name VARCHAR(128) NOT NULL,
  phone_number VARCHAR(32) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_driver_name (driver_name),
  INDEX idx_phone_number (phone_number)
);

CREATE TABLE IF NOT EXISTS Packages (
  package_number INT AUTO_INCREMENT PRIMARY KEY,
  package_name VARCHAR(128) NOT NULL,
  package_description TEXT,
  package_price DECIMAL(10,2) NOT NULL
);

CREATE TABLE IF NOT EXISTS ServicePackage (
  record_number INT AUTO_INCREMENT PRIMARY KEY,
  plate_number VARCHAR(32) NOT NULL,
  package_number INT NOT NULL,
  service_date DATETIME NOT NULL,
  status ENUM('Pending','Washing','Completed') DEFAULT 'Pending',
  FOREIGN KEY (plate_number) REFERENCES Cars(plate_number) ON DELETE CASCADE,
  FOREIGN KEY (package_number) REFERENCES Packages(package_number) ON DELETE CASCADE,
  INDEX idx_plate_number (plate_number),
  INDEX idx_package_number (package_number),
  INDEX idx_status (status),
  INDEX idx_service_date (service_date)
);

CREATE TABLE IF NOT EXISTS Payment (
  payment_number INT AUTO_INCREMENT PRIMARY KEY,
  record_number INT NOT NULL,
  amount_paid DECIMAL(10,2) NOT NULL,
  payment_date DATETIME NOT NULL,
  payment_method ENUM('cash','mobile money','card') DEFAULT 'cash',
  payment_status ENUM('Paid','Partial','Pending') DEFAULT 'Pending',
  FOREIGN KEY (record_number) REFERENCES ServicePackage(record_number) ON DELETE CASCADE,
  INDEX idx_record_number (record_number),
  INDEX idx_payment_date (payment_date),
  INDEX idx_payment_status (payment_status)
);

INSERT INTO Packages (package_name, package_description, package_price)
VALUES
  ('Basic Wash', 'Exterior hand wash', 5000.00),
  ('Classic Wash', 'Interior hand wash', 10000.00),
  ('Premium Wash', 'Exterior + Interior Wash', 20000.00)
ON DUPLICATE KEY UPDATE package_name = VALUES(package_name);

-- To create an admin user, run the register endpoint or insert a bcrypt-hashed password manually.
