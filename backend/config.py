import os

class Config:
    SQLALCHEMY_DATABASE_URI = 'postgresql://speakeasy:secretpassword@localhost:5432/speakeasy_dev'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.environ.get('SECRET_KEY', os.urandom(24))
