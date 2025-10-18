# backend/routes/doctor_routes.py

from flask import Blueprint, jsonify
from models import db, Appointment, Doctor
from .auth_routes import token_required

doctor_bp = Blueprint('doctor_bp', __name__)

@doctor_bp.route('/appointments', methods=['GET'])
@token_required
def get_doctor_appointments(current_user):
    if current_user.role != 'doctor':
        return jsonify({'message': 'Access forbidden'}), 403
    
    # Find the doctor profile linked to the current user
    doctor = Doctor.query.filter_by(user_id=current_user.id).first()
    if not doctor:
        return jsonify({'message': 'Doctor profile not found'}), 404

    appointments = Appointment.query.filter_by(doctor_id=doctor.id).all()
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