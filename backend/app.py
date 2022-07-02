import os
import re
import uuid
import logging
import base64
import io
import numpy as np
from datetime import datetime, timedelta
from flask import Flask, jsonify, request
from functools import wraps
from werkzeug.security import generate_password_hash, check_password_hash
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, create_refresh_token, get_jwt_identity, get_jwt
from flask_cors import CORS
from tensorflow.keras.applications import vgg19, resnet50, mobilenet_v2, imagenet_utils
from tensorflow.keras.preprocessing import image
from PIL import Image


# Server and database setup:

app = Flask(__name__)

basedir = os.path.abspath(os.path.dirname(__file__))
db_uri = f'{basedir}\db\database.db'

app.config['SECRET_KEY'] = 'ETF_THESIS_2022_SECRET'
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{db_uri}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

app.config['JWT_SECRET_KEY'] = 'ETF_THESIS_JWT_2022_SECRET'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(minutes=15)
app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(hours=24)

db = SQLAlchemy(app)
jwt = JWTManager(app)
CORS(app)

vggModel = vgg19.VGG19(weights='imagenet')
resnetModel = resnet50.ResNet50(weights='imagenet')
mobilenetModel = mobilenet_v2.MobileNetV2(weights='imagenet')

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
def prepare_image_data(img):
    if img.mode != "RGB":
        img = img.convert("RGB")

    img = img.resize((224, 224))
    img = image.img_to_array(img)

    return np.expand_dims(img, axis=0)


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
    #   200 { accessToken, refreshToken },
    #   400 { msg },
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
    refreshToken = create_refresh_token(identity=user.public_id)

    return jsonify({'accessToken': accessToken, 'refreshToken': refreshToken}), 200


@app.route('/user/refresh', methods=['GET'])
@jwt_required(refresh=True, optional=True)
def refresh():
    # Refresh user session with a fresh pair of tokens.
    # Headers: { Authorization: Bearer <refresh_token> }
    # Response: [
    #   200 { accessToken, refreshToken },
    #   401 { msg }
    # ]

    identity = get_jwt_identity()

    if not identity:
        return jsonify({'msg': 'Missing Authorization Header.'}), 401

    exp = get_jwt()['exp']
    now = int(datetime.timestamp(datetime.now()))

    if now >= exp:
        return jsonify({'msg': 'Session expired.'}), 401

    user = Users.query.filter(Users.public_id == identity).first()

    if not user:
        return jsonify({'msg': 'Unauthorized user refresh request.'}), 401

    accessToken = create_access_token(identity=user.public_id)
    refreshToken = create_refresh_token(identity=user.public_id)

    return jsonify({'accessToken': accessToken, 'refreshToken': refreshToken}), 200


@app.route('/model/classify', methods=['POST'])
@jwt_required()
def classify_image():
    # Classify the sent image and return the predicted classification results.
    # Headers: { Authorization: Bearer <access_token> }
    # Request: { img, model }
    # Response: [
    #   200 { results }
    #   400 { msg }
    #   401 { msg }
    # ]

    identity = get_jwt_identity()

    if not identity:
        return jsonify({'msg': 'Missing Authorization Header.'}), 401

    data = request.get_json()
    model = request.json.get('model', '')
    img = request.json.get('img', '')

    if ('model' not in data) or (len(model) == 0):
        return jsonify({'msg': 'Missing field model.'}), 400

    if (model != 'mobilenet') and (model != 'vgg') and (model != 'resnet'):
        return jsonify({'msg': 'Invalid model to use specified. Allowed values: [mobilenet, vgg, resnet]'}), 400

    if ('img' not in data) or (len(img) == 0):
        return jsonify({'msg': 'Missing field img.'}), 400

    decodedImg = base64.b64decode(img)
    imgFile = Image.open(io.BytesIO(decodedImg))
    imgData = prepare_image_data(imgFile)

    predictions = []

    if (model == 'mobilenet'):
        predictions = mobilenetModel.predict(imgData)
    elif (model == 'vgg'):
        predictions = vggModel.predict(imgData)
    elif (model == 'resnet'):
        predictions = resnetModel.predict(imgData)

    decodedResults = imagenet_utils.decode_predictions(predictions)
    results = []

    for result in decodedResults[0]:
        results.append({'className': result[1], 'probability': str(result[2])})

    return jsonify({'results': results}), 200


# Startup:
if __name__ == '__main__':
    app.run(debug=True)
