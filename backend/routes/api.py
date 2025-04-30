from models import User
from flask import Flask, request, jsonify, session
from extensions import db
from argon2 import PasswordHasher
from flask_cors import CORS
import jwt

# TODO: Set up authorization
# AUTHENTICATION
ph = PasswordHasher()


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

@app.route('/register', methods=['POST'])
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
    name = f"{new_user.profile.first_name} {new_user.profile.last_name}".strip()

    token = jwt.encode({
        'sub': email,
        'name': name,
        'user_id': new_user.id
    }, SECRET_KEY, algorithm='HS256')
    
    # Store user info in session
    session['user_id'] = new_user.id
    session['auth_token'] = token


    return jsonify({
        "token": token,
        "user": {
            "email": email,
            "name": name,
            "userId": new_user.id
        }
    }), 201


@app.route('/login', methods=['POST'])
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
        print("in the try")
        # For testing purposes, verify plain text password
        # TODO: Use hashed password verification after hashing the seed passwords in init.sql
        if password == user.password_hash:
            print("in the if")
            name = f"{user.first_name} {user.last_name}".strip()

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
                    "name": name,
                    "userId": user.id
                }
            })
            
        print("in the else")
        return jsonify({"error": "Invalid credentials"}), 401
    except Exception as e:
        print("in the catch")
        return jsonify({"error": "Invalid credentials"}), 401
