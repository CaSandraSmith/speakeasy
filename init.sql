DROP SCHEMA public CASCADE;
CREATE SCHEMA public;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  payment_info TEXT,
  admin BOOLEAN DEFAULT FALSE
);

CREATE TABLE payment_methods (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  card_number BIGINT,
  cvv INTEGER,
  billing_zip INTEGER
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
  price NUMERIC,
  imageurls TEXT
);

CREATE TABLE experience_schedules (
  id SERIAL PRIMARY KEY,
  experience_id INTEGER REFERENCES experiences(id),
  start_date DATE,
  end_date DATE,
  recurring_pattern VARCHAR(50),
  days_of_week VARCHAR(50),
  time VARCHAR(20)
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

INSERT INTO users (first_name, last_name, email, password, phone, payment_info, admin) VALUES
('Red', 'Ruby', 'red@example.com', 'password1', '1234567890', 'Visa', false),
('Blue', 'Sapphire', 'blue@example.com', 'password2', '0987654321', 'Mastercard', false),
('Green', 'Emerald', 'green@example.com', 'passwrod3', '1122334455', 'Amex', false);

-- Add sample payment methods
INSERT INTO payment_methods (user_id, card_number, cvv, billing_zip) VALUES
(1, 4111111111111111, 123, 90210),
(2, 4242424242424242, 456, 10001),
(3, 4000056655665556, 789, 60601);

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
INSERT INTO experiences (title, description, location, price, imageurls) VALUES
('Eiffel Tower Visit', 'Guided tour of Eiffel Tower', 'Paris', 59.99, 'https://example.com/eiffel.jpg'),
('Sushi Workshop', 'Learn to make sushi with a master chef', 'Tokyo', 89.99, 'https://example.com/sushi.jpg'),
('Statue of Liberty Tour', 'Visit the iconic Statue of Liberty and Ellis Island.', 'New York', 49.99, 'https://example.com/statue.jpg'),
('Central Park Bike Tour', 'Explore Central Park on a bike with a local guide.', 'New York', 29.99, 'https://example.com/bike.jpg'),
('Hollywood Sign Hike', 'Hike to the famous Hollywood Sign for stunning views.', 'Los Angeles', 59.99, 'https://example.com/hollywood.jpg'),
('Universal Studios Tour', 'Experience the magic of Universal Studios.', 'Los Angeles', 129.99, 'https://example.com/universal.jpg'),
('Chicago River Cruise', 'Enjoy a scenic cruise on the Chicago River.', 'Chicago', 39.99, 'https://example.com/river.jpg'),
('Art Institute Tour', 'Explore one of the best art museums in the world.', 'Chicago', 49.99, 'https://example.com/art.jpg');

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
