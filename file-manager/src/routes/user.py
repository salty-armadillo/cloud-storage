import json
from flask import Blueprint, request
from services.user import create_user

USER = Blueprint('user', __name__)

@USER.route('/create', methods=['POST'])
def create_user():
    '''Creates a new user'''
    username = request.args.get("username")
    email = request.args.get("email")
    password_hash = request.args.get("password")
    create_user(username, email, password_hash)
    return