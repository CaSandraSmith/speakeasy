from seed_data import users, payment_methods, referrals, bundles, experiences, experience_images, bookings, reviews, experience_schedules, tags, experience_tags, bundle_experiences, reservations
from extensions import db
from app import app
from models import *
from sqlalchemy import text

# Use the application context
with app.app_context():
    # Drop many-to-many association tables first
    db.session.execute(text("DROP TABLE IF EXISTS experience_tags CASCADE;"))
    db.session.execute(text("DROP TABLE IF EXISTS bundle_experiences CASCADE;"))

    # Then drop dependent tables in reverse-dependency order
    db.session.execute(text("DROP TABLE IF EXISTS reviews CASCADE;"))
    db.session.execute(text("DROP TABLE IF EXISTS payments CASCADE;"))
    db.session.execute(text("DROP TABLE IF EXISTS reservations CASCADE;"))
    db.session.execute(text("DROP TABLE IF EXISTS bookings CASCADE;"))
    db.session.execute(text("DROP TABLE IF EXISTS payment_methods CASCADE;"))
    db.session.execute(text("DROP TABLE IF EXISTS referrals CASCADE;"))
    db.session.execute(text("DROP TABLE IF EXISTS experience_images CASCADE;"))
    db.session.execute(text("DROP TABLE IF EXISTS experience_schedules CASCADE;"))
    db.session.execute(text("DROP TABLE IF EXISTS tags CASCADE;"))
    db.session.execute(text("DROP TABLE IF EXISTS bundles CASCADE;"))
    db.session.execute(text("DROP TABLE IF EXISTS experiences CASCADE;"))
    db.session.execute(text("DROP TABLE IF EXISTS users CASCADE;"))
    
    db.session.commit()


    # Create all tables in the proper order
    db.create_all()
    
    # Add all data
    db.session.add_all(users)
    db.session.add_all(payment_methods)
    db.session.add_all(referrals)
    db.session.add_all(tags)
    db.session.add_all(experiences)  
    db.session.add_all(bundles)
    db.session.add_all(experience_images)
    db.session.add_all(experience_schedules)
    db.session.add_all(bookings)
    db.session.add_all(reservations)
    db.session.add_all(reviews)
    
    # Commit to save the base entities
    db.session.commit()
    
    # Add junction table relationships
    for exp_tag in experience_tags:
        db.session.execute(experience_tag.insert().values(
            tag_id=exp_tag['tag_id'],
            experience_id=exp_tag['experience_id']
        ))
    
    for bundle_exp in bundle_experiences:
        db.session.execute(bundle_experience.insert().values(
            bundle_id=bundle_exp['bundle_id'],
            experience_id=bundle_exp['experience_id']
        ))
    
    # Commit all changes
    db.session.commit()
    
    print("Database seeded successfully!")