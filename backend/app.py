from models import User, Bundle, Experience, Booking, Review
import os
from config import Config
from datetime import datetime, date
from functools import wraps
from .extensions import app, db
from extensions import app, db
from routes.api import api
from routes.experiences import experiences

# TODO: Set up secret key in .env later
SECRET_KEY = os.environ.get('SECRET_KEY', os.urandom(24))

db.init_app(app)

app.register_blueprint(api)
app.register_blueprint(experiences)

with app.app_context():
    db.create_all()
    
if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5001, debug=True)
