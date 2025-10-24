# backend/app.py

from flask import Flask, jsonify
from flask_migrate import Migrate
from flask_cors import CORS
from config import Config
from models import db, User, Doctor
from routes.auth_routes import auth_bp
from routes.patient_routes import patient_bp
from routes.doctor_routes import doctor_bp
from routes.review_routes import review_bp # <-- IMPORT THE NEW BLUEPRINT

app = Flask(__name__)
app.config.from_object(Config)

# Initialize extensions
db.init_app(app)
migrate = Migrate(app, db)
CORS(app) # Enable Cross-Origin Resource Sharing

# Register Blueprints
app.register_blueprint(auth_bp, url_prefix='/auth')
app.register_blueprint(patient_bp, url_prefix='/api')
app.register_blueprint(doctor_bp, url_prefix='/api/doctor')
app.register_blueprint(review_bp, url_prefix='/api')

# Simple command to add dummy doctors
@app.cli.command("seed_doctors")
def seed_doctors():
    """Adds initial doctor records to the database."""
    print("Seeding doctors...")
    doctors_to_create = [
        {'username': 'dr_smith', 'password': 'password123', 'name': 'Dr. John Smith', 'specialization': 'Cardiology'},
        {'username': 'dr_jones', 'password': 'password123', 'name': 'Dr. Sarah Jones', 'specialization': 'Dermatology'},
        {'username': 'dr_williams', 'password': 'password123', 'name': 'Dr. David Williams', 'specialization': 'Pediatrics'}
    ]

    for doc_info in doctors_to_create:
        user = User.query.filter_by(username=doc_info['username']).first()
        if not user:
            user = User(username=doc_info['username'], role='doctor')
            user.set_password(doc_info['password'])
            db.session.add(user)
            db.session.flush() # Get the user ID before committing

            doctor = Doctor(name=doc_info['name'], specialization=doc_info['specialization'], user_id=user.id)
            db.session.add(doctor)
            print(f"Created doctor: {doc_info['name']}")

    db.session.commit()
    print("Doctor seeding complete.")


if __name__ == '__main__':
    app.run(debug=True)