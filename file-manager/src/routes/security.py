import json
from flask import Blueprint, request

from services.security import save_public_key, remove_public_key

SECURITY = Blueprint('security', __name__)

@SECURITY.route('/rsa/upload', methods=['POST'])
def upload_rsa_key():
    '''Save the RSA Public key file'''
    publicKey = request.files.get("file")
    
    if publicKey.filename.endswith("publicRSAKey.pem"):
        publicKeyName = save_public_key(publicKey)

    return json.dumps({ "keyFileName": publicKeyName })

@SECURITY.route('/rsa/delete', methods=['DELETE'])
def remove_rsa_key():
    '''Removes the given RSA Public key when a local application is shutting down'''
    filename = request.args.get("keyFileName")
    remove_public_key(filename)
    return json.dumps({})
