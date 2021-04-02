import json
from flask import Blueprint, request
from services.base import fetch_filenames, remove_file

BASE = Blueprint('base', __name__)

@BASE.route('/healthcheck', methods=['GET'])
def base():
    return "user-manager healthcheck successful. Connected!"

@BASE.route('/filenames', methods=['GET'])
def get_filenames():
    '''Get list of all files currently uploaded'''
    headers = request.headers
    token = headers.get("Authorization")
    publicKeyId = headers.get("key")
    filenames = fetch_filenames(token, publicKeyId)
    return json.dumps(filenames)

@BASE.route('/file', methods=['DELETE'])
def delete_file():
    '''Deletes file from the cloud storage'''
    filename = request.args.get("filename")
    remove_file(filename)
    return json.dumps({})