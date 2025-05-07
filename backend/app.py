from models import User, Bundle, Experience, Booking, Review
from config import Config
from datetime import datetime, date
from functools import wraps
from extensions import app, db
from routes.api import api
from routes.experiences import experiences
from routes.reviews import reviews_bp
from routes.images import images
from routes.schedules import schedules
from routes.bookings import bookings


db.init_app(app)

app.register_blueprint(api, url_prefix='/api')
app.register_blueprint(experiences, url_prefix='/experiences')
app.register_blueprint(images, url_prefix='/images')
app.register_blueprint(schedules, url_prefix='/schedules')
app.register_blueprint(reviews_bp, url_prefix='/reviews')
app.register_blueprint(bookings, url_prefix='/bookings')


with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5001, debug=True)