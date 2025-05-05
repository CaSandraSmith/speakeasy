from models import User
from flask import Flask, request, jsonify, Blueprint
from extensions import db
from argon2 import PasswordHasher
from flask_cors import CORS
import jwt
import os
from datetime import datetime, timedelta, timezone
from config import Config

api = Blueprint('api', __name__)

# AUTHENTICATION
ph = PasswordHasher()

def generate_token(user):
    """Generate a JWT token for the user"""
    name = f"{user.first_name} {user.last_name}".strip()
    payload = {
        'sub': user.email,
        'name': name,
        'user_id': user.id,
        'exp': datetime.now(timezone.utc) + timedelta(days=30)  # Token expires in 30 days
    }
    return jwt.encode(payload, Config.SECRET_KEY, algorithm='HS256')

@api.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    first_name = data.get('firstName')
    last_name = data.get('lastName')
    phone_number = data.get('phoneNumber')

    if not email or not password or not first_name or not last_name or not phone_number:
        return jsonify({"error": "Email, password, first name, last name, and phone number required"}), 400

    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({"error": "Email already registered"}), 409

    hashed_password = ph.hash(password)
    new_user = User(email=email, password_hash=hashed_password, first_name=first_name, last_name=last_name, phone_number=phone_number)

    try:
        db.session.add(new_user)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        print(f"Error creating user: {e}")
        return jsonify({"error": "Database error"}), 500

    token = generate_token(new_user)
    name = f"{new_user.first_name} {new_user.last_name}".strip()

    return jsonify({
        "token": token,
        "user": {
            "email": email,
            "name": name,
            "userId": new_user.id
        }
    }), 201

@api.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"error": "Email and password required"}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"error": "Invalid credentials"}), 401

    try:
        # For testing purposes, verify plain text password
        # TODO: Use hashed password verification after hashing the seed passwords in init.sql
        if password == user.password_hash:
            token = generate_token(user)
            name = f"{user.first_name} {user.last_name}".strip()

            return jsonify({
                "token": token,
                "user": {
                    "email": email,
                    "name": name,
                    "userId": user.id
                }
            })

        return jsonify({"error": "Invalid credentials"}), 401
    except Exception as e:
        print(f"Login error: {e}")
        return jsonify({"error": "Invalid credentials"}), 401
