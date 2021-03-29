'''
Miscellaneous functions related to the security 
functionality of the application
'''

import os
import requests
import jwt
from Crypto.PublicKey import RSA
import config

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
        raise Exception("Unable to set up authentication protocol. Shutting down application...")

    keyFileName = uploadResponse.json().get("keyFileName")

    config.set_public_key_id(keyFileName)

    return

def cleanup_rsa_pair():
    '''Cleans up the RSA key pair upon application shutdown - both local and on the remote'''
    requests.delete(
        f"{CLOUD_BASE_ENDPOINT}/rsa/delete?keyFileName={config.PUBLIC_KEY_ID}"
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
