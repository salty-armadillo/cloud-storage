# Upload demo code referenced from - https://boto3.amazonaws.com/v1/documentation/api/latest/guide/s3-presigned-urls.html

import os
import requests
from werkzeug.exceptions import InternalServerError
import json
from base64 import b64encode, b64decode
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad
from Crypto.Random import get_random_bytes
import config

CLOUD_BASE_ENDPOINT = config.CLOUD_BASE_ENDPOINT

def post_file(filepath, keypath, keylocation):
    '''Gets pre-signed url from the cloud and uploads file'''

    filename = filepath.split("/")[-1]

    presignedResponse = requests.post(
            f"{CLOUD_BASE_ENDPOINT}/upload?filename={filename}"
        )

    if presignedResponse.status_code != 200:
        raise InternalServerError("An error has occurred. Could not upload file to the cloud.")

    presignedResponsePayload = presignedResponse.json()
    
    encrypt_file(filepath, keypath, keylocation)

    with open(f"{filepath}.enct", 'rb') as f:
        files = {'file': (filename, f)}
        uploadResponse = requests.post(
            presignedResponsePayload['url'],
            data=presignedResponsePayload['fields'],
            files=files
        )
    
    if uploadResponse.status_code != 204:
        raise InternalServerError("An error has occurred. Could not upload file to the cloud.")

    if os.path.exists(f"{filepath}.enct"):
        os.remove(f"{filepath}.enct")

    return

def encrypt_file(filepath, keypath, keylocation):
    '''Creates an encrypted version of the provided file'''
    if keypath is None:
        key = get_random_bytes(16)
        cipher = AES.new(key, AES.MODE_CBC)
        iv = b64encode(cipher.iv).decode('utf-8')
        with open(f"{keylocation}/key.json", "w") as f:
            json.dump({ "key": b64encode(key).decode('utf-8'), "iv": iv }, f)
    else:
        with open(keypath, 'r') as keyFile:
            keyData = json.load(keyFile)
            key = b64decode(keyData['key'])
            iv = b64decode(keyData['iv'])
        cipher = AES.new(key, AES.MODE_CBC, iv)

    with open(filepath, 'rb') as file:
        fileData = file.read()

    encData = cipher.encrypt(pad(fileData, AES.block_size))

    with open(f"{filepath}.enct", "wb") as encFile:
        encFile.write(encData)

    return
