from models import User, Bundle, Experience, Booking, Review
import os
from config import Config
from .extensions import app, db

# TODO: Set up secret key in .env later
SECRET_KEY = os.environ.get('SECRET_KEY', os.urandom(24))

# ROUTES

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5001, debug=True)
