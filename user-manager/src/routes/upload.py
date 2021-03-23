import json
from flask import Blueprint, request
from jsonschema import validate
from services.upload import post_file

UPLOAD = Blueprint('upload', __name__)

@UPLOAD.route('/upload', methods=['POST'])
def upload_file():
    '''Upload file given filename'''
    filepath = request.args.get("filepath")
    post_file(filepath)
    return json.dumps({})