from models import User, Bundle, Experience, Booking, Review
from flask import Flask, request, jsonify, Blueprint
from extensions import db, app

experiences = Blueprint('experiences', __name__)

@experiences.route('/', methods=['GET'])
def get_experiences():
    try:
        experiences = Experience.query.all()

        experiences_list = [{
            'id': exp.id,
            'title': exp.title,
            'description': exp.description,
            'price': float(exp.price),
            'duration': str(exp.duration),
            'location': exp.bundle.location if exp.bundle else None
        } for exp in experiences]

        return jsonify({'experiences': experiences_list}), 200
    except Exception as e:
        return jsonify({'error': 'Failed to fetch experiences'}), 500

@experiences.route('/<int:experience_id>', methods=['GET'])
def get_experience(experience_id):
    try:
        experience = Experience.query.get_or_404(experience_id)

        return jsonify({'experience': experience.to_dict()}), 200
    except Exception as e:
        print(e)
        return jsonify({'error': 'Failed to fetch experience'}), 500
