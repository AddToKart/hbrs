CREATE DATABASE hotel_booking_system;
USE hotel_booking_system;

CREATE TABLE rooms (
    id INT PRIMARY KEY AUTO_INCREMENT,
    room_number VARCHAR(10) UNIQUE NOT NULL,
    room_type ENUM('single', 'double', 'suite', 'deluxe') NOT NULL,
    price_per_night DECIMAL(10,2) NOT NULL,
    capacity INT NOT NULL,
    amenities TEXT,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE customers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE bookings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT,
    room_id INT,
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    booking_status ENUM('confirmed', 'pending', 'cancelled') DEFAULT 'pending',
    special_requests TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (room_id) REFERENCES rooms(id)
);

CREATE TABLE services (
    id INT PRIMARY KEY AUTO_INCREMENT,
    booking_id INT,
    service_name VARCHAR(100) NOT NULL,
    service_cost DECIMAL(10,2) NOT NULL,
    service_date DATE DEFAULT (CURRENT_DATE),
    FOREIGN KEY (booking_id) REFERENCES bookings(id)
);

-- Sample data
INSERT INTO rooms (room_number, room_type, price_per_night, capacity, amenities) VALUES
('101', 'single', 80.00, 1, 'WiFi, TV, AC'),
('102', 'double', 120.00, 2, 'WiFi, TV, AC, Mini Bar'),
('201', 'suite', 200.00, 4, 'WiFi, TV, AC, Mini Bar, Balcony'),
('202', 'deluxe', 300.00, 2, 'WiFi, TV, AC, Mini Bar, Jacuzzi, Balcony');