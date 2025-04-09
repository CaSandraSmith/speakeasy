from models import User, UserProfile, Bundle, Experience, Booking, Review
from flask import Flask, request, jsonify
from extensions import db
from argon2 import PasswordHasher
from flask_cors import CORS
import jwt
import os
from config import Config

app = Flask(__name__)
CORS(app)

app.config.from_object(Config)

db.init_app(app)

# AUTHENTICATION
ph = PasswordHasher()

# TODO: Set up secret key in .env later
SECRET_KEY = os.environ.get('SECRET_KEY', os.urandom(24))

# Dummy data
# TODO: Replace with database later
USERS = {
    "user1": {
        "password": ph.hash("userpass"),
        "name": "John Smith"
    }
}


@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    name = data.get('name')

    if not email or not password or not name:
        return jsonify({"error": "Email, password and name required"}), 400

    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({"error": "Email already registered"}), 409

    hashed_password = ph.hash(password)
    new_user = User(email=email, password_hash=hashed_password)
    new_profile = UserProfile(user=new_user, first_name=name)
    new_user.profile = new_profile

    try:
        db.session.add(new_user)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Database error"}), 500

    token = jwt.encode({
        'sub': email,
        'name': name
    }, SECRET_KEY, algorithm='HS256')

    return jsonify({
        "token": token,
        "user": {
            "email": email,
            "name": name
        }
    }), 201


@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"error": "Email and password required"}), 400

    if email not in USERS:
        return jsonify({"error": "Invalid credentials"}), 401

    try:
        ph.verify(USERS[email]["password"], password)

        # Generate JWT token
        token = jwt.encode({
            'sub': email,
            'name': USERS[email]["name"]
        }, SECRET_KEY, algorithm='HS256')

        return jsonify({
            "token": token,
            "user": {
                "email": email,
                "name": USERS[email]["name"]
            }
        })
    except:
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


if __name__ == '__main__':
    app.run(host='localhost', port=5001, debug=True)
