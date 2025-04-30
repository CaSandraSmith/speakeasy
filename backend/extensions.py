from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_bcrypt import Bcrypt
from config import Config
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app, supports_credentials=True)
app.config.from_object(Config)

db = SQLAlchemy()

###########################
# Authentication
###########################

# bcrypt = Bcrypt(app)