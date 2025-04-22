from models import User, UserProfile, Bundle, Experience, Booking, Review
from flask import Flask, request, jsonify, session
from extensions import db
from argon2 import PasswordHasher
from flask_cors import CORS
import jwt
import os
from config import Config
from datetime import datetime, date
from functools import wraps

app = Flask(__name__)
CORS(app)

app.config.from_object(Config)

db.init_app(app)

# AUTHENTICATION
ph = PasswordHasher()

# TODO: Set up secret key in .env later
SECRET_KEY = os.environ.get('SECRET_KEY', os.urandom(24))

# Helper function to check if a user is logged in
def is_logged_in():
    return 'user_id' in session and 'auth_token' in session

# Helper function to get the current user's ID from the session
def get_current_user_id():
    return session.get('user_id')

# Helper function to get the current user from the session
def get_current_user():
    if not is_logged_in():
        return None
    user_id = get_current_user_id()
    user = User.query.filter_by(id=user_id).first()  # Assuming you have a User model
    return user

@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    first_name = data.get('firstName')
    last_name = data.get('lastName')

    if not email or not password or not first_name or not last_name:
        return jsonify({"error": "Email, password, first name, and last name required"}), 400

    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({"error": "Email already registered"}), 409

    hashed_password = ph.hash(password)
    new_user = User(email=email, password_hash=hashed_password)
    new_profile = UserProfile(user=new_user, first_name=first_name, last_name=last_name)
    new_user.profile = new_profile

    try:
        db.session.add(new_user)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        print(f"Error creating user: {e}")
        return jsonify({"error": "Database error"}), 500

    token = jwt.encode({
        'sub': email,
        'firstName': first_name,
        'lastName': last_name,
    }, SECRET_KEY, algorithm='HS256')
    
    # Store user info in session
    session['user_id'] = new_user.id
    session['auth_token'] = token


    return jsonify({
        "token": token,
        "user": {
            "email": email,
            'firstName': first_name,
            'lastName': last_name,
        }
    }), 201


@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    print("this is the data", data)
    email = data.get('email')
    password = data.get('password')

    print(f"Login attempt for email: {email}")
    if not email or not password:
        return jsonify({"error": "Email and password required"}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"error": "Invalid credentials"}), 401

    try:
        # For testing purposes, verify plain text password
        # TODO: Use hashed password verification after hashing the seed passwords in init.sql
        if password == user.password_hash:
            name = f"{user.profile.first_name} {user.profile.last_name}".strip()

            token = jwt.encode({
                'sub': email,
                'name': name,
                'user_id': user.id
            }, SECRET_KEY, algorithm='HS256')
            
            # Store user info in session
            session['user_id'] = user.id
            session['auth_token'] = token

            return jsonify({
                "token": token,
                "user": {
                    "email": email,
                    "name": name
                }
            })
        return jsonify({"error": "Invalid credentials"}), 401
    except Exception as e:
        return jsonify({"error": "Invalid credentials"}), 401

# TODO: Set up authorization

# ROUTES
@app.route('/experiences', methods=['GET'])
def get_experiences():
    try:
        experiences = Experience.query.all()

        experiences_list = [{
            'id': exp.id,
            'title': exp.title,
            'description': exp.details,
            'price': float(exp.price),
            'duration': str(exp.duration),
            'location': exp.bundle.location if exp.bundle else None
        } for exp in experiences]

        return jsonify({'experiences': experiences_list}), 200
    except Exception as e:
        return jsonify({'error': 'Failed to fetch experiences'}), 500

@app.route('/experiences/<int:experience_id>', methods=['GET'])
def get_experience(experience_id):
    try:
        experience = Experience.query.get_or_404(experience_id)

        experience_data = {
            'id': experience.id,
            'title': experience.title,
            'description': experience.details,
            'price': float(experience.price),
            'duration': str(experience.duration),
            'location': experience.bundle.location if experience.bundle else None
        }

        return jsonify({'experience': experience_data}), 200
    except Exception as e:
        return jsonify({'error': 'Failed to fetch experience'}), 500
    

