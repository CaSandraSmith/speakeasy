from models import Review
from flask import Blueprint, request, jsonify
from extensions import db
from datetime import datetime
from routes.auth import require_auth, require_review_ownership, get_current_user

reviews_bp = Blueprint('reviews', __name__)

# Get all reviews
@reviews_bp.route('/', methods=['GET'])
def get_reviews():
    reviews = Review.query.all()
    user = get_current_user()
    user_id = user.id if user else None

    return jsonify({
        "reviews": [review.to_dict(user_id) for review in reviews]
    })

# Get a specific review
@reviews_bp.route('/<int:review_id>', methods=['GET'])
def get_review(review_id):
    review = Review.query.get_or_404(review_id)
    user = get_current_user()
    user_id = user.id if user else None

    return jsonify(review.to_dict(user_id))

# Create a new review
@reviews_bp.route('/', methods=['POST'])
@require_auth
def create_review():
    user = get_current_user()
    data = request.get_json()

    # Check all required fields
    if not all(key in data for key in ['comment', 'rating', 'experience_id']):
        return jsonify({"error": "Missing required fields"}), 400

    # Validate rating range
    if not 1 <= data['rating'] <= 5:
        return jsonify({"error": "Rating must be between 1 and 5"}), 400

    new_review = Review(
        comment=data['comment'],
        rating=data['rating'],
        user_id=user.id,
        experience_id=data['experience_id'],
        timestamp=datetime.now(datetime.UTC)
    )

    try:
        db.session.add(new_review)
        db.session.commit()

        return jsonify(new_review.to_dict(user.id)), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to create review"}), 500

# Update a review
@reviews_bp.route('/<int:review_id>', methods=['PUT'])
@require_auth
@require_review_ownership
def update_review(review_id):
    review = Review.query.get_or_404(review_id)
    data = request.get_json()
    user = get_current_user()

    # Update provided fields
    if 'comment' in data:
        review.comment = data['comment']
    if 'rating' in data:
        if not 1 <= data['rating'] <= 5:
            return jsonify({"error": "Rating must be between 1 and 5"}), 400
        review.rating = data['rating']

    try:
        db.session.commit()
        return jsonify(review.to_dict(user.id))
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to update review"}), 500

# Delete a review
@reviews_bp.route('/<int:review_id>', methods=['DELETE'])
@require_auth
@require_review_ownership
def delete_review(review_id):
    review = Review.query.get_or_404(review_id)

    try:
        db.session.delete(review)
        db.session.commit()
        return jsonify({"message": "Review deleted successfully"})
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to delete review"}), 500
