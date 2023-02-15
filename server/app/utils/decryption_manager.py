import rsa
import os
from base64 import b64decode


def getDecryptedSecret(secretName):

    # Get the file with the private key 
    private_key_path = os.getenv("PRIVATE_KEY_PATH")
    
    # Load the private key
    private_key = open(private_key_path, "r").read()
    private_key = rsa.PrivateKey.load_pkcs1(private_key)

    # Decrypt the encrypted data
    encrypted_data = open("../encSecrets/%s.enc" % secretName, "rb").read()
    decrypted_data = rsa.decrypt(encrypted_data, private_key)

    return decrypted_data.decode("utf-8").strip()