from flask import Flask, request, jsonify
from argon2 import PasswordHasher
from flask_cors import CORS
import jwt
import os

app = Flask(__name__)

CORS(app)

## AUTHENTICATION
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

  if email in USERS:
    return jsonify({"error": "Email already registered"}), 409

  hashed_password = ph.hash(password)
  USERS[email] = {
    "password": hashed_password,
    "name": name
  }

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
        # Verify password
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



# Temporary data - replace with database later
experiences = [
  {
    "id": 1,
    "title": "Temp Data",
    "description": "Temp Data",
    "price": 7500.00,
    "duration": "Temp Data",
    "location": "Temp Data"
  }
]

## ROUTES

@app.route('/experiences', methods=['GET'])
def get_experiences():
  return {'experiences': experiences}

if __name__ == '__main__':
  app.run(debug=True)
