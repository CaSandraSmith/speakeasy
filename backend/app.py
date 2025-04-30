from models import User, Bundle, Experience, Booking, Review
import os
from config import Config
from datetime import datetime, date
from functools import wraps
from .extensions import app, db

# TODO: Set up secret key in .env later
SECRET_KEY = os.environ.get('SECRET_KEY', os.urandom(24))

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
