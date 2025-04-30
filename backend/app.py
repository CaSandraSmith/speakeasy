from models import User, UserProfile, Bundle, Experience, Booking, Review
from flask import Flask, request, jsonify # type: ignore
from extensions import db
from argon2 import PasswordHasher # type: ignore
from flask_cors import CORS # type: ignore
import jwt # type: ignore
import os
from config import Config

app = Flask(__name__)
CORS(app, supports_credentials=True, origins=["http://localhost:8081", "https://10.54.11.198:5001", "*"],
     allow_headers=["Content-Type", "Authorization", "X-Requested-With", "Accept"],
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])

app.config.from_object(Config)

db.init_app(app)

# AUTHENTICATION
ph = PasswordHasher()

# TODO: Set up secret key in .env later
SECRET_KEY = os.environ.get('SECRET_KEY', os.urandom(24))

@app.route('/')
def starter():
    return "Hello Fromm the Backend"

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


if __name__ == '__main__':
    port = 5001
    print("Flask app running on: ", port)
    app.run(host='0.0.0.0', port=port, debug=True)
    
