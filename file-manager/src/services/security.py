import os
import jwt
from werkzeug.exceptions import Unauthorized
import config

def save_public_key(file):
    '''Saves a given private key for a new local application'''
    dirPath = os.path.dirname(__file__)
    keyDirPath = os.path.join(dirPath, "../resources/keys/")

    file.filename = f"PublicKey-{config.PUBLIC_KEY_COUNTER}.pem"
    file.save(os.path.join(keyDirPath, file.filename))

    config.increment_public_key()

    return file.filename

def remove_public_key(filename):
    '''Removes the given public key from the keys folder'''
    dirPath = os.path.dirname(__file__)
    keyDirPath = os.path.join(dirPath, "../resources/keys/")

    filepath = os.path.join(keyDirPath, filename)

    if os.path.exists(filepath):
        os.remove(filepath)

    return

def decode_jwt_token(token, keyFileName):
    '''Verifies a JWT Token and returns the username'''
    dirPath = os.path.dirname(__file__)
    keyPath = os.path.join(dirPath, f"../resources/keys/{keyFileName}")

    with open(keyPath, "rb") as f:
        keyData = f.read()

    try: 
        payload = jwt.decode(token, keyData, algorithms=["RS256"])
        username = payload.get("username")
        
        if username is None:
            raise Unauthorized("Unauthorized access. Token was not accepted, please try again.")
    except:
        raise Unauthorized("Unauthorized access. Token was not accepted, please try again.")

    return username
