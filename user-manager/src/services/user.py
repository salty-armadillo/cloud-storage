import os
import requests
from werkzeug.exceptions import InternalServerError, BadRequest
import bcrypt
import config

CLOUD_BASE_ENDPOINT = config.CLOUD_BASE_ENDPOINT

def check_password_dictionary(password):
    '''Checks the given password against the rockyou.txt file which contains common passwords'''
    dirPath = os.path.dirname(__file__)
    filepath = os.path.join(dirPath, '../resources/rockyou.txt')

    with open(filepath, 'r', encoding='utf-8') as file:
        for p in file:
            if password.upper() == p.strip().upper():
                raise BadRequest("Given password is too common. Please try again.")

    return

def hash_password(password):
    '''Hashes the given password with the bcrypt function'''
    salt = bcrypt.gensalt()
    passwordHash = bcrypt.hashpw(password.encode('utf8'), salt)
    return passwordHash
 
def add_user(username, email, password):
    '''Creates a new user'''

    if len(password) < 8:
        raise BadRequest("The password is too short.")
    elif len(password) > 64:
        raise BadRequest("The password is too long.")

    check_password_dictionary(password)

    passwordHash = hash_password(password)

    payload = {
        "username": username,
        "email": email,
        "password": passwordHash.decode('utf8')
    }

    createUserResp = requests.post(
        f"{CLOUD_BASE_ENDPOINT}/user/create",
        json=payload
    )

    if createUserResp.status_code != 200:
        raise InternalServerError(createUserResp.json()["description"])

    return
