-- Force clean database reset with tablespace cleanup
SET FOREIGN_KEY_CHECKS = 0;

-- Drop database completely
DROP DATABASE IF EXISTS EPMS;

-- Pause to ensure files are released
-- Wait 2 seconds (this will be handled by the Node script)

-- Create fresh database
CREATE DATABASE EPMS CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE EPMS;

-- Create Users table
CREATE TABLE Users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create Department table
CREATE TABLE Department (
  departmentCode VARCHAR(10) PRIMARY KEY,
  departmentName VARCHAR(100) NOT NULL,
  grossSalary DECIMAL(12,2) NOT NULL,
  totalDeduction DECIMAL(12,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create Employee table
CREATE TABLE Employee (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create Salary table with fixed constraint
CREATE TABLE Salary (
  salaryId INT AUTO_INCREMENT PRIMARY KEY,
  employeeNumber VARCHAR(30) NOT NULL,
  departmentCode VARCHAR(10),
  grossSalary DECIMAL(12,2) NOT NULL,
  totalDeduction DECIMAL(12,2) NOT NULL,
  netSalary DECIMAL(12,2) NOT NULL,
  month VARCHAR(20) NOT NULL,
  FOREIGN KEY (employeeNumber) REFERENCES Employee(employeeNumber) ON DELETE CASCADE,
  FOREIGN KEY (departmentCode) REFERENCES Department(departmentCode) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert initial data
INSERT IGNORE INTO Department (departmentCode, departmentName, grossSalary, totalDeduction) VALUES
('CW', 'Carwash', 300000.00, 20000.00),
('ST', 'Stock', 200000.00, 5000.00),
('MC', 'Mechanic', 450000.00, 40000.00),
('ADMS', 'Administration Staff', 600000.00, 70000.00);

INSERT IGNORE INTO Users (username, password_hash) VALUES
('admin', '$2b$10$ZBrWB9/WZUhza2WjKilsQOaumupWNTPNfPsArmc46AXBzKGgYL3x6');

SET FOREIGN_KEY_CHECKS = 1;
