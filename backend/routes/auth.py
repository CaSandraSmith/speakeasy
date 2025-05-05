from models import Review
from routes.api import get_current_user
from functools import wraps
from flask import request, jsonify

def is_review_owner(review_id):
  user = get_current_user()
  if not user:
    return False

  review = Review.query.get(review_id)
  if not review:
    return False

  return user.id == review.user_id

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
