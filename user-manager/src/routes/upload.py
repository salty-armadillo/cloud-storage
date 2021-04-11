import json
from flask import Blueprint, request
from jsonschema import validate
from services.upload import post_file
from services.security import scan_file

UPLOAD = Blueprint('upload', __name__)

@UPLOAD.route('/upload', methods=['POST'])
def upload_file():
    '''Upload file given filename'''
    payload = request.get_json()
    filepath = payload.get("filepath")
    keylocation = payload.get("keylocation")
    keypath = payload.get("keypath")
    post_file(filepath, keypath, keylocation)
    return json.dumps({})

@UPLOAD.route('/upload/scan', methods=['POST'])
def scan():
    '''Scans file(s) for sensitive data'''
    payload = request.get_json()
    filepath = payload.get("filepath")
    issues = scan_file(filepath)
    return json.dumps(issues)