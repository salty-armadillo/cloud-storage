# Endpoint for cloud backend
CLOUD_BASE_ENDPOINT = "http://localhost:8080"

# Unique ID for the corresponding public key on the cloud backend
PUBLIC_KEY_ID = ""

def set_public_key_id(id):
    '''Sets the ID of the public key file on the cloud backend'''
    global PUBLIC_KEY_ID
    PUBLIC_KEY_ID = id

    return