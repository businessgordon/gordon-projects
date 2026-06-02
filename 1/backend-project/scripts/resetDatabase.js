const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function run() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: false,
  });

  try {
    console.log('Resetting EPMS database...');
    
    // Disable foreign key checks
    await connection.query('SET FOREIGN_KEY_CHECKS = 0');
    
    // Try to use the database if it exists
    try {
      await connection.query('USE EPMS');
      console.log('Clearing existing data and tables...');
      
      // Delete all data first
      await connection.query('TRUNCATE TABLE Salary');
      await connection.query('TRUNCATE TABLE Employee');
      await connection.query('TRUNCATE TABLE Department');
      await connection.query('TRUNCATE TABLE Users');
      
      console.log('Data cleared');
    } catch (err) {
      // Database doesn't exist yet, will create it
      console.log('Creating new database...');
      await connection.query('CREATE DATABASE IF NOT EXISTS EPMS');
      await connection.query('USE EPMS');
    }
    
    // Re-enable foreign keys
    await connection.query('SET FOREIGN_KEY_CHECKS = 1');
    
    console.log('Creating tables with correct schema...');
    
    // Create Users table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS Users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    
    // Create Department table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS Department (
        departmentCode VARCHAR(10) PRIMARY KEY,
        departmentName VARCHAR(100) NOT NULL,
        grossSalary DECIMAL(12,2) NOT NULL,
        totalDeduction DECIMAL(12,2) NOT NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    
    // Create Employee table
    await connection.query(`
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
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    
    // Create Salary table with CORRECTED constraint
    await connection.query(`
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
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    
    console.log('Tables created successfully');
    
    // Insert initial data
    console.log('Inserting initial data...');
    await connection.query(`
      INSERT IGNORE INTO Department (departmentCode, departmentName, grossSalary, totalDeduction) VALUES
      ('CW', 'Carwash', 300000.00, 20000.00),
      ('ST', 'Stock', 200000.00, 5000.00),
      ('MC', 'Mechanic', 450000.00, 40000.00),
      ('ADMS', 'Administration Staff', 600000.00, 70000.00)
    `);
    
    await connection.query(`
      INSERT IGNORE INTO Users (username, password_hash) VALUES
      ('admin', '$2b$10$ZBrWB9/WZUhza2WjKilsQOaumupWNTPNfPsArmc46AXBzKGgYL3x6')
    `);
    
    console.log('\n✓ Database reset successful!');
    console.log('✓ Database: EPMS');
    console.log('✓ Admin: admin / SmartPark123');
    console.log('✓ Fixed foreign key constraint in Salary table');
    
  } catch (err) {
    console.error('\n❌ Error:', err.message);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

run();
