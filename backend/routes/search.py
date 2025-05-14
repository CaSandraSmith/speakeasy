from flask import Blueprint, request, jsonify
from models import Experience
from fuzzywuzzy import fuzz, process

search = Blueprint('search', __name__)

def get_experience_suggestions(query, experiences):
    suggestions = []
    for experience in experiences:
        if query.lower() in experience.title.lower():
            suggestions.append({
                'id': experience.id,
                'title': experience.title
            })

    suggestions.sort(key=lambda x: x['title'])
    return suggestions[0:5]

@search.route('', methods=['GET'])
def search_all():
    query = request.args.get('q', '')
    query = query.strip()

    if not query:
        return jsonify({
            'suggestions': [],
            'experiences': []
        }), 200

    experiences = Experience.query.all()

    # Make list of titles
    titles = []
    for exp in experiences:
        titles.append((exp.id, exp.title))

    # Do fuzzy search on titles
    title_matches = process.extract(
        query,
        dict(titles),
        scorer=fuzz.partial_ratio,
        limit=10
    )

    matches = []

    # Process title matches
    for title_match in title_matches:
        title = title_match[0]
        score = title_match[1]
        exp_id = title_match[2]

        # Only add if score is good enough
        if score >= 60:
            for exp in experiences:
                if exp.id == exp_id:
                    matches.append({
                        'id': exp.id,
                        'title': exp.title,
                        'description': exp.description,
                        'location': exp.location,
                        'price': float(exp.price) if exp.price else None,
                        'match_score': score,
                        'match_type': 'title',
                        'image_url': exp.images[0].image_url if exp.images else None
                    })
                    break

    suggestions = get_experience_suggestions(query, experiences)

    # Sort matches by score descending
    matches = sorted(matches, key=lambda x: x['match_score'], reverse=True)

    # Return the results
    return jsonify({
        'suggestions': suggestions,
        'experiences': matches
    }), 200
