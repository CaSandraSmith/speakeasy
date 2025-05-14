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
from routes.tags import tags
from routes.search import search
from routes.payments import payments
from routes.payment_methods import payment_methods


db.init_app(app)

app.register_blueprint(api, url_prefix='/api')
app.register_blueprint(experiences, url_prefix='/experiences')
app.register_blueprint(images, url_prefix='/images')
app.register_blueprint(schedules, url_prefix='/schedules')
app.register_blueprint(reviews_bp, url_prefix='/reviews')
app.register_blueprint(bookings, url_prefix='/bookings')
app.register_blueprint(tags, url_prefix='/tags')
app.register_blueprint(search, url_prefix='/search')
app.register_blueprint(payments, url_prefix='/payments')
app.register_blueprint(payment_methods, url_prefix='/payment_methods')


with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5001, debug=True)
