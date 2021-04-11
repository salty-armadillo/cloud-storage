'''
Miscellaneous functions related to the security 
functionality of the application
'''

import os
import subprocess
import magic
import re
import requests
import jwt
from Crypto.PublicKey import RSA
from werkzeug.exceptions import BadRequest
import config
import constants

CLOUD_BASE_ENDPOINT = config.CLOUD_BASE_ENDPOINT

def gen_rsa_pair():
    '''Generates a private and public RSA key-pair and stores them in resources/'''
    dirPath = os.path.dirname(__file__)
    privateKeyPath = os.path.join(dirPath, '../resources/privateRSAKey.pem')
    publicKeyPath = os.path.join(dirPath, '../resources/publicRSAKey.pem')

    rsaKey = RSA.generate(2048)
    privateRSAKey = rsaKey.export_key()
    with open(privateKeyPath, "wb") as privFile:
        privFile.write(privateRSAKey)

    publicRSAKey = rsaKey.publickey().export_key()
    with open(publicKeyPath, "wb") as pubFile:
        pubFile.write(publicRSAKey)

    return

def upload_public_key():
    '''Sends a copy of the public key to the cloud backend'''
    dirPath = os.path.dirname(__file__)
    publicKeyPath = os.path.join(dirPath, '../resources/publicRSAKey.pem')

    with open(publicKeyPath, 'rb') as f:
        files = {"file": (publicKeyPath, f)}
        uploadResponse = requests.post(
            f"{CLOUD_BASE_ENDPOINT}/rsa/upload",
            files=files
        )

    if uploadResponse.status_code != 200:
        raise Exception("Unable to set up authentication protocol. Please try again...")


    keyFileName = uploadResponse.json().get("keyFileName")

    return keyFileName

def cleanup_rsa_pair(key):
    '''Cleans up the RSA key pair upon logout - both local and on the remote'''
    requests.delete(
        f"{CLOUD_BASE_ENDPOINT}/rsa/delete?keyFileName={key}"
    )

    dirPath = os.path.dirname(__file__)
    privateKeyPath = os.path.join(dirPath, '../resources/privateRSAKey.pem')
    publicKeyPath = os.path.join(dirPath, '../resources/publicRSAKey.pem')

    if os.path.exists(privateKeyPath):
        os.remove(privateKeyPath)

    if os.path.exists(publicKeyPath):
        os.remove(publicKeyPath)

    return

def encode_jwt_token(username):
    '''Generates a JWT token with the username as the payload'''
    dirPath = os.path.dirname(__file__)
    privateKeyPath = os.path.join(dirPath, '../resources/privateRSAKey.pem')

    with open(privateKeyPath, "rb") as f:
        privKey = f.read()

    token = jwt.encode(
        {
            "username": username
        },
        privKey,
        algorithm="RS256"
    )

    return token

def scan_file(filepath):
    '''Scans the given file or directory for sensitive data'''
    
    issues = []

    if os.path.isdir(filepath):
        files = [os.path.join(filepath, f) for f in os.listdir(filepath) if os.path.isfile(os.path.join(filepath, f))]
    elif os.path.isfile(filepath):
        files = [filepath]
    else:
        raise BadRequest("Unknown file type. Please ensure the selected file is a file or directory.")
    
    for f in files:
        filename = re.split(r"[\\/]", f)[-1]

         # Checking for sensitive file types
        for ext in constants.SENSITIVE_FILE_EXTS:
            if f.endswith(ext):
                issues.append({
                    "filename": filename,
                    "error": "Sensitive file type detected."
                })

        fileType = magic.from_file(f, mime=True)

        #Checking for sensitive data in text files only
        if "text" not in fileType:
            continue

        with open(f, "r") as f:
            for num, line in enumerate(f, 1):
                for s in constants.SENSITIVE_STRINGS:
                    if s in line.lower():
                        issues.append({
                            "filename": filename,
                            "error": f"Sensitive string '{s}' found on line {num}."
                        })

    return issues
    

