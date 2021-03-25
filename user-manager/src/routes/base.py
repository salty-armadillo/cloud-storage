import json
from flask import Blueprint
from services.base import fetch_filenames

BASE = Blueprint('base', __name__)

@BASE.route('/healthcheck', methods=['GET'])
def base():
    return "user-manager healthcheck successful. Connected!"

@BASE.route('/filenames', methods=['GET'])
def get_filenames():
    '''Get list of all files currently uploaded'''
    filenames = fetch_filenames()
    return json.dumps(filenames)