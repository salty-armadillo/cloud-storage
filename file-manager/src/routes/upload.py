import json
from flask import Blueprint, request
from jsonschema import validate
from services.upload import get_presigned_url

UPLOAD = Blueprint('upload', __name__)

@UPLOAD.route('/upload', methods=['POST'])
def upload_file():
    '''Upload file given filename'''
    filename = request.args.get("filename")
    response = get_presigned_url("enc-bucket-6841", filename)
    return response