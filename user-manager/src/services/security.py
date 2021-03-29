'''
Miscellaneous functions related to the security 
functionality of the application
'''

import os
from Crypto.PublicKey import RSA

def gen_rsa_pair():
    '''Generates a private and public RSA key-pair and stores them in resources/'''
    dirPath = os.path.dirname(__file__)
    privateKeyPath = os.path.join(dirPath, '../resources/privateRSAKey.pem')
    publicKeyPath = os.path.join(dirPath, '../resources/publicRSAKey.pem')

    rsaKey = RSA.generate(2048)
    privateRSAKey = rsaKey.export_key()
    with open(privateKeyPath, "wb") as privFile:
        privFile.write(privateRSAKey)

    publicRSAKey = rsaKey.publickey().export_key()
    with open(publicKeyPath, "wb") as pubFile:
        pubFile.write(publicRSAKey)

    return
