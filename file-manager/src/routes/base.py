import json
from flask import Blueprint, request
from services.base import fetch_filenames

BASE = Blueprint('base', __name__)

@BASE.route('/healthcheck', methods=['GET'])
def base():
    return "file-manager healthcheck successful. Connected!"

@BASE.route('/filenames', methods=['GET'])
def get_filenames():
    '''Get list of all files currently uploaded'''
    filenames = fetch_filenames("enc-bucket-6841")
    return json.dumps(filenames)