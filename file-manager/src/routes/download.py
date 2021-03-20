import json
from flask import Blueprint, request
from jsonschema import validate
from services.download import get_presigned_url

DOWNLOAD = Blueprint('download', __name__)

@DOWNLOAD.route('/download', methods=['GET'])
def download_file():
    '''Download file given filename'''
    filename = request.args.get("filename")
    url = get_presigned_url("enc-bucket-6841", filename)
    return url
