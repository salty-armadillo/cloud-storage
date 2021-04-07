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
    filenames = fetch_filenames()
    return json.dumps(filenames)

@BASE.route('/file', methods=['DELETE'])
def delete_file():
    '''Deletes file from the cloud storage'''
    filename = request.args.get("filename")
    remove_file(filename)
    return json.dumps({})

@BASE.route('/shutdown', methods=['GET'])
def shutdown_server():
    '''Graceful shutdown of the server'''
    shutdown = request.environ.get('werkzeug.server.shutdown')
    shutdown()
    return json.dumps({})
