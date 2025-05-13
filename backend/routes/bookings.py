from flask import Blueprint, request, jsonify
from extensions import db
from datetime import datetime, timezone
from routes.auth import require_auth, get_current_user, is_authorized
from models import Booking, Reservation, Experience
import uuid
import logging

bookings = Blueprint('bookings', __name__)


def generate_confirmation_code():
    return str(uuid.uuid4())[:8].upper()

def validate_reservation_fields(res_data):
    return all(key in res_data for key in ['date', 'time_slot'])

@bookings.route('/', methods=['GET'])
@require_auth
def get_all_bookings():
    user = get_current_user()
    now = datetime.now(timezone.utc)

    all_bookings = Booking.query.filter_by(user_id=user.id).all()

    past_bookings = []
    current_bookings = []

    for booking in all_bookings:
        is_current = False

        for reservation in booking.reservations:
            reservation_datetime = datetime.combine(reservation.date, reservation.time_slot).replace(tzinfo=timezone.utc)
            experience_schedule = booking.experience.schedule

            if experience_schedule and experience_schedule.end_time:
                try:
                    reservation_end = datetime.combine(reservation.date, experience_schedule.end_time).replace(tzinfo=timezone.utc)
                except Exception:
                    reservation_end = reservation_datetime
            else:
                reservation_end = reservation_datetime  # fallback to just start time

            if reservation_end >= now:
                is_current = True
                break

        if is_current:
            current_bookings.append(booking.to_dict())
        else:
            past_bookings.append(booking.to_dict())
            
    return jsonify({
        'past_bookings': past_bookings,
        'current_bookings': current_bookings
    }), 200
    
@bookings.route('/<int:booking_id>', methods=['GET'])
@require_auth
def get_booking(booking_id):
    booking = Booking.query.get_or_404(booking_id)
    if not is_authorized(booking.user_id):
        return jsonify({'error': 'Not authorized to view this booking'}), 403
    return jsonify(booking.to_dict()), 200

@bookings.route('/', methods=['POST'])
@require_auth
def create_booking():
    user = get_current_user()
    data = request.get_json()

    if not all(key in data for key in ['experience_id', 'number_of_guests']):
        return jsonify({'error': 'Missing required fields'}), 400

    experience = Experience.query.get(data['experience_id'])
    if not experience:
        return jsonify({'error': 'Experience not found'}), 404

    try:
        new_booking = Booking(
            user_id=user.id,
            experience_id=data['experience_id'],
            number_of_guests=data['number_of_guests'],
            confirmation_code=generate_confirmation_code(),
            bundle_id=data.get('bundle_id'),
            status='pending',
            created_at=datetime.now(timezone.utc)
        )

        db.session.add(new_booking)
        db.session.flush()

        if 'reservations' in data:
            for res_data in data['reservations']:
                if not validate_reservation_fields(res_data):
                    return jsonify({'error': 'Reservation requires date and time_slot'}), 400

                new_res = Reservation(
                    booking_id=new_booking.id,
                    date=datetime.fromisoformat(res_data['date']).date(),
                    time_slot=datetime.fromisoformat(res_data['time_slot']).time(),
                    status='pending',
                    created_at=datetime.now(timezone.utc)
                )
                db.session.add(new_res)

        db.session.commit()
        return jsonify(new_booking.to_dict()), 201

    except Exception as e:
        db.session.rollback()
        logging.error(f"Error creating booking: {e}")
        return jsonify({'error': 'Failed to create booking'}), 500

@bookings.route('/<int:booking_id>', methods=['PUT'])
@require_auth
def update_booking(booking_id):
    booking = Booking.query.get_or_404(booking_id)
    if not is_authorized(booking.user_id):
        return jsonify({'error': 'Not authorized to update this booking'}), 403

    data = request.get_json()

    try:
        if 'number_of_guests' in data:
            booking.number_of_guests = data['number_of_guests']

        if 'reservations' in data:
            for r in booking.reservations:
                db.session.delete(r)

            for res_data in data['reservations']:
                if not validate_reservation_fields(res_data):
                    return jsonify({'error': 'Reservation requires date and time_slot'}), 400

                new_res = Reservation(
                    booking_id=booking.id,
                    date=datetime.fromisoformat(res_data['date']).date(),
                    time_slot=datetime.fromisoformat(res_data['time_slot']).time(),
                    status=res_data.get('status', 'pending'),
                    created_at=datetime.now(timezone.utc)
                )
                db.session.add(new_res)

        db.session.commit()
        return jsonify(booking.to_dict()), 200

    except Exception as e:
        db.session.rollback()
        logging.error(f"Error updating booking: {e}")
        return jsonify({'error': 'Failed to update booking'}), 500

@bookings.route('/<int:booking_id>', methods=['DELETE'])
@require_auth
def delete_booking(booking_id):
    booking = Booking.query.get_or_404(booking_id)
    if not is_authorized(booking.user_id):
        return jsonify({'error': 'Not authorized to delete this booking'}), 403

    try:
        db.session.delete(booking)
        db.session.commit()
        return jsonify({'message': 'Booking deleted successfully'}), 200

    except Exception as e:
        db.session.rollback()
        logging.error(f"Error deleting booking: {e}")
        return jsonify({'error': 'Failed to delete booking'}), 500

@bookings.route('/<int:booking_id>/reservations', methods=['POST'])
@require_auth
def manage_reservations(booking_id):
    booking = Booking.query.get_or_404(booking_id)
    if not is_authorized(booking.user_id):
        return jsonify({'error': 'Not authorized to manage reservations'}), 403

    data = request.get_json()
    if not isinstance(data, list):
        return jsonify({'error': 'Expected an array of reservations'}), 400

    try:
        if request.args.get('replace', 'false').lower() == 'true':
            for r in booking.reservations:
                db.session.delete(r)

        new_reservations = []
        for res_data in data:
            if not validate_reservation_fields(res_data):
                return jsonify({'error': 'Each reservation requires date and time_slot'}), 400

            new_res = Reservation(
                booking_id=booking.id,
                date=datetime.fromisoformat(res_data['date']).date(),
                time_slot=datetime.fromisoformat(res_data['time_slot']).time(),
                status=res_data.get('status', 'pending'),
                created_at=datetime.now(timezone.utc)
            )
            db.session.add(new_res)
            new_reservations.append(new_res)

        db.session.commit()
        return jsonify({'reservations': [r.to_dict() for r in new_reservations]}), 201

    except Exception as e:
        db.session.rollback()
        logging.error(f"Error managing reservations: {e}")
        return jsonify({'error': 'Failed to manage reservations'}), 500

@bookings.route('/<int:booking_id>/reservations', methods=['DELETE'])
@require_auth
def delete_reservations(booking_id):
    booking = Booking.query.get_or_404(booking_id)
    if not is_authorized(booking.user_id):
        return jsonify({'error': 'Not authorized to delete reservations'}), 403

    data = request.get_json()
    if not isinstance(data, list):
        return jsonify({'error': 'Expected an array of reservation ids'}), 400

    try:
        deleted_count = 0
        for res_id in data:
            res = Reservation.query.filter_by(id=res_id, booking_id=booking_id).first()
            if res:
                db.session.delete(res)
                deleted_count += 1

        db.session.commit()
        return jsonify({
            'message': f'Successfully deleted {deleted_count} reservations',
            'deleted_count': deleted_count
        }), 200

    except Exception as e:
        db.session.rollback()
        logging.error(f"Error deleting reservations: {e}")
        return jsonify({'error': 'Failed to delete reservations'}), 500
