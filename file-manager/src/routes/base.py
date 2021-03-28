import json
from flask import Blueprint, request
from services.base import fetch_filenames, remove_file

BASE = Blueprint('base', __name__)

@BASE.route('/healthcheck', methods=['GET'])
def base():
    return "file-manager healthcheck successful. Connected!"

@BASE.route('/filenames', methods=['GET'])
def get_filenames():
    '''Get list of all files currently uploaded'''
    filenames = fetch_filenames("enc-bucket-6841")
    return json.dumps(filenames)

@BASE.route('/file', methods=['DELETE'])
def delete_file():
    '''Removes the given file from S3 bucket'''
    filename = request.args.get("filename")
    remove_file("enc-bucket-6841", filename)
    return json.dumps({})