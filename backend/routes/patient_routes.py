# backend/routes/patient_routes.py

from flask import Blueprint, request, jsonify
from models import db, Doctor, Appointment
from .auth_routes import token_required
from datetime import datetime, timedelta

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
    appointment_date = data.get('date')
    appointment_time = data.get('time')

    # --- ATOMIC CHECK LOGIC ---
    # Before we do anything, check if this exact slot has been booked.
    existing_appointment = Appointment.query.filter_by(
        doctor_id=doctor_id,
        appointment_date=appointment_date,
        appointment_time=appointment_time
    ).first()

    # If an appointment is found, it means someone else just booked it.
    if existing_appointment:
        # Return a 409 Conflict status code.
        return jsonify({'message': 'This time slot was just booked by someone else. Please select another time.'}), 409
    # --- END OF ATOMIC CHECK ---

    # If the slot is free, proceed with booking.
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
    # Fetch all appointments and sort them, with the newest first
    appointments = Appointment.query.filter_by(patient_id=current_user.id)\
        .order_by(Appointment.appointment_date.desc(), Appointment.appointment_time.desc())\
        .all()
    
    now = datetime.now()
    output = []

    for appt in appointments:
        appointment_datetime_str = f"{appt.appointment_date.strftime('%Y-%m-%d')} {appt.appointment_time}"
        appointment_datetime = datetime.strptime(appointment_datetime_str, '%Y-%m-%d %H:%M')

        current_status = appt.status
        if appointment_datetime < now:
            current_status = "Completed"

        appt_data = {
            'id': appt.id,
            'doctor_name': appt.doctor.name,
            'specialization': appt.doctor.specialization,
            'date': appt.appointment_date.strftime('%Y-%m-%d'),
            'time': appt.appointment_time,
            'status': current_status
        }
        output.append(appt_data)
        
    return jsonify({'appointments': output})


@patient_bp.route('/doctors/<int:doctor_id>/available-slots', methods=['GET'])
@token_required
def get_available_slots(current_user, doctor_id):
    date_str = request.args.get('date')
    if not date_str:
        return jsonify({"message": "Date parameter is required"}), 400
    
    try:
        selected_date = datetime.strptime(date_str, '%Y-%m-%d').date()
    except ValueError:
        return jsonify({"message": "Invalid date format. Use YYYY-MM-DD"}), 400

    booked_appointments = Appointment.query.filter_by(
        doctor_id=doctor_id,
        appointment_date=selected_date
    ).all()
    booked_times = {appt.appointment_time for appt in booked_appointments}

    start_time = datetime.strptime("09:00", "%H:%M").time()
    end_time = datetime.strptime("17:00", "%H:%M").time()
    slot_duration = timedelta(minutes=15)
    
    all_slots = []
    current_slot_time = datetime.combine(selected_date, start_time)
    end_datetime = datetime.combine(selected_date, end_time)
    
    now = datetime.now()

    while current_slot_time < end_datetime:
        time_str = current_slot_time.strftime("%H:%M")
        is_past = selected_date == now.date() and current_slot_time.time() < now.time()
        
        all_slots.append({
            "time": time_str,
            "booked": time_str in booked_times or is_past
        })
        current_slot_time += slot_duration

    return jsonify(all_slots)

