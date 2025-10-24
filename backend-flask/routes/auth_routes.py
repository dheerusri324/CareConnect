# backend/routes/auth_routes.py

from flask import Blueprint, request, jsonify
from models import db, User, Doctor
import jwt
from datetime import datetime, timedelta
from functools import wraps
import os

auth_bp = Blueprint('auth_bp', __name__)
SECRET_KEY = os.environ.get('SECRET_KEY') or 'a-very-secret-key'

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'x-access-token' in request.headers:
            token = request.headers['x-access-token']
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        try:
            data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            current_user = User.query.get(data['id'])
        except:
            return jsonify({'message': 'Token is invalid!'}), 401
        return f(current_user, *args, **kwargs)
    return decorated

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'message': 'Username and password are required'}), 400
    if User.query.filter_by(username=username).first():
        return jsonify({'message': 'Username already exists'}), 409

    new_user = User(username=username, role='patient')
    new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'Patient registered successfully'}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    user = User.query.filter_by(username=username).first()

    if not user or not user.check_password(password):
        return jsonify({'message': 'Invalid credentials'}), 401
    
    token = jwt.encode({
        'id': user.id,
        'role': user.role,
        'exp': datetime.utcnow() + timedelta(hours=24)
    }, SECRET_KEY, "HS256")

    return jsonify({'token': token, 'role': user.role, 'username': user.username})

@auth_bp.route('/register-doctor', methods=['POST'])
def register_doctor():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    doctor_name = data.get('name')
    specialization = data.get('specialization')

    if not all([username, password, doctor_name, specialization]):
        return jsonify({'message': 'All fields are required'}), 400
    if User.query.filter_by(username=username).first():
        return jsonify({'message': 'Username already exists'}), 409

    # Step 1: Create the user account with the 'doctor' role
    new_user = User(username=username, role='doctor')
    new_user.set_password(password)
    db.session.add(new_user)
    db.session.flush()  # Use flush to get the new_user.id before committing

    # Step 2: Create the doctor profile and link it to the user account
    new_doctor = Doctor(
        name=doctor_name,
        specialization=specialization,
        user_id=new_user.id
    )
    db.session.add(new_doctor)
    db.session.commit() # Commit both the new user and new doctor

    return jsonify({'message': 'Doctor registered successfully'}), 201