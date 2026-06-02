CREATE DATABASE IF NOT EXISTS PSSMS;
USE PSSMS;

CREATE TABLE IF NOT EXISTS users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at DATETIME NOT NULL
);

CREATE TABLE IF NOT EXISTS parking_slots (
  slot_id INT AUTO_INCREMENT PRIMARY KEY,
  slot_number VARCHAR(50) NOT NULL UNIQUE,
  slot_status ENUM('available', 'occupied') NOT NULL DEFAULT 'available'
);

CREATE TABLE IF NOT EXISTS cars (
  car_id INT AUTO_INCREMENT PRIMARY KEY,
  plate_number VARCHAR(50) NOT NULL UNIQUE,
  driver_name VARCHAR(150) NOT NULL,
  phone_number VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS parking_records (
  record_id INT AUTO_INCREMENT PRIMARY KEY,
  car_id INT NOT NULL,
  slot_id INT NOT NULL,
  entry_time DATETIME NOT NULL,
  exit_time DATETIME NOT NULL,
  duration DECIMAL(6,2) NOT NULL,
  FOREIGN KEY (car_id) REFERENCES cars(car_id) ON DELETE CASCADE,
  FOREIGN KEY (slot_id) REFERENCES parking_slots(slot_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS payments (
  payment_id INT AUTO_INCREMENT PRIMARY KEY,
  record_id INT NOT NULL,
  amount_paid DECIMAL(10,2) NOT NULL,
  payment_date DATETIME NOT NULL,
  FOREIGN KEY (record_id) REFERENCES parking_records(record_id) ON DELETE CASCADE
);
