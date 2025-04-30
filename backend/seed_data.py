from datetime import datetime
from models import User, PaymentMethod, Referral, Bundle, Experience, ExperienceImage, Booking, Review, ExperienceSchedule, Tag

users = [
    User(first_name='Red', last_name='Ruby', email='red@example.com', password_hash='password1', phone_number='1234567890', admin=False),
    User(first_name='Blue', last_name='Sapphire', email='blue@example.com', password_hash='password2', phone_number='0987654321', admin=False),
    User(first_name='Green', last_name='Emerald', email='green@example.com', password_hash='password3', phone_number='1122334455', admin=False),
]

payment_methods = [
    PaymentMethod(user_id=1, card_number='4111111111111111', cvv='123', billing_zip='90210', exp_month='12', exp_year='2025'),
    PaymentMethod(user_id=2, card_number='4242424242424242', cvv='456', billing_zip='10001', exp_month='06', exp_year='2026'),
    PaymentMethod(user_id=3, card_number='4000056655665556', cvv='789', billing_zip='60601', exp_month='11', exp_year='2024'),
]

referrals = [
    Referral(user_id=1, passcode='ABC123'),
    Referral(user_id=2, passcode='DEF456'),
    Referral(user_id=3, passcode='GHI789'),
]

bundles = [
    Bundle(name='NYC Adventure', description='Explore the best of New York City with this exciting bundle.', total_price=299.99),
    Bundle(name='LA Experience', description='Discover the glamour and beauty of Los Angeles.', total_price=399.99),
    Bundle(name='Windy City Wonders', description='Experience the charm and culture of Chicago.', total_price=249.99),
]

experiences = [
    Experience(title='Eiffel Tower Visit', description='Guided tour of Eiffel Tower', location='Paris', price=59.99),
    Experience(title='Sushi Workshop', description='Learn to make sushi with a master chef', location='Tokyo', price=89.99),
    Experience(title='Statue of Liberty Tour', description='Visit the iconic Statue of Liberty and Ellis Island.', location='New York', price=49.99),
    Experience(title='Central Park Bike Tour', description='Explore Central Park on a bike with a local guide.', location='New York', price=29.99),
    Experience(title='Hollywood Sign Hike', description='Hike to the famous Hollywood Sign for stunning views.', location='Los Angeles', price=59.99),
    Experience(title='Universal Studios Tour', description='Experience the magic of Universal Studios.', location='Los Angeles', price=129.99),
    Experience(title='Chicago River Cruise', description='Enjoy a scenic cruise on the Chicago River.', location='Chicago', price=39.99),
    Experience(title='Art Institute Tour', description='Explore one of the best art museums in the world.', location='Chicago', price=49.99),
]

experience_images = [
    ExperienceImage(experience_id=1, image_url='https://example.com/eiffel.jpg'),
    ExperienceImage(experience_id=2, image_url='https://example.com/sushi.jpg'),
    ExperienceImage(experience_id=3, image_url='https://example.com/statue.jpg'),
    ExperienceImage(experience_id=4, image_url='https://example.com/bike.jpg'),
    ExperienceImage(experience_id=5, image_url='https://example.com/hollywood.jpg'),
    ExperienceImage(experience_id=6, image_url='https://example.com/universal.jpg'),
    ExperienceImage(experience_id=7, image_url='https://example.com/river.jpg'),
    ExperienceImage(experience_id=8, image_url='https://example.com/art.jpg'),
]

bookings = [
    Booking(user_id=1, experience_id=1, number_of_guests=2, confirmation_code='CONFIRM123'),
    Booking(user_id=2, experience_id=3, number_of_guests=1, confirmation_code='CONFIRM456'),
    Booking(user_id=3, experience_id=5, number_of_guests=3, confirmation_code='CONFIRM789'),
]

reviews = [
    Review(user_id=1, experience_id=1, rating=5, comment='Amazing experience! Highly recommend.', timestamp=datetime.now()),
    Review(user_id=2, experience_id=3, rating=4, comment='Great hike but a bit challenging.', timestamp=datetime.now()),
    Review(user_id=3, experience_id=5, rating=3, comment='Nice cruise but could be better.', timestamp=datetime.now()),
]

experience_schedules = [
    ExperienceSchedule(experience_id=1, start_date='2025-05-01', end_date='2025-05-01', recurring_pattern='None', days_of_week='Monday, Wednesday, Friday', start_time='09:00:00', end_time='11:00:00'),
    ExperienceSchedule(experience_id=2, start_date='2025-05-02', end_date='2025-05-02', recurring_pattern='None', days_of_week='Tuesday, Thursday', start_time='14:00:00', end_time='16:00:00'),
    ExperienceSchedule(experience_id=3, start_date='2025-05-03', end_date='2025-05-03', recurring_pattern='None', days_of_week='Wednesday, Saturday', start_time='10:00:00', end_time='12:00:00'),
    ExperienceSchedule(experience_id=4, start_date='2025-05-04', end_date='2025-05-04', recurring_pattern='None', days_of_week='Monday, Friday', start_time='08:00:00', end_time='10:00:00'),
    ExperienceSchedule(experience_id=5, start_date='2025-05-05', end_date='2025-05-05', recurring_pattern='None', days_of_week='Tuesday, Thursday', start_time='07:00:00', end_time='09:00:00'),
    ExperienceSchedule(experience_id=6, start_date='2025-05-06', end_date='2025-05-06', recurring_pattern='None', days_of_week='Monday, Wednesday', start_time='09:00:00', end_time='11:00:00'),
    ExperienceSchedule(experience_id=7, start_date='2025-05-07', end_date='2025-05-07', recurring_pattern='None', days_of_week='Saturday, Sunday', start_time='15:00:00', end_time='17:00:00'),
    ExperienceSchedule(experience_id=8, start_date='2025-05-08', end_date='2025-05-08', recurring_pattern='None', days_of_week='Friday, Sunday', start_time='13:00:00', end_time='15:00:00'),
]

bundle_experiences = [
    {'bundle_id': 1, 'experience_id': 1},
    {'bundle_id': 1, 'experience_id': 3},
    {'bundle_id': 1, 'experience_id': 4},
    {'bundle_id': 2, 'experience_id': 5},
    {'bundle_id': 2, 'experience_id': 6},
    {'bundle_id': 3, 'experience_id': 7},
    {'bundle_id': 3, 'experience_id': 8},
    {'bundle_id': 1, 'experience_id': 7},
    {'bundle_id': 2, 'experience_id': 8},
]

tags = [
    Tag(name='Cultural', description='Experiences that offer a cultural immersion'),
    Tag(name='Culinary', description='Experiences focusing on food and culinary arts'),
    Tag(name='Historical', description='Experiences that explore historical landmarks'),
    Tag(name='Outdoor', description='Experiences that take place outdoors'),
    Tag(name='Entertainment', description='Experiences focusing on entertainment'),
    Tag(name='Scenic', description='Experiences offering scenic views or routes'),
    Tag(name='Museum', description='Experiences focused on art and museum tours'),
    Tag(name='Adventure', description='Experiences that offer exciting and thrilling activities'),
]

experience_tags = [
    {'experience_id': 1, 'tag_id': 1},
    {'experience_id': 2, 'tag_id': 2},
    {'experience_id': 3, 'tag_id': 3},
    {'experience_id': 4, 'tag_id': 4},
    {'experience_id': 5, 'tag_id': 5},
    {'experience_id': 6, 'tag_id': 6},
    {'experience_id': 7, 'tag_id': 7},
    {'experience_id': 8, 'tag_id': 8},
]
