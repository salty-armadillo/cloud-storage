import os
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