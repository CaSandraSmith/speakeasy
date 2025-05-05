from models import Experience
from flask import jsonify, Blueprint, request
from extensions import db
from routes.auth import require_admin

experiences = Blueprint('experiences', __name__)

# Get all experiences
@experiences.route('/', methods=['GET'])
def get_experiences():
    try:
        experiences = Experience.query.all()
        return jsonify({'experiences': [exp.to_dict() for exp in experiences]}), 200
    except Exception as e:
        print(f"Error in get_experiences: {e}")
        return jsonify({'error': 'Failed to fetch experiences'}), 500

# Get a specific experience
@experiences.route('/<int:experience_id>', methods=['GET'])
def get_experience(experience_id):
    try:
        experience = Experience.query.get_or_404(experience_id)
        return jsonify({'experience': experience.to_dict()}), 200
    except Exception as e:
        print(f"Error in get_experience: {e}")
        return jsonify({'error': 'Failed to fetch experience'}), 500

# Update an experience
@experiences.route('/<int:experience_id>', methods=['PUT'])
@require_admin
def update_experience(experience_id):
    experience = Experience.query.get_or_404(experience_id)
    data = request.json

    if 'title' in data:
        experience.title = data['title']
    if 'description' in data:
        experience.description = data['description']
    if 'location' in data:
        experience.location = data['location']
    if 'price' in data:
        experience.price = data['price']

    try:
        db.session.commit()
        return jsonify({'experience': experience.to_dict()}), 200
    except Exception as e:
        print(f"Error in update_experience: {e}")
        return jsonify({'error': 'Failed to update experience'}), 500
