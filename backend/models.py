from datetime import datetime, timezone
from extensions import db

# Renamed from bundle_experience_table to bundle_experience
bundle_experience = db.Table('bundle_experiences',
    db.Column('bundle_id', db.Integer, db.ForeignKey('bundles.id')),
    db.Column('experience_id', db.Integer, db.ForeignKey('experiences.id'))
)

# Renamed from experience_tag_table to experience_tag
experience_tag = db.Table('experience_tags',
    db.Column('tag_id', db.Integer, db.ForeignKey('tags.id')),
    db.Column('experience_id', db.Integer, db.ForeignKey('experiences.id'))
)

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
    admin = db.Column(db.Boolean, default=False)

    # Fixed relationships to use back_populates
    bookings = db.relationship('Booking', back_populates='user')
    reviews = db.relationship('Review', back_populates='user')
    payment_methods = db.relationship('PaymentMethod', back_populates='user')
    referral_code = db.relationship('Referral', back_populates='user')


class PaymentMethod(db.Model):
    __tablename__ = 'payment_methods'

    id = db.Column(db.Integer, primary_key=True)
    card_number = db.Column(db.String(100), nullable=False)
    cvv = db.Column(db.String(100), nullable=False)
    billing_zip = db.Column(db.String(100), nullable=False)
    exp_month = db.Column(db.Integer, nullable=False)
    exp_year = db.Column(db.Integer, nullable=False)

    # Relationships with back_populates
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    user = db.relationship("User", back_populates="payment_methods")
    payments = db.relationship('Payment', back_populates='payment_method')


class Referral(db.Model):
    __tablename__ = 'referrals'

    id = db.Column(db.Integer, primary_key=True)
    passcode = db.Column(db.String(20), nullable=False)

    # Relationships with back_populates
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    user = db.relationship("User", back_populates="referral_code")


class Experience(db.Model):
    __tablename__ = 'experiences'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    location = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Numeric(10, 2))

    # Fixed relationships with back_populates
    bookings = db.relationship('Booking', back_populates='experience')
    reviews = db.relationship('Review', back_populates='experience')
    images = db.relationship('ExperienceImage', back_populates='experience')
    schedules = db.relationship('ExperienceSchedule', back_populates='experience')

    # Many-to-many relationships with secondary tables
    bundles = db.relationship('Bundle', secondary=bundle_experience, back_populates='experiences')
    tags = db.relationship('Tag', secondary=experience_tag, back_populates='experiences')


class ExperienceImage(db.Model):
    __tablename__ = 'experience_images'

    id = db.Column(db.Integer, primary_key=True)
    image_url = db.Column(db.Text, nullable=False)

    # Relationships with back_populates
    experience_id = db.Column(db.Integer, db.ForeignKey('experiences.id'), nullable=False)
    experience = db.relationship("Experience", back_populates="images")


class ExperienceSchedule(db.Model):
    __tablename__ = 'experience_schedules'

    id = db.Column(db.Integer, primary_key=True)
    start_date = db.Column(db.Date, nullable=False, default=lambda: datetime.now(timezone.utc))
    end_date = db.Column(db.Date)
    recurring_pattern = db.Column(db.String(50))
    days_of_week = db.Column(db.String(50))
    start_time = db.Column(db.Time, nullable=False)
    end_time = db.Column(db.Time, nullable=False)

    # Relationships with back_populates
    experience_id = db.Column(db.Integer, db.ForeignKey('experiences.id'), nullable=False)
    experience = db.relationship("Experience", back_populates="schedules")


class Bundle(db.Model):
    __tablename__ = 'bundles'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    total_price = db.Column(db.Numeric(10, 2))

    # Many-to-many relationship with experiences
    experiences = db.relationship('Experience', secondary=bundle_experience, back_populates='bundles')
    # One-to-many relationship with bookings
    bookings = db.relationship('Booking', back_populates='bundle')


class Booking(db.Model):
    __tablename__ = 'bookings'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    experience_id = db.Column(db.Integer, db.ForeignKey('experiences.id'), nullable=False)
    number_of_guests = db.Column(db.Integer, nullable=False)
    confirmation_code = db.Column(db.String(50), nullable=False)
    bundle_id = db.Column(db.Integer, db.ForeignKey('bundles.id'))

    # Relationships with back_populates
    user = db.relationship('User', back_populates='bookings')
    experience = db.relationship('Experience', back_populates='bookings')
    bundle = db.relationship('Bundle', back_populates='bookings')
    payments = db.relationship('Payment', back_populates='booking')


class Payment(db.Model):
    __tablename__ = 'payments'

    id = db.Column(db.Integer, primary_key=True)
    booking_id = db.Column(db.Integer, db.ForeignKey('bookings.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    amount = db.Column(db.Numeric, nullable=False)
    payment_method_id = db.Column(db.Integer, db.ForeignKey('payment_methods.id'), nullable=False)
    status = db.Column(db.String(50), nullable=False)

    # Relationships with back_populates
    booking = db.relationship('Booking', back_populates='payments')
    user = db.relationship('User', foreign_keys=[user_id])
    payment_method = db.relationship('PaymentMethod', back_populates='payments')


class Review(db.Model):
    __tablename__ = 'reviews'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    experience_id = db.Column(db.Integer, db.ForeignKey('experiences.id'), nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    comment = db.Column(db.Text)
    timestamp = db.Column(db.DateTime, nullable=False)

    # Relationships with back_populates
    user = db.relationship('User', back_populates='reviews')
    experience = db.relationship('Experience', back_populates='reviews')

    def to_dict(self, user_id=None):
        return {
            "id": self.id,
            "rating": self.rating,
            "comment": self.comment,
            "timestamp": self.timestamp.isoformat(),
            "user_id": self.user_id,
            "experience_id": self.experience_id,
            # Python has a weird way of setting up ternary operators compared to JS or Ruby.
            # The below would basically read as
            # `user_id ? self.user_id == user_id : False`
            # in JS or Ruby
            "is_owner": self.user_id == user_id if user_id else False
        }


class Tag(db.Model):
    __tablename__ = 'tags'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    description = db.Column(db.Text)

    # Many-to-many relationship with experiences
    experiences = db.relationship('Experience', secondary=experience_tag, back_populates='tags')
