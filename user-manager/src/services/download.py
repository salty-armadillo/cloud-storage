import os
from flask import g
import requests
import json
from werkzeug.exceptions import InternalServerError, NotFound
from base64 import b64decode
from Crypto.Cipher import AES
from Crypto.Util.Padding import unpad
import config

CLOUD_BASE_ENDPOINT = config.CLOUD_BASE_ENDPOINT

def get_file(filename, location, keypath):
    '''Gets pre-signed URL from the cloud and downloads the file'''
    presignedResponse = requests.get(
        f"{CLOUD_BASE_ENDPOINT}/download?filename={filename}",
        headers=g.headers
    )

    if presignedResponse.status_code != 200:
        raise InternalServerError("An error has occurred. Could not obtain file from cloud.")
    
    presignedUrl = presignedResponse.text

    downloadResponse = requests.get(presignedUrl)
    filePath = f"{location}\{filename}"

    decrypt_file(downloadResponse.content, filePath, keypath)
    return

def decrypt_file(fileData, filePath, keypath):
    '''Creates a decrypted version of the provided file'''

    if keypath is None:
        raise NotFound("Please provide a key file to decrypt the file.")

    with open(keypath, 'r') as keyFile:
        keyData = json.load(keyFile)
        key = b64decode(keyData['key'])
        iv = b64decode(keyData['iv'])
        print(key, iv)
    cipher = AES.new(key, AES.MODE_CBC, iv)

    try:
        decData = unpad(cipher.decrypt(fileData), AES.block_size)
    except:
        raise InternalServerError("Unsuccessful decryption of the file. Please ensure the correct key is provided.")

    with open(filePath, "wb") as decFile:
        decFile.write(decData)
    
    return
