from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.asymmetric import rsa,padding
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.serialization import load_pem_private_key,load_pem_public_key
from Crypto.Cipher import AES
import os
import json
import base64


#generate 16bytes key for AES encrypt and decrypt
def generate_16bytes_key():
    key = os.urandom(AES.block_size)
    return key

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


def encrypt_signature(block_dict,admin_public_key,voter_private_key,AES_key):

    voter_private_key=load_pem_private_key(voter_private_key,password=None)
    admin_public_key=load_pem_public_key(admin_public_key,backend=None)

    #convert block_dict to json format
    info=json.dumps(block_dict,sort_keys=True).encode()
    
    #signature
    signature=voter_private_key.sign(info,padding.PSS(mgf=padding.MGF1(hashes.SHA256()),salt_length=padding.PSS.MAX_LENGTH),hashes.SHA256())
    #encrypt info by AES
    #creat a AES cipher object
    cipher_encrypt=AES.new(AES_key,AES.MODE_CFB)
    ciphered_data = cipher_encrypt.encrypt(info)
    
    iv = cipher_encrypt.iv

    encrypt_aes_key=admin_public_key.encrypt(AES_key,padding.OAEP(mgf=padding.MGF1(algorithm=hashes.SHA256()),algorithm=hashes.SHA256(),label=None))

    #Conversion to JSON transferrable data
    b64_encrypt_aes_key = base64.b64encode(encrypt_aes_key)
    b64_signature = base64.b64encode(signature)
    b64_ciphered_data=base64.b64encode(ciphered_data)
    b64_iv=base64.b64encode(iv)
    b64_encrypt_aes_key = b64_encrypt_aes_key.decode("utf-8")
    b64_signature = b64_signature.decode("utf-8")
    b64_ciphered_data=b64_ciphered_data.decode("utf-8")
    b64_iv=b64_iv.decode("utf-8")
    encrypt_and_signature=(b64_encrypt_aes_key, b64_signature,b64_ciphered_data, b64_iv)

    #encrypt_and_signature[0] is encrypt_aes_key, encrypt_and_signature[1] is the signature,encrypt_and_signature[2] is encrypted info by AES, and iv is initial block for plaintext
    return encrypt_and_signature