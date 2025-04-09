from datetime import datetime
from extensions import db

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime)
    last_login = db.Column(db.DateTime)

    # Relationships
    profile = db.relationship('UserProfile', backref='user', uselist=False)
    bookings = db.relationship('Booking', backref='user')
    reviews = db.relationship('Review', backref='user')


class UserProfile(db.Model):
    __tablename__ = 'user_profiles'

    user_id = db.Column(db.Integer, db.ForeignKey(
        'users.id'), primary_key=True)
    first_name = db.Column(db.String(100))
    last_name = db.Column(db.String(100))
    phone_number = db.Column(db.String(20))


class Bundle(db.Model):
    __tablename__ = 'bundles'

    id = db.Column(db.Integer, primary_key=True)
    location = db.Column(db.String(255))
    title = db.Column(db.String(255))
    description = db.Column(db.Text)
    price = db.Column(db.Numeric(10, 2))

    # Relationships
    experiences = db.relationship('Experience', backref='bundle')


class Experience(db.Model):
    __tablename__ = 'experiences'

    id = db.Column(db.Integer, primary_key=True)
    bundle_id = db.Column(db.Integer, db.ForeignKey('bundles.id'))
    title = db.Column(db.String(255))
    details = db.Column(db.Text)
    duration = db.Column(db.Interval)
    price = db.Column(db.Numeric(10, 2))

    # Relationships
    bookings = db.relationship('Booking', backref='experience')
    reviews = db.relationship('Review', backref='experience')


class Booking(db.Model):
    __tablename__ = 'bookings'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    experience_id = db.Column(db.Integer, db.ForeignKey('experiences.id'))
    booking_date = db.Column(db.Date)
    status = db.Column(db.String(50))


class Review(db.Model):
    __tablename__ = 'reviews'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    experience_id = db.Column(db.Integer, db.ForeignKey('experiences.id'))
    rating = db.Column(db.Integer)
    comment = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
