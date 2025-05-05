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
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
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
    
    def to_dict(self):
        return {
            'id': self.id,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'email': self.email,
            'phone_number': self.phone_number,
            'admin': self.admin,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'last_login': self.last_login.isoformat() if self.last_login else None,
        }

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
    
    def to_dict(self):
        return {
            'id': self.id,
            'card_number': self.card_number,
            'billing_zip': self.billing_zip,
            'exp_month': self.exp_month,
            'exp_year': self.exp_year,
            'user_id': self.user_id
        }


class Referral(db.Model):
    __tablename__ = 'referrals'
    
    id = db.Column(db.Integer, primary_key=True)
    passcode = db.Column(db.String(20), nullable=False)
    
    # Relationships with back_populates
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    user = db.relationship("User", back_populates="referral_code")
    
    def to_dict(self):
        return {
            'id': self.id,
            'passcode': self.passcode,
            'user_id': self.user_id
        }

    
    
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
    schedule = db.relationship('ExperienceSchedule', back_populates='experience', uselist=False, cascade='all, delete-orphan')
    
    # Many-to-many relationships with secondary tables
    bundles = db.relationship('Bundle', secondary=bundle_experience, back_populates='experiences')
    tags = db.relationship('Tag', secondary=experience_tag, back_populates='experiences')
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'location': self.location,
            'price': float(self.price) if self.price else None,
            'images': [img.to_dict() for img in self.images],
            'schedule': self.schedule.to_dict() if self.schedule else None,
            'tags': [t.to_dict() for t in self.tags],
            'reviews': [r.to_dict() for r in self.reviews]
        }


class ExperienceImage(db.Model):
    __tablename__ = 'experience_images'

    id = db.Column(db.Integer, primary_key=True)
    image_url = db.Column(db.Text, nullable=False)
    
    # Relationships with back_populates
    experience_id = db.Column(db.Integer, db.ForeignKey('experiences.id'), nullable=False)
    experience = db.relationship("Experience", back_populates="images")
    
    def to_dict(self):
        return {
            'id': self.id,
            'image_url': self.image_url
        }

    
    
class ExperienceSchedule(db.Model):
    __tablename__ = 'experience_schedules'

    id = db.Column(db.Integer, primary_key=True)
    start_date = db.Column(db.Date, nullable=True, default=lambda: datetime.now(timezone.utc))
    end_date = db.Column(db.Date)
    recurring_pattern = db.Column(db.String(50))
    days_of_week = db.Column(db.String(50))
    start_time = db.Column(db.Time, nullable=True) 
    end_time = db.Column(db.Time, nullable=True) 
    
    # Relationships with back_populates
    experience_id = db.Column(db.Integer, db.ForeignKey('experiences.id'), nullable=False, unique=True)
    experience = db.relationship("Experience", back_populates="schedule")
    
    def to_dict(self):
        return {
            'id': self.id,
            'start_date': self.start_date.isoformat() if self.start_date else None,
            'end_date': self.end_date.isoformat() if self.end_date else None,
            'recurring_pattern': self.recurring_pattern,
            'days_of_week': self.days_of_week,
            'start_time': self.start_time.isoformat() if self.start_time else None,
            'end_time': self.end_time.isoformat() if self.end_time else None
        }
    
    
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
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'total_price': float(self.total_price) if self.total_price else None,
            'experiences': [e.to_dict() for e in self.experiences]
        }


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
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'experience_id': self.experience_id,
            'number_of_guests': self.number_of_guests,
            'confirmation_code': self.confirmation_code,
            'bundle_id': self.bundle_id
        }



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
    
    def to_dict(self):
        return {
            'id': self.id,
            'booking_id': self.booking_id,
            'user_id': self.user_id,
            'amount': float(self.amount),
            'payment_method_id': self.payment_method_id,
            'status': self.status
        }

    
    
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
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_name': f"{self.user.first_name} {self.user.last_name}",
            'experience_id': self.experience_id,
            'rating': self.rating,
            'comment': self.comment,
            'timestamp': self.timestamp.isoformat() if self.timestamp else None
        }



class Tag(db.Model):
    __tablename__ = 'tags'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    description = db.Column(db.Text)

    # Many-to-many relationship with experiences
    experiences = db.relationship('Experience', secondary=experience_tag, back_populates='tags')
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description
        }
