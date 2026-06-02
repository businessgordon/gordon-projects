-- Create Database
CREATE DATABASE IF NOT EXISTS sims_db;
USE sims_db;

-- Create Users Table
CREATE TABLE IF NOT EXISTS users (
  userId INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Spare Parts Table
CREATE TABLE IF NOT EXISTS spare_part (
  sparePartId INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  quantity INT DEFAULT 0,
  unitPrice DECIMAL(10, 2) NOT NULL,
  totalPrice DECIMAL(15, 2) DEFAULT 0,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_spare_part (name, category)
);

-- Create Stock In Table
CREATE TABLE IF NOT EXISTS stock_in (
  stockInId INT AUTO_INCREMENT PRIMARY KEY,
  sparePartId INT NOT NULL,
  stockInQuantity INT NOT NULL,
  stockInDate DATE NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sparePartId) REFERENCES spare_part(sparePartId) ON DELETE CASCADE
);

-- Create Stock Out Table
CREATE TABLE IF NOT EXISTS stock_out (
  stockOutId INT AUTO_INCREMENT PRIMARY KEY,
  sparePartId INT NOT NULL,
  userId INT NOT NULL,
  stockOutQuantity INT NOT NULL,
  stockOutUnitPrice DECIMAL(10, 2) NOT NULL,
  stockOutTotalPrice DECIMAL(15, 2) NOT NULL,
  stockOutDate DATE NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sparePartId) REFERENCES spare_part(sparePartId) ON DELETE CASCADE,
  FOREIGN KEY (userId) REFERENCES users(userId) ON DELETE CASCADE
);

-- Create Indexes for better performance
CREATE INDEX idx_spare_part_category ON spare_part(category);
CREATE INDEX idx_stock_in_sparepart ON stock_in(sparePartId);
CREATE INDEX idx_stock_in_date ON stock_in(stockInDate);
CREATE INDEX idx_stock_out_sparepart ON stock_out(sparePartId);
CREATE INDEX idx_stock_out_user ON stock_out(userId);
CREATE INDEX idx_stock_out_date ON stock_out(stockOutDate);

-- Insert test user (password: password123)
INSERT INTO users (username, password) VALUES 
('admin', '$2b$10$N9qo8uLOickgx2ZMRZoMye4K8lC0E6x5j7Hnl7TUi3BH/9KLeZVEu');
