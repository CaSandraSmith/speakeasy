from flask import Blueprint, request, jsonify
from models import Payment, db
from routes.auth import require_auth, get_current_user, is_authorized
import logging

payments = Blueprint('payments', __name__)

@payments.route('/', methods=['GET'])
@require_auth
def get_payments():
    user = get_current_user()
    payments = Payment.query.filter_by(user_id=user.id).all()
    return jsonify({'payments': [payment.to_dict() for payment in payments]}), 200

@payments.route('/<int:payment_id>', methods=['GET'])
@require_auth
def get_payment(payment_id):
    payment = Payment.query.get_or_404(payment_id)
    if not is_authorized(payment.user_id):
        return jsonify({'error': 'Not authorized to view this payment'}), 403
    return jsonify(payment.to_dict()), 200 