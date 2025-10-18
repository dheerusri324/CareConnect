# backend/config.py

import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'a-very-secret-key'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
        'postgresql://your_db_user:your_db_password@localhost/healthcare_db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False