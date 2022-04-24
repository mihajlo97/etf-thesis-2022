import os
import re
import uuid
import jwt
import datetime
from flask import Flask, jsonify, request
from functools import wraps
from werkzeug.security import generate_password_hash, check_password_hash
from flask_sqlalchemy import SQLAlchemy


# Server and database setup:

app = Flask(__name__)
basedir = os.path.abspath(os.path.dirname(__file__))
db_uri = f'{basedir}\db\database.db'

app.config['SECRET_KEY'] = 'ETF_THESIS_2022_SECRET'
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{db_uri}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)


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


# Wrappers:

def AuthGuard(func):
    @wraps(func)
    def decorator(*args, **kwargs):
        token = None

        if 'x-access-tokens' in request.headers:
            token = request.headers['x-access-tokens']

        if not token:
            return jsonify({'msg': 'Missing auth token from request.'})

        try:
            data = jwt.decode(
                token, app.config['SECRET_KEY'], algorithms=["HS256"])
            user = Users.query.filter_by(user_id=data['user_id']).first()
        except:
            return jsonify({'msg': 'Invalid auth token submitted with request.'})

        return func(user, *args, **kwargs)
    return decorator


# API:

@app.route("/")
def index():
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
        return jsonify({'msg': 'User must have a valid first name.'}), 400
    if ('lastName' not in data) or (len(lastName) == 0):
        return jsonify({'msg': 'User must have a valid last name.'}), 400
    if ('email' not in data) or (len(email) == 0):
        return jsonify({'msg': 'User must have a valid email.'}), 400
    if ('password' not in data) or (len(password) == 0):
        return jsonify({'msg': 'User must have a valid password.'}), 400

    emailPattern = r'^.+@.+\..{2,}$'
    if not re.search(emailPattern, email):
        return jsonify({'msg': 'Invalid email format.'}), 400

    passwordPattern = r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$'
    if not re.search(passwordPattern, password):
        return jsonify({'msg': 'Invalid password format.'}), 400

    isNotUniqueEmail = Users.query.filter(Users.email == email).first()
    if isNotUniqueEmail:
        return jsonify({'msg': 'User already exists.'}), 400

    hashed_password = generate_password_hash(data['password'], method='sha256')

    user = Users(public_id=str(uuid.uuid4(
    )), first_name=firstName, last_name=lastName, email=email, password=hashed_password)
    db.session.add(user)
    db.session.commit()

    return jsonify({'msg': 'User registered successfully.'}), 200


# Startup:

if __name__ == '__main__':
    app.run(debug=True)
