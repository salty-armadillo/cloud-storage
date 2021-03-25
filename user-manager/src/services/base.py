import requests
import config

CLOUD_BASE_ENDPOINT = config.CLOUD_BASE_ENDPOINT

def fetch_filenames():
    '''Returns list of all files''' 
    filenamesResponse = requests.get(
        f"{CLOUD_BASE_ENDPOINT}/filenames"
    )

    if filenamesResponse.status_code != 200:
        raise filenamesResponse("An error has occurred. Could not obtain list of files from cloud.")
    
    files = filenamesResponse.json()

    return files