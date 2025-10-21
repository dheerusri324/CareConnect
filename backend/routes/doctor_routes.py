# backend/routes/doctor_routes.py

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
