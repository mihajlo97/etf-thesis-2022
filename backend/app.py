import os
import re
import uuid
import logging
import base64
import io
import time
import numpy as np
import tensorflowjs as tfjs
from datetime import datetime, timedelta
from flask import Flask, jsonify, request
from functools import wraps
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, create_refresh_token, get_jwt_identity, get_jwt
from flask_cors import CORS
from tensorflow.keras.applications import mobilenet, mobilenet_v2, imagenet_utils
from tensorflow.keras.preprocessing import image
from PIL import Image


# Server and database setup:

app = Flask(__name__)

basedir = os.path.abspath(os.path.dirname(__file__))
db_uri = f'{basedir}\db\database.db'
static_uri = f'{basedir}\static'

app.config['SECRET_KEY'] = 'ETF_THESIS_2022_SECRET'
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{db_uri}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

app.config['JWT_SECRET_KEY'] = 'ETF_THESIS_JWT_2022_SECRET'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(minutes=15)
app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(hours=24)

app.config['UPLOAD_FOLDER'] = static_uri

db = SQLAlchemy(app)
jwt = JWTManager(app)
CORS(app)

mobilenetModel = mobilenet.MobileNet(weights='imagenet')
mobilenetV2Model = mobilenet_v2.MobileNetV2(weights='imagenet')


# Database schema setup:

class Users(db.Model):
    user_id = db.Column(db.Integer, primary_key=True)
    public_id = db.Column(db.String(50), unique=True)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(50), nullable=False)
    reports = db.relationship('Reports', backref='users', lazy=True)

    def __repr__(self):
        return f'<User {self.first_name} {self.last_name} ({self.email})>'


class Reports(db.Model):
    report_id = db.Column(db.Integer, primary_key=True)
    public_id = db.Column(db.String(50), unique=True)
    name = db.Column(db.String(255), nullable=False)
    image_path = db.Column(db.String(512), nullable=False)
    resolution = db.Column(db.String(50), nullable=False)
    aspect_ratio = db.Column(db.String(50), nullable=False)
    model = db.Column(db.String(50), nullable=False)
    timestamp = db.Column(db.String(50), nullable=False)
    client_class = db.Column(db.String(255), nullable=False)
    client_confidence = db.Column(db.Float, nullable=False)
    client_time_image = db.Column(db.Integer, nullable=False)
    client_time_prediction = db.Column(db.Integer, nullable=False)
    client_time_processing = db.Column(db.Integer, nullable=False)
    server_class = db.Column(db.String(255), nullable=False)
    server_confidence = db.Column(db.Float, nullable=False)
    server_time_image = db.Column(db.Integer, nullable=False)
    server_time_prediction = db.Column(db.Integer, nullable=False)
    server_time_processing = db.Column(db.Integer, nullable=False)
    server_time_response = db.Column(db.Integer, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)

    def __repr__(self):
        return f'<Report [{self.timestamp}] {self.name}>'
        

db.create_all()
db.session.commit()


# Helper functions:

def prepare_image_data(img, model):
    if img.mode != "RGB":
        img = img.convert("RGB")

    img = img.resize((224, 224))
    img = image.img_to_array(img)
    img_tensor = np.expand_dims(img, axis=0)

    if (model == 'mobilenet'):
        return mobilenet.preprocess_input(img_tensor)

    return mobilenet_v2.preprocess_input(img_tensor)


def get_current_time_milis():
    return round(time.time() * 1000)

