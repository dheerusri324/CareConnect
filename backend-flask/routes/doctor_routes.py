# backend/routes/doctor_routes.py
# Add these imports at the top
import os
from werkzeug.utils import secure_filename
from flask import current_app
from flask import Blueprint, jsonify
from models import db, Appointment, Doctor
from .auth_routes import token_required
from datetime import date, datetime  # <-- Import datetime
from sqlalchemy import or_, and_      # <-- Import 'or_' and 'and_' for complex queries

doctor_bp = Blueprint('doctor_bp', __name__)

@doctor_bp.route('/appointments', methods=['GET'])
@token_required
def get_doctor_appointments(current_user):
    if current_user.role != 'doctor':
        return jsonify({'message': 'Access forbidden'}), 403

    doctor = Doctor.query.filter_by(user_id=current_user.id).first()
    if not doctor:
        return jsonify({'message': 'Doctor profile not found'}), 404

    # Get current date and time for comparison
    today = date.today()
    now = datetime.now()

    # --- THE ENHANCED QUERY ---
    # This query now filters out appointments from earlier today.
    appointments = Appointment.query.filter(
        Appointment.doctor_id == doctor.id,
        or_(
            # Condition 1: Get any appointment on a future date.
            Appointment.appointment_date > today,
            # Condition 2: Get any appointment for today that hasn't happened yet.
            and_(
                Appointment.appointment_date == today,
                Appointment.appointment_time >= now.strftime('%H:%M')
            )
        )
    ).order_by(Appointment.appointment_date, Appointment.appointment_time).all()
    # --- END OF ENHANCED QUERY ---

    output = []
    for appt in appointments:
        appt_data = {
            'id': appt.id,
            'patient_name': appt.patient.username,
            'date': appt.appointment_date.strftime('%Y-%m-%d'),
            'time': appt.appointment_time,
            'status': appt.status
        }
        output.append(appt_data)
    return jsonify({'appointments': output})

@doctor_bp.route('/profile-pic', methods=['POST'])
@token_required
def upload_profile_pic(current_user):
    if current_user.role != 'doctor':
        return jsonify({'message': 'Access forbidden'}), 403

    if 'profile_pic' not in request.files:
        return jsonify({'message': 'No file part'}), 400

    file = request.files['profile_pic']
    if file.filename == '':
        return jsonify({'message': 'No selected file'}), 400

    if file:
        filename = secure_filename(file.filename)
        # Create a unique filename to prevent conflicts
        unique_filename = f"{current_user.id}_{filename}"
        upload_folder = os.path.join(current_app.root_path, 'static', 'uploads')
        file.save(os.path.join(upload_folder, unique_filename))

        # Update the doctor's profile in the database
        doctor = Doctor.query.filter_by(user_id=current_user.id).first()
        doctor.profile_pic = unique_filename
        db.session.commit()

        return jsonify({'message': 'Profile picture updated successfully', 'filename': unique_filename}), 200

    return jsonify({'message': 'File upload failed'}), 500
