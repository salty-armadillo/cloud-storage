import json
from flask import Blueprint, request
from services.user import add_user, get_user

USER = Blueprint('user', __name__)

@USER.route('/create', methods=['POST'])
def create_user():
    '''Creates a new user'''
    payload = request.get_json()
    username = payload["username"]
    email = payload["email"]
    password_hash = payload["password"]
    add_user(username, email, password_hash)
    return json.dumps({})

@USER.route('/details', methods=['GET'])
def get_user_details():
    '''Retrieves user details'''
    username = request.args.get("username")
    user = get_user(username)
    return json.dumps(user)