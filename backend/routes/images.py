from models import ExperienceImage, Experience
from flask import Blueprint, request, jsonify
from extensions import db
from routes.auth import require_admin

images = Blueprint('images', __name__)

# Get all images from a specific experience
@images.route('/<int:experience_id>/images', methods=['GET'])
def get_experience_images(experience_id):
    try:
        experience = Experience.query.get_or_404(experience_id)
        return jsonify({'images': [{'id': img.id, 'url': img.image_url} for img in experience.images]}), 200
    except Exception as e:
        print(f"Error in get_experience_images: {e}")
        return jsonify({'error': 'Failed to fetch images'}), 500

# Add images to a specific experience
@images.route('/<int:experience_id>/images', methods=['POST'])
@require_admin
def add_experience_image(experience_id):
    experience = Experience.query.get_or_404(experience_id)
    data = request.json

    if not data or not isinstance(data.get('image_urls', []), list):
        return jsonify({'error': 'image_urls must be an array'}), 400

    image_urls = data['image_urls']

    if not image_urls:
        return jsonify({'error': 'At least one image URL is required'}), 400

    try:
        new_images = []
        for url in image_urls:
            new_image = ExperienceImage(
                experience_id=experience_id,
                image_url=url
            )
            db.session.add(new_image)
            new_images.append(new_image)

        db.session.commit()

        return jsonify({
            'images': [{'id': img.id, 'url': img.image_url} for img in new_images]
        }), 201
    except Exception as e:
        db.session.rollback()
        print(f"Error in add_experience_image: {e}")
        return jsonify({'error': 'Failed to add image(s)'}), 500

# Delete images from a specific experience
@images.route('/<int:experience_id>/images', methods=['DELETE'])
@require_admin
def delete_experience_images(experience_id):
    data = request.json

    if not data or not isinstance(data.get('image_ids', []), list):
        return jsonify({'error': 'image_ids must be an array'}), 400

    image_ids = data['image_ids']

    if not image_ids:
        return jsonify({'error': 'At least one image ID is required'}), 400

    try:
        # Find all images that belong to this experience and are in the provided list
        images_to_delete = ExperienceImage.query.filter(
            ExperienceImage.experience_id == experience_id,
            ExperienceImage.id.in_(image_ids)
        ).all()

        if not images_to_delete:
            return jsonify({'error': 'No matching images found'}), 404

        deleted_count = 0
        for image in images_to_delete:
            db.session.delete(image)
            deleted_count += 1

        db.session.commit()

        return jsonify({
            'message': f'Successfully deleted {deleted_count} image(s)',
            'deleted_count': deleted_count
        }), 200
    except Exception as e:
        db.session.rollback()
        print(f"Error in delete_experience_images: {e}")
        return jsonify({'error': 'Failed to delete image(s)'}), 500
