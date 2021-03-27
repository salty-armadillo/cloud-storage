import json
from flask import Blueprint, request
from jsonschema import validate
from services.download import get_file

DOWNLOAD = Blueprint('download', __name__)

@DOWNLOAD.route('/download', methods=['GET'])
def download_file():
    '''Download file given filename'''
    filename = request.args.get("filename")
    location = request.args.get("location")
    keypath = request.args.get("keypath")
    get_file(filename, location, keypath)
    return json.dumps({})
