from models import Review, User
from functools import wraps
from flask import request, jsonify
import jwt
from config import Config

def verify_jwt():
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return None

    try:
        token = auth_header.split(' ')[1]
        payload = jwt.decode(token, Config.SECRET_KEY, algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

def get_current_user():
    payload = verify_jwt()
    if not payload:
        return None

    user = User.query.filter_by(id=payload.get('user_id')).first()
    return user

def is_review_owner(review_id):
    user = get_current_user()
    if not user:
        return False

    review = Review.query.get(review_id)
    if not review:
        return False

    return user.id == review.user_id

def is_admin():
    user = get_current_user()
    if not user:
        return False
    return user.admin

# Decorator for general authentication
def require_auth(func):
    @wraps(func)
    def check_auth(*args, **kwargs):
        user = get_current_user()
        if not user:
            return jsonify({"error": "Authentication required"}), 401
        return func(*args, **kwargs)
    return check_auth

# Decorator for admin authorization
def require_admin(func):
    @wraps(func)
    def check_admin(*args, **kwargs):
        if not is_admin():
            return jsonify({"error": "Admin access required"}), 403
        return func(*args, **kwargs)
    return check_admin

# Decorator for route authorization checks
def require_review_ownership(func):
    @wraps(func)
    def check_ownership(*args, **kwargs):
        review_id = kwargs.get('review_id') or request.view_args.get('review_id')
        if not review_id:
            return jsonify({"error": "Review id required"}), 400

        if not is_review_owner(review_id):
            return jsonify({"error": "Not authorized to access this review"}), 403

        return func(*args, **kwargs)
    return check_ownership

def is_authorized(resource_user_id):
    return resource_user_id == get_current_user().id

