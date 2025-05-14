from flask import Blueprint, request, jsonify
from models import PaymentMethod, db
from routes.auth import require_auth, get_current_user, is_authorized
import logging

payment_methods = Blueprint('payment_methods', __name__)

@payment_methods.route('/', methods=['GET'])
@require_auth
def get_payment_methods():
    user = get_current_user()
    methods = PaymentMethod.query.filter_by(user_id=user.id, hidden=False).all()
    return jsonify({'payment_methods': [method.to_dict() for method in methods]}), 200

@payment_methods.route('/<int:method_id>', methods=['GET'])
@require_auth
def get_payment_method(method_id):
    method = PaymentMethod.query.get_or_404(method_id)
    if not is_authorized(method.user_id):
        return jsonify({'error': 'Not authorized to view this payment method'}), 403
    return jsonify(method.to_dict()), 200

@payment_methods.route('/', methods=['POST'])
@require_auth
def create_payment_method():
    user = get_current_user()
    data = request.get_json()

    required_fields = ['card_number', 'cvv', 'billing_zip', 'exp_month', 'exp_year']
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Missing required fields'}), 400

    try:
        new_method = PaymentMethod(
            user_id=user.id,
            card_number=data['card_number'],
            cvv=data['cvv'],
            billing_zip=data['billing_zip'],
            exp_month=data['exp_month'],
            exp_year=data['exp_year']
        )

        db.session.add(new_method)
        db.session.commit()
        return jsonify(new_method.to_dict()), 201

    except Exception as e:
        db.session.rollback()
        logging.error(f"Error creating payment method: {e}")
        return jsonify({'error': 'Failed to create payment method'}), 500

@payment_methods.route('/<int:method_id>', methods=['PUT'])
@require_auth
def update_payment_method(method_id):
    method = PaymentMethod.query.get_or_404(method_id)
    if not is_authorized(method.user_id):
        return jsonify({'error': 'Not authorized to update this payment method'}), 403

    data = request.get_json()
    try:
        if 'card_number' in data:
            method.card_number = data['card_number']
        if 'cvv' in data:
            method.cvv = data['cvv']
        if 'billing_zip' in data:
            method.billing_zip = data['billing_zip']
        if 'exp_month' in data:
            method.exp_month = data['exp_month']
        if 'exp_year' in data:
            method.exp_year = data['exp_year']

        db.session.commit()
        return jsonify(method.to_dict()), 200

    except Exception as e:
        db.session.rollback()
        logging.error(f"Error updating payment method: {e}")
        return jsonify({'error': 'Failed to update payment method'}), 500

@payment_methods.route('/<int:method_id>', methods=['DELETE'])
@require_auth
def delete_payment_method(method_id):
    method = PaymentMethod.query.get_or_404(method_id)
    if not is_authorized(method.user_id):
        return jsonify({'error': 'Not authorized to delete this payment method'}), 403

    try:
        method.hidden = True
        db.session.add(method)
        db.session.commit()
        return jsonify({'message': 'Payment method successfully hidden'}), 200

    except Exception as e:
        db.session.rollback()
        logging.error(f"Error deleting payment method: {e}")
        return jsonify({'error': 'Failed to delete payment method'}), 500 