####################
# DAVID
####################

# Auth Decortator
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            parts = request.headers['Authorization'].split(" ")
            if len(parts) == 2 and parts[0] == 'Bearer':
                token = parts[1]

        if not token:
            return jsonify({'error': 'Token is missing!'}), 401
        try:
            data = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
            current_user_id = data['user_id']
        except Exception:
            return jsonify({'error': 'Token is invalid!'}), 401
        
        return f(current_user_id, *args, **kwargs)
    return decorated

# Create a booking
@app.route('/api/bookings', methods=['POST'])
@token_required
def create_booking(current_user_id):
    data = request.get_json()
    experience_id = data.get('experience_id')
    booking_date = data.get('booking_date')

    if not experience_id or not booking_date:
        return jsonify({"error": "Experience ID and Booking date required"}), 400
    try:
        booking_date_obj = datetime.strptime(booking_date, '%Y-%m-%d').date()
        if booking_date_obj < date.today():
            return jsonify({"error": "Booking date cannot be in the past"}), 400
    except ValueError:
        return jsonify({"error": "Invalid date format. Use YYYY-MM-DD"}), 400
    
    if not Experience.query.get(experience_id):
        return jsonify({"error": "Experience not found"}), 404
    
    conflict = Booking.query.filter_by(
        user_id=current_user_id,
        experience_id=experience_id,
        booking_date=booking_date_obj
    ).first()
    if conflict:
        return jsonify({"error": "Booking already exists for this date"}), 409
    try:
        booking = Booking(
            user_id=current_user_id,
            experience_id=experience_id,
            booking_date=booking_date_obj,
            status='pending'
        )
        db.session.add(booking)
        db.session.commit()
        return jsonify({"message": "Booking created successfully"}), 201
    except Exception:
        db.session.rollback()
        return jsonify({"error": "Failed to create booking"}), 500
    
# List Boookings
@app.route('/api/bookings', methods=["GET"])
@token_required
def list_bookings(current_user_id):
    bookings = Booking.query.filter_by(user_id=current_user_id).all()
    return jsonify([{
        'id': b.id,
        'experience_id': b.experience_id,
        'booking_date': b.booking_date.isoformat(),
        'status': b.status
    } for b in bookings]), 200

# Get Booking
@app.route('/api/bookings/<int:booking_id>', methods=["GET"])
@token_required
def get_booking(current_user_id, booking_id):
    booking = Booking.query.get_or_404(booking_id)
    if booking.user_id != current_user_id:
        return jsonify({"error": "Unauthorized access"}), 403
    return jsonify({
        'id': booking.id,
        'experience_id': booking.experience_id,
        'booking_date': booking.booking_date.isoformat(),
        'status': booking.status
    }), 200

# Update Booking
@app.route('/api/bookings/<int:booking_id>', methods=["PUT"])
@token_required
def update_booking(current_user_id, booking_id):
    booking = Booking.query.get_or_404(booking_id)
    if booking.user_id != current_user_id:
        return jsonify({"error": "Unauthorized access"}), 403
    
    data = request.get_json()
    if 'booking_date' in data:
        try:
            new_date = datetime.strptime(data['booking_date'], '%Y-%m-%d').date()
            if new_date < date.today():
                return jsonify({"error": "Booking date cannot be in the past"}), 400
            booking.booking_date = new_date
        except ValueError:
            return jsonify({"error": "Invalid date format. Use YYYY-MM-DD"}), 400
        
    if 'status' in data:
        booking.status = data['status']

    db.session.commit()
    return jsonify({"message": "Booking updated successfully"}), 200

# Delete Booking
@app.route('/api/bookings/<int:booking_id>', methods=["DELETE"])
@token_required
def delete_booking(current_user_id, booking_id):
    booking = Booking.query.get_or_404(booking_id)
    if booking.user_id != current_user_id:
        return jsonify({"error": "Unauthorized access"}), 403
    
    db.session.delete(booking)
    db.session.commit()
    return jsonify({"message": "Booking deleted successfully"}), 200


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5001, debug=True)
