-- Create Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

-- Create User Profiles Table
CREATE TABLE IF NOT EXISTS user_profiles (
    user_id INTEGER PRIMARY KEY REFERENCES users(id),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone_number VARCHAR(20)
);

-- Create Payments Table
CREATE TABLE IF NOT EXISTS payments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    payment_method VARCHAR(50) NOT NULL,
    card_last4 CHAR(4),
    billing_address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Bundles Table
CREATE TABLE IF NOT EXISTS bundles (
    id SERIAL PRIMARY KEY,
    location VARCHAR(255),
    title VARCHAR(255),
    description TEXT,
    price NUMERIC(10, 2)
);

-- Create Experiences Table
CREATE TABLE IF NOT EXISTS experiences (
    id SERIAL PRIMARY KEY,
    bundle_id INTEGER REFERENCES bundles(id),
    title VARCHAR(255),
    details TEXT,
    duration INTERVAL,
    price NUMERIC(10, 2)
);

-- Create Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    experience_id INTEGER REFERENCES experiences(id),
    booking_date DATE,
    status VARCHAR(50)
);

-- Create Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    experience_id INTEGER REFERENCES experiences(id),
    rating INTEGER CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sample Data Seeding

-- Users
INSERT INTO users (email, password_hash) VALUES
('red@example.com', 'password1'),
('blue@example.com','password2'),
('green@example.com','passwrod3');

-- User Profiles
INSERT INTO user_profiles (user_id, first_name, last_name, phone_number) VALUES
(1, 'Red', 'Ruby', '1234567890'),
(2, 'Blue', 'Saphire', '0987654321'),
(3, 'Green', 'Emerald', '1122334455');

-- Insert Sample Bundles
INSERT INTO bundles (location, title, description, price) VALUES
('New York', 'NYC Adventure', 'Explore the best of New York City with this exciting bundle.', 299.99),
('Los Angeles', 'LA Experience', 'Discover the glamour and beauty of Los Angeles.', 399.99),
('Chicago', 'Windy City Wonders', 'Experience the charm and culture of Chicago.', 249.99);

-- Insert Sample Experiences
INSERT INTO experiences (bundle_id, title, details, duration, price) VALUES
(1, 'Eiffel Tower Visit', 'Guided tour of Eiffel Tower', '2 hours', 59.99),
(2, 'Sushi Workshop', 'Learn to make sushi with a master chef', '3 hours', 89.99),
(3, 'Statue of Liberty Tour', 'Visit the iconic Statue of Liberty and Ellis Island.', '3 hours', 49.99),
(3, 'Central Park Bike Tour', 'Explore Central Park on a bike with a local guide.', '2 hours', 29.99),
(1, 'Hollywood Sign Hike', 'Hike to the famous Hollywood Sign for stunning views.', '4 hours', 59.99),
(2, 'Universal Studios Tour', 'Experience the magic of Universal Studios.', '8 hours', 129.99),
(3, 'Chicago River Cruise', 'Enjoy a scenic cruise on the Chicago River.', '2 hours', 39.99),
(3, 'Art Institute of Chicago Tour', 'Explore one of the best art museums in the world.', '3 hours', 49.99);

-- Insert Bookings
INSERT INTO bookings (user_id, experience_id, booking_date, status) VALUES
(1, 1, '2023-10-01 10:00:00', 'confirmed'),
(2, 3, '2023-10-02 11:00:00', 'pending'),
(3, 5, '2023-10-03 12:00:00', 'cancelled');

-- Insert Reviews
INSERT INTO reviews (user_id, experience_id, rating, comment) VALUES
(1, 1, 5, 'Amazing experience! Highly recommend.'),
(2, 3, 4, 'Great hike but a bit challenging.'),
(3, 5, 3, 'Nice cruise but could be better.');