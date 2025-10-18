# backend/routes/patient_routes.py

from flask import Blueprint, request, jsonify
from models import db, Doctor, Appointment
from .auth_routes import token_required

patient_bp = Blueprint('patient_bp', __name__)

@patient_bp.route('/doctors', methods=['GET'])
@token_required
def get_doctors(current_user):
    doctors = Doctor.query.all()
    output = []
    for doctor in doctors:
        doctor_data = {
            'id': doctor.id,
            'name': doctor.name,
            'specialization': doctor.specialization
        }
        output.append(doctor_data)
    return jsonify({'doctors': output})

@patient_bp.route('/appointments', methods=['POST'])
@token_required
def book_appointment(current_user):
    if current_user.role != 'patient':
        return jsonify({'message': 'Only patients can book appointments'}), 403

    data = request.get_json()
    doctor_id = data.get('doctor_id')
    appointment_date = data.get('date') # Expects 'YYYY-MM-DD'
    appointment_time = data.get('time')

    new_appointment = Appointment(
        patient_id=current_user.id,
        doctor_id=doctor_id,
        appointment_date=appointment_date,
        appointment_time=appointment_time
    )
    db.session.add(new_appointment)
    db.session.commit()
    return jsonify({'message': 'Appointment booked successfully'}), 201

@patient_bp.route('/my-appointments', methods=['GET'])
@token_required
def get_my_appointments(current_user):
    appointments = Appointment.query.filter_by(patient_id=current_user.id).all()
    output = []
    for appt in appointments:
        appt_data = {
            'id': appt.id,
            'doctor_name': appt.doctor.name,
            'specialization': appt.doctor.specialization,
            'date': appt.appointment_date.strftime('%Y-%m-%d'),
            'time': appt.appointment_time,
            'status': appt.status
        }
        output.append(appt_data)
    return jsonify({'appointments': output})