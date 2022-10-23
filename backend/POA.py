
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.asymmetric import rsa,padding
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.serialization import load_pem_private_key,load_pem_public_key
import json

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




def encrypt_signature(block_dict,admin_public_key,voter_private_key):

    voter_private_key=load_pem_private_key(voter_private_key,password=None)
    admin_public_key=load_pem_public_key(admin_public_key,backend=None)


    #convert block_dict to json foramt
    info=json.dumps(block_dict,sort_keys=True).encode()
    

    #signature
    signature=voter_private_key.sign(info,padding.PSS(mgf=padding.MGF1(hashes.SHA256()),salt_length=padding.PSS.MAX_LENGTH),hashes.SHA256())
    
    #encrypt for info
    encrypt_info=admin_public_key.encrypt(info,padding.OAEP(mgf=padding.MGF1(algorithm=hashes.SHA256()),algorithm=hashes.SHA256(),label=None))

   
    encrypt_and_signature=(encrypt_info,signature)
    #encrypt_and_signature[0] is encrypt_info, encrypt_and_signature[1] is the signature
    return encrypt_and_signature



# proof of authority, verify if data has been tampered with

def poa(admin_private_key,voter_public_key,encrypt_and_signature):
    #load keys
    admin_private_key=load_pem_private_key(admin_private_key,password=None)
    voter_public_key=load_pem_public_key(voter_public_key,backend=None)
    
    encrypted_info=encrypt_and_signature[0]
    signature=encrypt_and_signature[1]
    #decrypt for info
    info=admin_private_key.decrypt(encrypted_info,padding.OAEP(mgf=padding.MGF1(algorithm=hashes.SHA256()),algorithm=hashes.SHA256(),label=None))
    
    #verification
    try:
        voter_public_key.verify(signature,info,padding.PSS(mgf=padding.MGF1(hashes.SHA256()),salt_length=padding.PSS.MAX_LENGTH),hashes.SHA256())
        return True
    except:
        return False
    

#check block's validity
def is_valid_chain(chain):
    #first block's previous hash
    pre_hash="0"
    for block in chain:
        #record current block hash as next block's previous hash
        current_hash=block.hash

        #check if previous_hash is modified
        if pre_hash!=block.previous_hash:
            return False
        pre_hash=current_hash
    return True

