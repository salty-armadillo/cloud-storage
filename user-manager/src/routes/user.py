import json
from flask import Blueprint, request
from services.user import add_user, get_user

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

@USER.route('/details', methods=['GET'])
def get_user_details():
    '''Get user details'''
    username = request.args.get("username")
    details = get_user(username)
    return json.dumps(details)

