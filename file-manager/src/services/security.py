import os
import jwt
from werkzeug.exceptions import Unauthorized
import pathlib
import re
import config

def save_public_key(file):
    '''Saves a given private key for a new local application'''
    pathlib.Path("/tmp/keys").mkdir(parents=True, exist_ok=True) 
    keyDirPath = "/tmp/keys"

    existingKeys = [ f for f in os.listdir(keyDirPath) if f.endswith(".pem")]
    nextKey = int(re.split("[-.]", existingKeys[-1])[1]) + 1 if len(existingKeys) > 0 else 0

    file.filename = f"PublicKey-{nextKey}.pem"
    file.save(os.path.join(keyDirPath, file.filename))

    return file.filename

def remove_public_key(filename):
    '''Removes the given public key from the keys folder'''
    keyDirPath = "/tmp/keys"

    filepath = os.path.join(keyDirPath, filename)

    if os.path.exists(filepath):
        os.remove(filepath)

    return

def decode_jwt_token(token, keyFileName):
    '''Verifies a JWT Token and returns the username'''
    if token is None or keyFileName is None:
        raise Unauthorized("Unauthorized access. Token was not accepted, please try again.")

    if token.startswith("Bearer "):
        token = token[len("Bearer "):]

    keyPath = f"/tmp/keys/{keyFileName}"

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
