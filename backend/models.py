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
    payments = db.relationship('Payment', backref='user')
    reviews = db.relationship('Review', backref='user')

    def __repr__(self):
        return f'<User {self.id}: {self.email}>'

    def to_dict(self):
        return {
            'id': self.id,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'email': self.email,
            'phone': self.phone,
            'payment_info': self.payment_info,
            'admin': self.admin
        }


class PaymentMethod(db.Model):
    __tablename__ = 'payment_methods'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    card_number = db.Column(db.BigInteger)
    cvv = db.Column(db.Integer)
    billing_zip = db.Column(db.Integer)

    # Relationships
    payments = db.relationship('Payment', backref='payment_method')

    def __repr__(self):
        return f'<PaymentMethod {self.id} for User {self.user_id}>'

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'card_number': self.card_number,
            'cvv': self.cvv,
            'billing_zip': self.billing_zip
        }


class Referral(db.Model):
    __tablename__ = 'referrals'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    passcode = db.Column(db.String(20))

    def __repr__(self):
        return f'<Referral {self.id}: {self.passcode}>'

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'passcode': self.passcode
        }


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
    bundle_experiences = db.relationship(
        'BundleExperience', backref='experience')
    bookings = db.relationship('Booking', backref='experience')
    reviews = db.relationship('Review', backref='experience')
    tags = db.relationship(
        'Tag', secondary='experience_tags', back_populates='experiences')

    def __repr__(self):
        return f'<Experience {self.id}: {self.title}>'

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'location': self.location,
            'price': float(self.price) if self.price else None,
            'imageurls': self.imageurls,
            'tags': [tag.to_dict() for tag in self.tags]
        }


class ExperienceSchedule(db.Model):
    __tablename__ = 'experience_schedules'

    id = db.Column(db.Integer, primary_key=True)
    experience_id = db.Column(db.Integer, db.ForeignKey('experiences.id'))
    start_date = db.Column(db.Date)
    end_date = db.Column(db.Date)
    recurring_pattern = db.Column(db.String(50))
    days_of_week = db.Column(db.String(50))
    time = db.Column(db.String(20))

    def __repr__(self):
        return f'<ExperienceSchedule {self.id} for Experience {self.experience_id}>'

    def to_dict(self):
        return {
            'id': self.id,
            'experience_id': self.experience_id,
            'start_date': self.start_date.isoformat() if self.start_date else None,
            'end_date': self.end_date.isoformat() if self.end_date else None,
            'recurring_pattern': self.recurring_pattern,
            'days_of_week': self.days_of_week,
            'time': self.time
        }


class Bundle(db.Model):
    __tablename__ = 'bundles'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    description = db.Column(db.Text)
    total_price = db.Column(db.Numeric)

    # Relationships
    bundle_experiences = db.relationship('BundleExperience', backref='bundle')
    bookings = db.relationship('Booking', backref='bundle')

    def __repr__(self):
        return f'<Bundle {self.id}: {self.name}>'

    def to_dict(self):
        experiences = [be.experience.to_dict()
                       for be in self.bundle_experiences]
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'total_price': float(self.total_price) if self.total_price else None,
            'experiences': experiences
        }


class BundleExperience(db.Model):
    __tablename__ = 'bundle_experiences'

    id = db.Column(db.Integer, primary_key=True)
    bundle_id = db.Column(db.Integer, db.ForeignKey('bundles.id'))
    experience_id = db.Column(db.Integer, db.ForeignKey('experiences.id'))

    def __repr__(self):
        return f'<BundleExperience {self.id}: Bundle {self.bundle_id} - Experience {self.experience_id}>'

    def to_dict(self):
        return {
            'id': self.id,
            'bundle_id': self.bundle_id,
            'experience_id': self.experience_id
        }


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

    def __repr__(self):
        return f'<Booking {self.id}: User {self.user_id} - Experience {self.experience_id}>'

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
    booking_id = db.Column(db.Integer, db.ForeignKey('bookings.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    amount = db.Column(db.Numeric)
    payment_method_id = db.Column(
        db.Integer, db.ForeignKey('payment_methods.id'))
    status = db.Column(db.String(50))

    def __repr__(self):
        return f'<Payment {self.id}: ${self.amount} for Booking {self.booking_id}>'

    def to_dict(self):
        return {
            'id': self.id,
            'booking_id': self.booking_id,
            'user_id': self.user_id,
            'amount': float(self.amount) if self.amount else None,
            'payment_method_id': self.payment_method_id,
            'status': self.status
        }


class Review(db.Model):
    __tablename__ = 'reviews'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    experience_id = db.Column(db.Integer, db.ForeignKey('experiences.id'))
    rating = db.Column(db.Integer)
    comment = db.Column(db.Text)
    timestamp = db.Column(
        db.DateTime, default=datetime.now(datetime.timezone.utc))

    def __repr__(self):
        return f'<Review {self.id}: {self.rating}/5 for Experience {self.experience_id}>'

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'experience_id': self.experience_id,
            'rating': self.rating,
            'comment': self.comment,
            'timestamp': self.timestamp.isoformat() if self.timestamp else None
        }


class Tag(db.Model):
    __tablename__ = 'tags'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50))
    description = db.Column(db.Text)

    # Relationships
    experiences = db.relationship(
        'Experience', secondary='experience_tags', back_populates='tags')

    def __repr__(self):
        return f'<Tag {self.id}: {self.name}>'

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description
        }


class ExperienceTag(db.Model):
    __tablename__ = 'experience_tags'

    id = db.Column(db.Integer, primary_key=True)
    tag_id = db.Column(db.Integer, db.ForeignKey('tags.id'))
    experience_id = db.Column(db.Integer, db.ForeignKey('experiences.id'))

    # Constraint to prevent duplicate tag to experience assignments and vice versa
    __table_args__ = (
        db.UniqueConstraint('experience_id', 'tag_id',
                            name='uix_experience_tag'),
    )

    def __repr__(self):
        return f'<ExperienceTag {self.id}, Experience: {self.experience_id} - Tag: {self.tag_id}>'

    def to_dict(self):
        return {
            'id': self.id,
            'tag_id': self.tag_id,
            'experience_id': self.experience_id
        }
