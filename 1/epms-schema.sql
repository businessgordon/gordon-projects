-- EPMS Database Schema for SmartPark
CREATE DATABASE IF NOT EXISTS EPMS;
USE EPMS;

CREATE TABLE IF NOT EXISTS Users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Department (
  departmentCode VARCHAR(10) PRIMARY KEY,
  departmentName VARCHAR(100) NOT NULL,
  grossSalary DECIMAL(12,2) NOT NULL,
  totalDeduction DECIMAL(12,2) NOT NULL
);

CREATE TABLE IF NOT EXISTS Employee (
  employeeNumber VARCHAR(30) PRIMARY KEY,
  firstName VARCHAR(100) NOT NULL,
  lastName VARCHAR(100) NOT NULL,
  position VARCHAR(100) NOT NULL,
  address VARCHAR(255),
  telephone VARCHAR(30) NOT NULL,
  gender VARCHAR(20),
  hiredDate DATE,
  departmentCode VARCHAR(10),
  FOREIGN KEY (departmentCode) REFERENCES Department(departmentCode) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS Salary (
  salaryId INT AUTO_INCREMENT PRIMARY KEY,
  employeeNumber VARCHAR(30) NOT NULL,
  departmentCode VARCHAR(10),
  grossSalary DECIMAL(12,2) NOT NULL,
  totalDeduction DECIMAL(12,2) NOT NULL,
  netSalary DECIMAL(12,2) NOT NULL,
  month VARCHAR(20) NOT NULL,
  FOREIGN KEY (employeeNumber) REFERENCES Employee(employeeNumber) ON DELETE CASCADE,
  FOREIGN KEY (departmentCode) REFERENCES Department(departmentCode) ON DELETE SET NULL
);

INSERT IGNORE INTO Department (departmentCode, departmentName, grossSalary, totalDeduction) VALUES
('CW', 'Carwash', 300000.00, 20000.00),
('ST', 'Stock', 200000.00, 5000.00),
('MC', 'Mechanic', 450000.00, 40000.00),
('ADMS', 'Administration Staff', 600000.00, 70000.00);

INSERT IGNORE INTO Users (username, password_hash) VALUES
('admin', '$2b$10$ZBrWB9/WZUhza2WjKilsQOaumupWNTPNfPsArmc46AXBzKGgYL3x6');
-- The password for admin is 'SmartPark123' hashed with bcrypt
