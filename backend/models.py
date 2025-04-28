from datetime import datetime, timezone
from extensions import db

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(100))
    last_name = db.Column(db.String(100))
    email = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    last_login = db.Column(db.DateTime)
    phone_number = db.Column(db.String(20))
    
    # Relationships
    bookings = db.relationship('Booking', backref='user')
    reviews = db.relationship('Review', backref='user')
    payment_methods = db.relationship('PaymentMethod', backref='user')
    referral_code = db.relationship('Referral', backref='user')
    
    
class PaymentMethod(db.Model):
    __tablename__ = 'payment_methods'
    
    id = db.Column(db.Integer, primary_key=True)
    card_number = db.Column(db.String(100), nullable=False)
    cvv = db.Column(db.String(100), nullable=False)
    billing_zip = db.Column(db.String(100), nullable=False)
    exp_month = db.Column(db.Integer, nullable=False)
    exp_year = db.Column(db.Integer, nullable=False)
    
    # Relationships
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    user = db.relationship("User", backref="payment_methods")

class Referral(db.Model):
    __tablename__ = 'referrals'
    
    id = db.Column(db.Integer, primary_key=True)
    passcode = db.Column(db.String(20), nullable=False)
    
    # Relationships
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    user = db.relationship("User", backref="referral_code")
    
    
class Experience(db.Model):
    __tablename__ = 'experiences'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    location = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Numeric(10, 2))

    # Relationships
    bookings = db.relationship('Booking', backref='experience')
    reviews = db.relationship('Review', backref='experience')
    images = db.relationship('ExperienceImage', backref='experience')
    bundles = db.relationship('Bundle', secondary="bundle_experience", backref='experiences')
    tags = db.relationship('Tag', secondary='experience_tag', back_populates='experiences')


class ExperienceImage(db.Model):
    __tablename__ = 'experience_images'

    id = db.Column(db.Integer, primary_key=True)
    image_url = db.Column(db.Text, nullable=False)
    
    # Relationships
    experience_id = db.Column(db.Integer, db.ForeignKey('experiences.id'), nullable=False)
    experience = db.relationship("Experience", backref="images")
    
    
class ExperienceSchedule(db.Model):
    __tablename__ = 'experience_schedules'

    id = db.Column(db.Integer, primary_key=True)
    start_date = db.Column(db.Date, nullable=False, default=lambda: datetime.now(timezone.utc))
    end_date = db.Column(db.Date)
    recurring_pattern = db.Column(db.String(50))
    days_of_week = db.Column(db.String(50))
    start_time = db.Column(db.Time, nullable=False) 
    end_time = db.Column(db.Time, nullable=False) 
    
    # Relationships
    experience_id = db.Column(db.Integer, db.ForeignKey('experiences.id'), nullable=False)
    experience = db.relationship("Experience", backref="schedules")
    
    
class Bundle(db.Model):
    __tablename__ = 'bundles'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    total_price = db.Column(db.Numeric(10, 2))

    # Relationships
    experiences = db.relationship('Experience', secondary="bundle_experience", backref='bundles')

bundle_experience_table = db.Table('bundle_experience',
    db.Column('bundle_id', db.Integer, db.ForeignKey('bundles.id')),
    db.Column('experience_id', db.Integer, db.ForeignKey('experiences.id'))
)


class Booking(db.Model):
    __tablename__ = 'bookings'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    experience_id = db.Column(db.Integer, db.ForeignKey('experiences.id'), nullable=False)
    number_of_guests = db.Column(db.Integer, nullable=False)
    confirmation_code = db.Column(db.String(50), nullable=False)
    bundle_id = db.Column(db.Integer, db.ForeignKey('bundles.id'))

    # Optional: define relationships if you want easier access to linked records
    user = db.relationship('User', backref='bookings')
    experience = db.relationship('Experience', backref='bookings')
    bundle = db.relationship('Bundle', backref='bookings')
    payments = db.relationship('Payment', backref='booking')


class Payment(db.Model):
    __tablename__ = 'payments'

    id = db.Column(db.Integer, primary_key=True)
    booking_id = db.Column(db.Integer, db.ForeignKey('bookings.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    amount = db.Column(db.Numeric, nullable=False)
    payment_method_id = db.Column(db.Integer, db.ForeignKey('payment_methods.id'), nullable=False)
    status = db.Column(db.String(50), nullable=False)

    # Relationships (optional but useful)
    booking = db.relationship('Booking', backref='payments')
    user = db.relationship('User', backref='payments')
    payment_method = db.relationship('PaymentMethod', backref='payments')
    
class Review(db.Model):
    __tablename__ = 'reviews'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    experience_id = db.Column(db.Integer, db.ForeignKey('experiences.id'), nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    comment = db.Column(db.Text)
    timestamp = db.Column(db.DateTime, nullable=False)

    # Relationships
    user = db.relationship('User', backref='reviews')
    experience = db.relationship('Experience', backref='reviews')

class Tag(db.Model):
    __tablename__ = 'tags'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    description = db.Column(db.Text)

    # Relationship to experiences through experience_tags
    experiences = db.relationship('Experience', secondary='experience_tag', back_populates='tags')


experience_tag_table = db.Table('experience_tag',
    db.Column('tag_id', db.Integer, db.ForeignKey('tags.id')),
    db.Column('experience_id', db.Integer, db.ForeignKey('experiences.id'))
)