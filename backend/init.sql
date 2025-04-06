--Create Table for Users
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

--Create User Profile Table
CREATE TABLE IF NOT EXISTS user_profiles (
    user_id INTEGER PRIMARY KEY REFERENCES users(id),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone_number VARCHAR(20),
);

--Create Table for Payments
CREATE TABLE IF NOT EXISTS payments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER PRIMARY users(id),
    payment_method VARCHAR(50) NOT NULL,
    card_last(4),
    billing_address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
);

--Create Bundle Table
CREATE TABLE IF NOT EXISTS bundles (
    id SERIAL PRIMARY KEY,
    location VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
);

--Create Table for Experiences
CREATE TABLE IF NOT EXISTS experiences (
    id SERIAL PRIMARY KEY,
    bundle_id INTEGER REFERENCES bundles(id),
    title VARCHAR(255) NOT NULL,
    detail TEXT,
    duration INTEGER NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
);

--Create Table for Bookings
CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    users_id INTEGER REFERENCES users(id),
    experience_id INTEGER REFERENCES experiences(id),
    booking_date TIMESTAMP NOT NULL,
    status VARCHAR(50) NOT NULL,
);

--Create Table for Reviews
CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    experience_id INTEGER REFERENCES experiences(id),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
);