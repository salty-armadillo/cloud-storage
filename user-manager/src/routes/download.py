import json
from flask import Blueprint, request
from jsonschema import validate
from services.download import get_file

DOWNLOAD = Blueprint('download', __name__)

@DOWNLOAD.route('/download', methods=['POST'])
def download_file():
    '''Download file given filename'''
    payload = request.get_json(force=True)
    filename = payload.get("filename")
    location = payload.get("location")
    keypath = payload.get("keypath")
    get_file(filename, location, keypath)
    return json.dumps({})
