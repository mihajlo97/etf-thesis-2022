import os
import re
import uuid
import datetime
import logging
from flask import Flask, jsonify, request
from functools import wraps
from werkzeug.security import generate_password_hash, check_password_hash
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, create_refresh_token, get_jwt, get_jwt_identity
from flask_cors import CORS


# Server and database config:

app = Flask(__name__)

basedir = os.path.abspath(os.path.dirname(__file__))
db_uri = f'{basedir}\db\database.db'

app.config['SECRET_KEY'] = 'ETF_THESIS_2022_SECRET'
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{db_uri}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

app.config['JWT_SECRET_KEY'] = 'ETF_THESIS_JWT_2022_SECRET'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = datetime.timedelta(hours=2)

db = SQLAlchemy(app)
jwt = JWTManager(app)
CORS(app)


# Database schema setup:

class Users(db.Model):
    user_id = db.Column(db.Integer, primary_key=True)
    public_id = db.Column(db.String(50), unique=True)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(50), nullable=False)

    def __repr__(self):
        return f'<User {self.first_name} {self.last_name} ({self.email})>'


# Helper functions


# API:

@app.route("/")
def index():
    # Basic server healthcheck.
    return "Server up and running on port 5000."


@app.route("/user/register", methods=["POST"])
def register_user():
    # Register user in database.
    # Request: { firstName, lastName, email, password }
    # Response: [
    #   200 { msg },
    #   400 { msg }
    # ]

    data = request.get_json()

    firstName = request.json.get('firstName', '')
    lastName = request.json.get('lastName', '')
    email = request.json.get('email', '')
    password = request.json.get('password', '')

    if ('firstName' not in data) or (len(firstName) == 0):
        return jsonify({'msg': 'Missing field firstName.'}), 400
    if ('lastName' not in data) or (len(lastName) == 0):
        return jsonify({'msg': 'Missing field lastName.'}), 400
    if ('email' not in data) or (len(email) == 0):
        return jsonify({'msg': 'Missing field email.'}), 400
    if ('password' not in data) or (len(password) == 0):
        return jsonify({'msg': 'Missing field password.'}), 400

    emailPattern = r'^.+@.+\..{2,}$'
    if not re.search(emailPattern, email):
        return jsonify({'msg': 'Invalid email format.'}), 400

    passwordPattern = r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$'
    if not re.search(passwordPattern, password):
        return jsonify({'msg': 'Invalid password format.'}), 400

    isNotUniqueEmail = Users.query.filter(Users.email == email).first()
    if isNotUniqueEmail:
        return jsonify({'msg': f'User with email {email} is already registered.'}), 500

    hashedPassword = generate_password_hash(data['password'], method='sha256')

    user = Users(public_id=str(uuid.uuid4(
    )), first_name=firstName, last_name=lastName, email=email, password=hashedPassword)
    db.session.add(user)
    db.session.commit()

    return jsonify({'msg': 'User registered successfully.'}), 200


@app.route('/user/login', methods=['POST'])
def login():
    # Login user and return JWT.
    # Request: { email, password }
    # Response: [
    #   200 { accessToken },
    #   401 { msg },
    #   404 { msg }
    # ]

    data = request.get_json()
    email = request.json.get('email', '')
    password = request.json.get('password', '')

    if ('email' not in data) or (len(email) == 0):
        return jsonify({'msg': 'Missing field email.'}), 400
    if ('password' not in data) or (len(password) == 0):
        return jsonify({'msg': 'Missing field password.'}), 400

    user = Users.query.filter(Users.email == email).first()

    if not user:
        return jsonify({'msg': 'User not found.'}), 404

    if not check_password_hash(user.password, password):
        return jsonify({'msg': 'Invalid password.'}), 401

    accessToken = create_access_token(identity=user.public_id)

    return jsonify({'accessToken': accessToken}), 200

    # Startup:
if __name__ == '__main__':
    app.run(debug=True)
