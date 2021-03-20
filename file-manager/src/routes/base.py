import json
from flask import Blueprint, request
from services.base import fetch_filenames

BASE = Blueprint('base', __name__)

@BASE.route('/', methods=['GET'])
def base():
    return "can connect!"

@BASE.route('/filenames', methods=['GET'])
def get_filenames():
    '''Get list of all files currently uploaded'''
    filenames = fetch_filenames("enc-bucket-6841")
    return json.dumps(filenames)