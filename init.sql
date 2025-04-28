DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS payment_methods CASCADE;
DROP TABLE IF EXISTS referrals CASCADE;
DROP TABLE IF EXISTS experiences CASCADE;
DROP TABLE IF EXISTS experience_images CASCADE;
DROP TABLE IF EXISTS experience_schedules CASCADE;
DROP TABLE IF EXISTS bundles CASCADE;
DROP TABLE IF EXISTS bundle_experiences CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS tags CASCADE;
DROP TABLE IF EXISTS experience_tags CASCADE;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP,
  phone VARCHAR(20),
  admin BOOLEAN DEFAULT FALSE
);

CREATE TABLE payment_methods (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  card_number VARCHAR(100),
  cvv VARCHAR(100),
  billing_zip VARCHAR(100),
  exp_month VARCHAR(10),
  exp_year VARCHAR(10)
);

CREATE TABLE referrals (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  passcode VARCHAR(20)
);

CREATE TABLE experiences (
  id SERIAL PRIMARY KEY,
  title VARCHAR(100),
  description TEXT,
  location VARCHAR(100),
  price NUMERIC
);

CREATE TABLE experience_images (
  id SERIAL PRIMARY KEY,
  experience_id INTEGER REFERENCES experiences(id),
  image_url TEXT
);

CREATE TABLE experience_schedules (
  id SERIAL PRIMARY KEY,
  experience_id INTEGER REFERENCES experiences(id),
  start_date DATE,
  end_date DATE,
  recurring_pattern VARCHAR(50),
  days_of_week VARCHAR(50),
  start_time TIME,
  end_time TIME
);

CREATE TABLE bundles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  description TEXT,
  total_price NUMERIC
);

CREATE TABLE bundle_experiences (
  id SERIAL PRIMARY KEY,
  bundle_id INTEGER REFERENCES bundles(id),
  experience_id INTEGER REFERENCES experiences(id)
);

CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  experience_id INTEGER,
  number_of_guests INTEGER,
  confirmation_code VARCHAR(50),
  bundle_id INTEGER,
  FOREIGN KEY (experience_id) REFERENCES experiences(id),
  FOREIGN KEY (bundle_id) REFERENCES bundles(id)
);

CREATE TABLE payments (
  id SERIAL PRIMARY KEY,
  booking_id INTEGER REFERENCES bookings(id),
  user_id INTEGER REFERENCES users(id),
  amount NUMERIC,
  payment_method_id INTEGER REFERENCES payment_methods(id),
  status VARCHAR(50)
);

CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  experience_id INTEGER REFERENCES experiences(id),
  rating INTEGER,
  comment TEXT,
  timestamp TIMESTAMP
);

CREATE TABLE tags (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50),
  description TEXT
);

CREATE TABLE experience_tags (
  id SERIAL PRIMARY KEY,
  tag_id INTEGER REFERENCES tags(id),
  experience_id INTEGER REFERENCES experiences(id)
);


-- Sample Data Seeding

-- Insert Users
INSERT INTO users (first_name, last_name, email, password_hash, phone, admin) VALUES
('Red', 'Ruby', 'red@example.com', 'password1', '1234567890', false),
('Blue', 'Sapphire', 'blue@example.com', 'password2', '0987654321', false),
('Green', 'Emerald', 'green@example.com', 'password3', '1122334455', false);

-- Add sample payment methods
INSERT INTO payment_methods (user_id, card_number, cvv, billing_zip, exp_month, exp_year) VALUES
(1, '4111111111111111', '123', '90210', '12', '2025'),
(2, '4242424242424242', '456', '10001', '06', '2026'),
(3, '4000056655665556', '789', '60601', '11', '2024');

-- Referrals
INSERT INTO referrals (user_id, passcode) VALUES
(1, 'ABC123'),
(2, 'DEF456'),
(3, 'GHI789');

-- Bundles (adapted: no location, no title field, renamed price to total_price)
INSERT INTO bundles (name, description, total_price) VALUES
('NYC Adventure', 'Explore the best of New York City with this exciting bundle.', 299.99),
('LA Experience', 'Discover the glamour and beauty of Los Angeles.', 399.99),
('Windy City Wonders', 'Experience the charm and culture of Chicago.', 249.99);

-- Experiences (replaced missing fields, removed duration/details, added imageurls)
INSERT INTO experiences (title, description, location, price) VALUES
('Eiffel Tower Visit', 'Guided tour of Eiffel Tower', 'Paris', 59.99),
('Sushi Workshop', 'Learn to make sushi with a master chef', 'Tokyo', 89.99),
('Statue of Liberty Tour', 'Visit the iconic Statue of Liberty and Ellis Island.', 'New York', 49.99),
('Central Park Bike Tour', 'Explore Central Park on a bike with a local guide.', 'New York', 29.99),
('Hollywood Sign Hike', 'Hike to the famous Hollywood Sign for stunning views.', 'Los Angeles', 59.99),
('Universal Studios Tour', 'Experience the magic of Universal Studios.', 'Los Angeles', 129.99),
('Chicago River Cruise', 'Enjoy a scenic cruise on the Chicago River.', 'Chicago', 39.99),
('Art Institute Tour', 'Explore one of the best art museums in the world.', 'Chicago', 49.99);

