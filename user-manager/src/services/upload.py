# Upload demo code referenced from - https://boto3.amazonaws.com/v1/documentation/api/latest/guide/s3-presigned-urls.html

import requests
from werkzeug.exceptions import InternalServerError
import config

CLOUD_BASE_ENDPOINT = config.CLOUD_BASE_ENDPOINT

def post_file(filepath):
    '''Gets pre-signed url from the cloud and uploads file'''

    filename = filepath.split("\\")[-1]

    presignedResponse = requests.post(
            f"{CLOUD_BASE_ENDPOINT}/upload?filename={filename}"
        )

    if presignedResponse.status_code != 200:
        raise InternalServerError("An error has occurred. Could not upload file to the cloud.")

    presignedResponsePayload = presignedResponse.json()
    print(presignedResponsePayload['url'])

    with open(filepath, 'rb') as f:
        files = {'file': (filename, f)}
        uploadResponse = requests.post(presignedResponsePayload['url'], data=presignedResponsePayload['fields'], files=files)
    
    if uploadResponse.status_code != 204:
        raise InternalServerError("An error has occurred. Could not upload file to the cloud.")

    return