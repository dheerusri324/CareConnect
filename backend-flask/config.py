# backend/config.py

import os
from dotenv import load_dotenv

# This line finds the .env file and loads it
load_dotenv()

class Config:
    # Reads the SECRET_KEY from .env, with a fallback
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'a-default-secret-key'

    # Reads the DATABASE_URL from .env. The 'or' part is a fallback.
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
        'sqlite:///default.db' # A fallback in case the .env is missing
    
    SQLALCHEMY_TRACK_MODIFICATIONS = False