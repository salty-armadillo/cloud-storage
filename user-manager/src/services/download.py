import requests
from werkzeug.exceptions import InternalServerError
import config

CLOUD_BASE_ENDPOINT = config.CLOUD_BASE_ENDPOINT

def get_file(filename, location):
    '''Gets pre-signed URL from the cloud and downloads the file'''
    presignedResponse = requests.get(
        f"{CLOUD_BASE_ENDPOINT}/download?filename={filename}"
    )

    if presignedResponse.status_code != 200:
        raise InternalServerError("An error has occurred. Could not obtain file from cloud.")
    
    presignedUrl = presignedResponse.text

    downloadResponse = requests.get(presignedUrl)
    wholeFilePath = f"{location}/{filename}"

    open(wholeFilePath, "wb").write(downloadResponse.content)

    return