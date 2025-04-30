from models import User, Bundle, Experience, Booking, Review
from flask import Flask, request, jsonify, session
from extensions import db, app

@app.route('/', methods=['GET'])
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

@app.route('/<int:experience_id>', methods=['GET'])
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
