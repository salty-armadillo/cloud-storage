import json
from flask import Blueprint, request
from jsonschema import validate
import boto3

DOWNLOAD = Blueprint('download', __name__)
s3 = boto3.client('s3')

@DOWNLOAD.route('/download', methods=['GET'])
def download_file():
    '''Download file given filename'''
    filename = request.args.get("filename")
    s3.download_file('enc-bucket-6841', filename, 'test-pic.png')
    return json.dumps({})
