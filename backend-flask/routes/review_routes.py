# backend/routes/review_routes.py

from flask import Blueprint, request, jsonify
from models import db, Review, Appointment, Doctor
from .auth_routes import token_required
from sqlalchemy.sql import func
from sqlalchemy import case

review_bp = Blueprint('review_bp', __name__)

@review_bp.route('/reviews', methods=['POST'])
@token_required
def submit_review(current_user):
    data = request.get_json()
    appointment_id = data.get('appointment_id')
    rating = data.get('rating')
    comment = data.get('comment')

    if not all([appointment_id, rating]):
        return jsonify({'message': 'Appointment ID and rating are required'}), 400

    appointment = Appointment.query.get(appointment_id)

    # Security checks
    if not appointment:
        return jsonify({'message': 'Appointment not found'}), 404
    if appointment.patient_id != current_user.id:
        return jsonify({'message': 'You can only review your own appointments'}), 403
    if Review.query.filter_by(appointment_id=appointment_id).first():
        return jsonify({'message': 'A review for this appointment already exists'}), 409

    new_review = Review(
        doctor_id=appointment.doctor_id,
        patient_id=current_user.id,
        appointment_id=appointment_id,
        rating=rating,
        comment=comment
    )
    db.session.add(new_review)
    db.session.commit()

    return jsonify({'message': 'Review submitted successfully'}), 201


@review_bp.route('/doctors/profiles', methods=['GET'])
@token_required
def get_doctor_profiles(current_user):
    # This query calculates the average rating and review count for each doctor
    doctors = db.session.query(
        Doctor,
        func.avg(Review.rating).label('average_rating'),
        func.count(Review.id).label('review_count')
    ).outerjoin(Review, Doctor.id == Review.doctor_id)\
     .group_by(Doctor.id).all()
    
    output = []
    for doctor, average_rating, review_count in doctors:
        profile_data = {
            'id': doctor.id,
            'name': doctor.name,
            'specialization': doctor.specialization,
            'average_rating': float(average_rating) if average_rating else 0,
            'review_count': review_count,
            'profile_pic': doctor.profile_pic
        }
        output.append(profile_data)

    return jsonify(output)