-- Insert experience images (added image URLs)
INSERT INTO experience_images (experience_id, image_url) VALUES
(1, 'https://example.com/eiffel.jpg'),
(2, 'https://example.com/sushi.jpg'),
(3, 'https://example.com/statue.jpg'),
(4, 'https://example.com/bike.jpg'),
(5, 'https://example.com/hollywood.jpg'),
(6, 'https://example.com/universal.jpg'),
(7, 'https://example.com/river.jpg'),
(8, 'https://example.com/art.jpg');

-- Bookings (conforms to new schema — no booking_date or status column, add confirmation_code, number_of_guests)
INSERT INTO bookings (user_id, experience_id, number_of_guests, confirmation_code) VALUES
(1, 1, 2, 'CONFIRM123'),
(2, 3, 1, 'CONFIRM456'),
(3, 5, 3, 'CONFIRM789');

-- Reviews (with timestamp)
INSERT INTO reviews (user_id, experience_id, rating, comment, timestamp) VALUES
(1, 1, 5, 'Amazing experience! Highly recommend.', NOW()),
(2, 3, 4, 'Great hike but a bit challenging.', NOW()),
(3, 5, 3, 'Nice cruise but could be better.', NOW());

-- Experience Schedules (for each experience, define a schedule)
INSERT INTO experience_schedules (experience_id, start_date, end_date, recurring_pattern, days_of_week, start_time, end_time) VALUES
(1, '2025-05-01', '2025-05-01', 'None', 'Monday, Wednesday, Friday', '09:00:00', '11:00:00'),
(2, '2025-05-02', '2025-05-02', 'None', 'Tuesday, Thursday', '14:00:00', '16:00:00'),
(3, '2025-05-03', '2025-05-03', 'None', 'Wednesday, Saturday', '10:00:00', '12:00:00'),
(4, '2025-05-04', '2025-05-04', 'None', 'Monday, Friday', '08:00:00', '10:00:00'),
(5, '2025-05-05', '2025-05-05', 'None', 'Tuesday, Thursday', '07:00:00', '09:00:00'),
(6, '2025-05-06', '2025-05-06', 'None', 'Monday, Wednesday', '09:00:00', '11:00:00'),
(7, '2025-05-07', '2025-05-07', 'None', 'Saturday, Sunday', '15:00:00', '17:00:00'),
(8, '2025-05-08', '2025-05-08', 'None', 'Friday, Sunday', '13:00:00', '15:00:00');

-- Bundle Experiences (connecting bundles to experiences)
INSERT INTO bundle_experiences (bundle_id, experience_id) VALUES
(1, 1), -- NYC Adventure -> Eiffel Tower Visit
(1, 3), -- NYC Adventure -> Statue of Liberty Tour
(1, 4), -- NYC Adventure -> Central Park Bike Tour
(2, 5), -- LA Experience -> Hollywood Sign Hike
(2, 6), -- LA Experience -> Universal Studios Tour
(3, 7), -- Windy City Wonders -> Chicago River Cruise
(3, 8), -- Windy City Wonders -> Art Institute Tour
(1, 7), -- NYC Adventure -> Chicago River Cruise
(2, 8); -- LA Experience -> Art Institute Tour

-- Insert Tags (tags like 'Cultural', 'Culinary', etc.)
INSERT INTO tags (name, description) VALUES
('Cultural', 'Experiences that offer a cultural immersion'),
('Culinary', 'Experiences focusing on food and culinary arts'),
('Historical', 'Experiences that explore historical landmarks'),
('Outdoor', 'Experiences that take place outdoors'),
('Entertainment', 'Experiences focusing on entertainment'),
('Scenic', 'Experiences offering scenic views or routes'),
('Museum', 'Experiences focused on art and museum tours'),
('Adventure', 'Experiences that offer exciting and thrilling activities'); -- Add missing tag 'Adventure'

-- Experience Tags (assigning tags to experiences)
INSERT INTO experience_tags (experience_id, tag_id) VALUES
(1, 1), -- Eiffel Tower Visit -> Cultural
(2, 2), -- Sushi Workshop -> Culinary
(3, 3), -- Statue of Liberty Tour -> Historical
(4, 4), -- Central Park Bike Tour -> Outdoor
(5, 5), -- Hollywood Sign Hike -> Outdoor
(6, 6), -- Universal Studios Tour -> Entertainment
(7, 7), -- Chicago River Cruise -> Scenic
(8, 8); -- Art Institute Tour -> Museum
