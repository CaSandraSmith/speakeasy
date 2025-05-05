from models import ExperienceSchedule, Experience
from flask import Blueprint, request, jsonify
from extensions import db
from datetime import datetime
from routes.auth import require_admin

schedules = Blueprint('schedules', __name__)

# Get all schedules for an experience
@schedules.route('/<int:experience_id>/schedules', methods=['GET'])
def get_experience_schedules(experience_id):
    try:
        experience = Experience.query.get_or_404(experience_id)
        return jsonify({
            'schedules': [schedule.to_dict() for schedule in experience.schedules]
        }), 200
    except Exception as e:
        print(f"Error in get_experience_schedules: {e}")
        return jsonify({'error': 'Failed to fetch schedules'}), 500

# Add schedule(s) to an experience
@schedules.route('/<int:experience_id>/schedules', methods=['POST'])
@require_admin
def add_experience_schedules(experience_id):
    try:
        experience = Experience.query.get_or_404(experience_id)
        data = request.json

        if not isinstance(data, list):
            return jsonify({'error': 'Expected an array of schedules'}), 400

        new_schedules = []
        for schedule_data in data:
            # Check for the required fields
            required_fields = ['start_date', 'start_time', 'end_time', 'days_of_week']
            if not all(field in schedule_data for field in required_fields):
                return jsonify({'error': 'Missing required fields'}), 400

            new_schedule = ExperienceSchedule(
                experience_id=experience_id,
                start_date=datetime.fromisoformat(schedule_data['start_date']).date(),
                end_date=datetime.fromisoformat(schedule_data['end_date']).date() if 'end_date' in schedule_data else None,
                recurring_pattern=schedule_data.get('recurring_pattern'),
                days_of_week=schedule_data['days_of_week'],
                start_time=datetime.fromisoformat(schedule_data['start_time']).time(),
                end_time=datetime.fromisoformat(schedule_data['end_time']).time()
            )
            new_schedules.append(new_schedule)

        db.session.add_all(new_schedules)
        db.session.commit()

        return jsonify({
            'schedules': [schedule.to_dict() for schedule in new_schedules]
        }), 201
    except Exception as e:
        db.session.rollback()
        print(f"Error in add_experience_schedules: {e}")
        return jsonify({'error': 'Failed to add schedules'}), 500

# Update schedule(s) of an experience
@schedules.route('/<int:experience_id>/schedules', methods=['PUT'])
@require_admin
def update_experience_schedules(experience_id):
    try:
        data = request.json
        if not isinstance(data, list):
            return jsonify({'error': 'Expected an array of schedules'}), 400

        updated_schedules = []
        for schedule_data in data:
            if 'id' not in schedule_data:
                return jsonify({'error': 'Each schedule must have an id'}), 400

            schedule = ExperienceSchedule.query.filter_by(
                id=schedule_data['id'],
                experience_id=experience_id
            ).first_or_404()

            if 'start_date' in schedule_data:
                schedule.start_date = datetime.fromisoformat(schedule_data['start_date']).date()
            if 'end_date' in schedule_data:
                schedule.end_date = datetime.fromisoformat(schedule_data['end_date']).date() if schedule_data['end_date'] else None
            if 'recurring_pattern' in schedule_data:
                schedule.recurring_pattern = schedule_data['recurring_pattern']
            if 'days_of_week' in schedule_data:
                schedule.days_of_week = schedule_data['days_of_week']
            if 'start_time' in schedule_data:
                schedule.start_time = datetime.fromisoformat(schedule_data['start_time']).time()
            if 'end_time' in schedule_data:
                schedule.end_time = datetime.fromisoformat(schedule_data['end_time']).time()

            updated_schedules.append(schedule)

        db.session.commit()

        return jsonify({
            'schedules': [schedule.to_dict() for schedule in updated_schedules]
        }), 200
    except Exception as e:
        db.session.rollback()
        print(f"Error in update_experience_schedules: {e}")
        return jsonify({'error': 'Failed to update schedules'}), 500

# Delete schedule(s) of an experience
@schedules.route('/<int:experience_id>/schedules', methods=['DELETE'])
@require_admin
def delete_experience_schedules(experience_id):
    try:
        data = request.json
        if not isinstance(data, list):
            return jsonify({'error': 'Expected an array of schedule ids'}), 400

        schedule_ids = data
        schedules = ExperienceSchedule.query.filter(
            ExperienceSchedule.id.in_(schedule_ids),
            ExperienceSchedule.experience_id == experience_id
        ).all()

        for schedule in schedules:
            db.session.delete(schedule)

        db.session.commit()
        return jsonify({'message': f'Successfully deleted {len(schedules)} schedules'}), 200
    except Exception as e:
        db.session.rollback()
        print(f"Error in delete_experience_schedules: {e}")
        return jsonify({'error': 'Failed to delete schedules'}), 500
