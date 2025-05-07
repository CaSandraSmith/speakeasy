from models import Tag
from flask import Blueprint, request, jsonify
from extensions import db
from datetime import datetime

tags = Blueprint('tags', __name__)

# Get all tags
@tags.route('/', methods=['GET'])
def get_tags():
    tags = Tag.query.all()

    return jsonify({
        "tags": [tag.to_dict() for tag in tags]
    })
