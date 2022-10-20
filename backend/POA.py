from typing import KeysView
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.asymmetric import rsa,padding
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.serialization import load_pem_private_key,load_pem_public_key
import json
from hashlib import sha256

#generate private key and public key
def generate_keys():
   
    private_key = rsa.generate_private_key(public_exponent=65537,key_size=2048,)
    public_key = private_key.public_key()
    
    #PEM format of key
    pem_private_key=private_key.private_bytes(encoding=serialization.Encoding.PEM,format=serialization.PrivateFormat.PKCS8,encryption_algorithm=serialization.NoEncryption())
    pem_public_key= public_key.public_bytes(encoding=serialization.Encoding.PEM,format=serialization.PublicFormat.SubjectPublicKeyInfo)
    pair_of_key=(pem_private_key,pem_public_key)

    #pair_of_key[0] is private_key, pair_of_key[1] is public_key
    return pair_of_key


def encrypt_signature(block_dict,public_key):
    public_key=load_pem_public_key(public_key,backend=None)
    #convert block_dict to json format
    block_dict_to_string = json.dumps(block_dict, sort_keys=True, default=str)

    # encrypt and signature
    digest=sha256(block_dict_to_string.encode()).hexdigest()
    digest=digest.encode()
    encrypt_vote=public_key.encrypt(
        digest,
        padding.OAEP(mgf=padding.MGF1(algorithm=hashes.SHA256()),algorithm=hashes.SHA256(),label=None)
    )

    #signature[0] is original info, signature[1] is the signature
    signature=(block_dict_to_string,encrypt_vote)

    return signature



# proof of authority, verify if data has been tampered with
def poa(private_key,signature):
    private_key=load_pem_private_key(private_key,password=None)
    #decryption 
    encrypted_info=signature[1]
    info=signature[0]
    hash=private_key.decrypt(
        encrypted_info,
        padding.OAEP(mgf=padding.MGF1(algorithm=hashes.SHA256()),algorithm=hashes.SHA256(),label=None)
    )
    recompute_hash=sha256(info.encode()).hexdigest()
    #check if info has been tampered
    check=recompute_hash.encode()==hash
    return check