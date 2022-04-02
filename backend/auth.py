from functools import wraps
from flask import request, jsonify
import jwt

from app import app
from schema import Users


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
