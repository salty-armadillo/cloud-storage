import os
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
        f"{CLOUD_BASE_ENDPOINT}/download?filename={filename}"
    )

    if presignedResponse.status_code != 200:
        raise InternalServerError("An error has occurred. Could not obtain file from cloud.")
    
    presignedUrl = presignedResponse.text

    downloadResponse = requests.get(presignedUrl)
    wholeFilePath = f"{location}\{filename}.enct"

    open(wholeFilePath, "wb").write(downloadResponse.content)

    decrypt_file(wholeFilePath, keypath)

    if os.path.exists(wholeFilePath):
        os.remove(wholeFilePath)

    return

def decrypt_file(filepath, keypath):
    '''Creates a decrypted version of the provided file'''

    if keypath is None:
        raise NotFound("Please provide a key file to decrypt the file.")

    with open(keypath, 'r') as keyFile:
        keyData = json.load(keyFile)
        key = b64decode(keyData['key'])
        iv = b64decode(keyData['iv'])
    cipher = AES.new(key, AES.MODE_CBC, iv)

    with open(filepath, "rb") as file:
        encData = file.read()

    try:
        decData = unpad(cipher.decrypt(encData), AES.block_size)
    except ValueError or KeyError:
        if os.path.exists(filepath):
            os.remove(filepath)
        raise InternalServerError("Unsuccessful decryption of the file. Please ensure the correct key is provided.")

    if filepath.endswith('.enct'):
        decFilepath = filepath[:-5]
    else:
        decFilepath = filepath

    with open(decFilepath, "wb") as decFile:
        decFile.write(decData)
    
    return
