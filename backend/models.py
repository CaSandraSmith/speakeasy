from datetime import datetime
from extensions import db

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(50))
    last_name = db.Column(db.String(50))
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    phone = db.Column(db.String(20))
    payment_info = db.Column(db.Text)
    admin = db.Column(db.Boolean, default=False)

    # Relationships
    payment_methods = db.relationship('PaymentMethod', backref='user')
    referrals = db.relationship('Referral', backref='user')
    bookings = db.relationship('Booking', backref='user')
    reviews = db.relationship('Review', backref='user')
    payments = db.relationship('Payment', backref='user')

class PaymentMethod(db.Model):
    __tablename__ = 'payment_methods'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    card_number = db.Column(db.BigInteger)
    cvv = db.Column(db.Integer)
    billing_zip = db.Column(db.Integer)

class Referral(db.Model):
    __tablename__ = 'referrals'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    passcode = db.Column(db.String(20))

class Experience(db.Model):
    __tablename__ = 'experiences'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100))
    description = db.Column(db.Text)
    location = db.Column(db.String(100))
    price = db.Column(db.Numeric)
    imageurls = db.Column(db.Text)

    # Relationships
    schedules = db.relationship('ExperienceSchedule', backref='experience')
    bundle_experiences = db.relationship('BundleExperience', backref='experience')
    bookings = db.relationship('Booking', backref='experience')
    reviews = db.relationship('Review', backref='experience')
    experience_tags = db.relationship('ExperienceTag', backref='experience')

class ExperienceSchedule(db.Model):
    __tablename__ = 'experience_schedules'

    id = db.Column(db.Integer, primary_key=True)
    experience_id = db.Column(db.Integer, db.ForeignKey('experiences.id'))
    start_date = db.Column(db.Date)
    end_date = db.Column(db.Date)
    recurring_pattern = db.Column(db.String(50))
    days_of_week = db.Column(db.String(50))
    time = db.Column(db.String(20))

class Bundle(db.Model):
    __tablename__ = 'bundles'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    description = db.Column(db.Text)
    total_price = db.Column(db.Numeric)

    # Relationships
    bundle_experiences = db.relationship('BundleExperience', backref='bundle')
    bookings = db.relationship('Booking', backref='bundle')

class BundleExperience(db.Model):
    __tablename__ = 'bundle_experiences'

    id = db.Column(db.Integer, primary_key=True)
    bundle_id = db.Column(db.Integer, db.ForeignKey('bundles.id'))
    experience_id = db.Column(db.Integer, db.ForeignKey('experiences.id'))

class Booking(db.Model):
    __tablename__ = 'bookings'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    experience_id = db.Column(db.Integer, db.ForeignKey('experiences.id'))
    number_of_guests = db.Column(db.Integer)
    confirmation_code = db.Column(db.String(50))
    bundle_id = db.Column(db.Integer, db.ForeignKey('bundles.id'))

    # Relationships
    payments = db.relationship('Payment', backref='booking')

class Payment(db.Model):
    __tablename__ = 'payments'

    id = db.Column(db.Integer, primary_key=True)
    booking_id = db.Column(db.Integer, db.ForeignKey('bookings.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    amount = db.Column(db.Numeric)
    payment_method_id = db.Column(db.Integer, db.ForeignKey('payment_methods.id'))
    status = db.Column(db.String(50))

class Review(db.Model):
    __tablename__ = 'reviews'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    experience_id = db.Column(db.Integer, db.ForeignKey('experiences.id'))
    rating = db.Column(db.Integer)
    comment = db.Column(db.Text)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

class Tag(db.Model):
    __tablename__ = 'tags'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50))
    description = db.Column(db.Text)

    # Relationships
    experience_tags = db.relationship('ExperienceTag', backref='tag')

class ExperienceTag(db.Model):
    __tablename__ = 'experience_tags'

    id = db.Column(db.Integer, primary_key=True)
    tag_id = db.Column(db.Integer, db.ForeignKey('tags.id'))
    experience_id = db.Column(db.Integer, db.ForeignKey('experiences.id'))
