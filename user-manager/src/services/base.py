from flask import g
import requests
from werkzeug.exceptions import InternalServerError
import config

CLOUD_BASE_ENDPOINT = config.CLOUD_BASE_ENDPOINT

def fetch_filenames():
    '''Returns list of all files'''
    filenamesResponse = requests.get(
        f"{CLOUD_BASE_ENDPOINT}/filenames",
        headers=g.headers
    )

    if filenamesResponse.status_code != 200:
        raise InternalServerError("An error has occurred. Could not obtain list of files from cloud.")
    
    files = filenamesResponse.json()

    return files

def remove_file(filename):
    '''Removes file from cloud storage'''
    removeFileResp = requests.delete(
        f"{CLOUD_BASE_ENDPOINT}/file?filename={filename}",
        headers=g.headers
    )

    if removeFileResp.status_code != 200:
        raise InternalServerError("An error has occurred. Unable to delete remove from cloud.")

    return