def correct_extension(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in {'jpg', 'jpeg', 'png'}


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
    # Request: { img, model=['mobilenet', 'mobilenet_v2'] }
    # Response: [
    #   200 { results=[{ className, probability }], imagePreparationTime, predictionTime, totalProcessingTime }
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

    if (model != 'mobilenet') and (model != 'mobilenet_v2'):
        return jsonify({'msg': 'Invalid model to use specified. Allowed values: [mobilenet, mobilenet_v2]'}), 400

    if ('img' not in data) or (len(img) == 0):
        return jsonify({'msg': 'Missing field img.'}), 400

    startMeasuring = get_current_time_milis()

    decodedImg = base64.b64decode(img)
    imgFile = Image.open(io.BytesIO(decodedImg))
    imgData = prepare_image_data(imgFile, model)

    imagePreperationTime = get_current_time_milis() - startMeasuring

    predictions = []

    startMeasuringPredictionTime = get_current_time_milis()

    if (model == 'mobilenet'):
        predictions = mobilenetModel.predict(imgData)
    elif (model == 'mobilenet_v2'):
        predictions = mobilenetV2Model.predict(imgData)

    decodedResults = imagenet_utils.decode_predictions(predictions)
    results = []

    for result in decodedResults[0]:
        results.append({'className': result[1], 'probability': str(result[2])})

    predictionTime = get_current_time_milis() - startMeasuringPredictionTime
    totalProcessingTime = get_current_time_milis() - startMeasuring

    return jsonify({'results': results, 'imagePreparationTime': imagePreperationTime, 'predictionTime': predictionTime, 'totalProcessingTime': totalProcessingTime}), 200


@app.route('/reports/store', methods=['POST'])
@jwt_required()
def save_report():
    # Store the user's report into the database. Images are saved on disk, while the image path is stored in the database.
    # Headers: { Authorization: Bearer <access_token>, Content-Type: multipart/form-data }
    # Request: { name, resolution, aspectRatio, model, timestamp, clientClass, clientConfidence, clientTimeImage, clientTimePrediction,
    #            clientTimeProcessing, serverClass, serverConfidence, serverTimeImage, serverTimePrediction, serverTimeProcessing, serverTimeResponse, image }
    # Response: [
    #   200 { msg }
    #   400 { msg }
    #   401 { msg }
    # ]
    identity = get_jwt_identity()

    if not identity:
        return jsonify({'msg': 'Missing Authorization Header.'}), 401

    form = request.form.to_dict()

    if ('name' not in form) or ('resolution' not in form) or ('aspectRatio' not in form) or ('model' not in form) or ('timestamp' not in form) or \
        ('clientClass' not in form) or ('clientConfidence' not in form) or ('clientTimeImage' not in form) or ('clientTimePrediction' not in form) or \
        ('clientTimeProcessing' not in form) or ('serverClass' not in form) or ('serverConfidence' not in form) or ('serverTimeImage' not in form) or \
        ('serverTimePrediction' not in form) or ('serverTimeProcessing' not in form) or ('serverTimeResponse' not in form):
        return jsonify({'msg': 'Missing field in request.'}), 400

    if (len(form['name']) == 0) or (len(form['resolution']) == 0) or (len(form['aspectRatio']) == 0) or (len(form['model']) == 0) or (len(form['timestamp']) == 0) or \
        (len(form['clientClass']) == 0) or (len(form['clientConfidence']) == 0) or (len(form['clientTimeImage']) == 0) or (len(form['clientTimePrediction']) == 0) or \
        (len(form['clientTimeProcessing']) == 0) or (len(form['serverClass']) == 0) or (len(form['serverConfidence']) == 0) or (len(form['serverTimeImage']) == 0) or \
        (len(form['serverTimePrediction']) == 0) or (len(form['serverTimeProcessing']) == 0) or (len(form['serverTimeResponse']) == 0):
        return jsonify({'msg': 'No empty fields allowed in request.'}), 400

    img = request.files.get('image')

    if (not img):
        return jsonify({'msg': 'Image field is missing.'}), 400

    filename = img.filename

    if (filename == ''):
        return jsonify({'msg': 'Image name is empty.'}), 400

    if (not correct_extension(filename)):
        return jsonify({'msg': 'Image extension not allowed. Allowed extensions: [jpg, jpeg, png].'}), 400

    user = Users.query.filter(Users.public_id == identity).first()
    if not user:
        return jsonify({'msg': 'Unknown user in token.'}), 401  

    filename = secure_filename(filename)
    img_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    img.save(img_path)

    report = Reports(
        public_id=str(uuid.uuid4()),
        name=form['name'],
        image_path=img_path,
        resolution=form['resolution'],
        aspect_ratio=form['aspectRatio'],
        model=form['model'],
        timestamp=int(form['timestamp']),
        client_class=form['clientClass'],
        client_confidence=float(form['clientConfidence']),
        client_time_image=int(form['clientTimeImage']),
        client_time_prediction=int(form['clientTimePrediction']),
        client_time_processing=int(form['clientTimeProcessing']),
        server_class=form['serverClass'],
        server_confidence=float(form['serverConfidence']),
        server_time_image=int(form['serverTimeImage']),
        server_time_prediction=int(form['serverTimePrediction']),
        server_time_processing=int(form['serverTimeProcessing']),
        server_time_response=int(form['serverTimeResponse']),
    )
    user.reports.append(report)

    db.session.add(report)
    db.session.add(user)
    db.session.commit()

    return jsonify({'msg': 'Report saved successfully.'}), 200


# Startup:
if __name__ == '__main__':
    app.run(debug=True)
