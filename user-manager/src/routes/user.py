import json
from flask import Blueprint, request
from services.user import add_user

USER = Blueprint('user', __name__)

@USER.route('/create', methods=['POST'])
def create_user():
    '''Creates a new user'''
    payload = request.get_json()
    username = payload.get("username")
    email = payload.get("email")
    password = payload.get("password")

    add_user(username, email, password)

    return json.dumps({})

