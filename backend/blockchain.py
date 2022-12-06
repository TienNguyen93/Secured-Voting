from blake3 import blake3
import json
from datetime import datetime
from POA import *


class Block:

    # Constructor that initializes the Block with passed parameters
    # @param block_index: index number of the block in the chain
    # @param timestamp: the date and time when the vote was casted
    # @param voter_id: voter's id 
    # @param candidate: the candidate for whom the voter voted for
    # @param prev_hash: the hash of the previous block in the chain
    def __init__(self, block_index, timestamp, voter_id, candidate, prev_hash):
        self.index = block_index
        self.timestamp = timestamp
        self.voter = voter_id
        self.candidate = candidate
        self.prev_hash = prev_hash
    

    # Returns the calculated hash for the given Block
    def compute_hash(self):
        block_string = (json.dumps(self.__dict__, sort_keys=True, default=str)).encode()
        hash_hex = blake3(block_string).hexdigest()
        return hash_hex


class Genesis_Block:

    # Constructor that initializes the Genesis Block with given election information
    # @param election_info: the current election information for which Blockchain will be created
    def __init__(self, election_info, index=0, timestamp=datetime.now(), prev_hash="0"):
        self.index = index
        self.timestamp = timestamp
        self.election = election_info
        self.prev_hash = prev_hash
    

    # Returns the calculated hash for the given Block
    def compute_hash(self):
        block_string = (json.dumps(self.__dict__, sort_keys=True, default=str)).encode()
        hash_hex = blake3(block_string).hexdigest()
        return hash_hex


class Blockchain:

    # Constructor for Blockchain. 
    # Genesis Block gets initialized with passed election information
    # @param election_info: the current election information
    def __init__(self, election_info):
        self.chain = []
        genesis_block = Genesis_Block(election_info)
        genesis_block.hash = genesis_block.compute_hash()
        self.chain.append(genesis_block)


    # Creates a Block with voter's id and the candidate's name
    # for whom the voter casted his vote for 
    # @param voter_id: voter's id
    # @param candidate: candidate's name for whom voter voted for
    # @return the hashed Block containing the vote
    def create_a_block(self, voter_id, candidate):
        block_index = len(self.chain)
        timestamp = datetime.now()
        prev_hash = self.get_last_block().hash
        block = Block(block_index, timestamp, voter_id, candidate, prev_hash)
        block.hash = block.compute_hash()
        return block


    # Verify the voter's vote and adds it to the list of verified votes 
    # @param admin_private_key: admin's private key
    # @param voter_public_key: voter's public key
    # @param encrypt_and_signature: voter's encrypted and signed vote
    # @return True if the vote is verified and False if it was tampered
    def verify_vote(self, admin_private_key, voter_public_key, encrypt_and_signature):

        # convert values in tuple to byte
        encrypt_and_signature = (base64.b64decode(encrypt_and_signature[0].encode()), base64.b64decode(encrypt_and_signature[1].encode()), base64.b64decode(encrypt_and_signature[2].encode()), base64.b64decode(encrypt_and_signature[3].encode())) 

        # load keys
        admin_private_key=load_pem_private_key(admin_private_key,password=None)
        voter_public_key=load_pem_public_key(voter_public_key,backend=None)
        
        encrypted_aes_key = encrypt_and_signature[0]
        signature = encrypt_and_signature[1]
        
        #RSA decrypt 
        aes_key = admin_private_key.decrypt(encrypted_aes_key, padding.OAEP(mgf=padding.MGF1(algorithm=hashes.SHA256()), algorithm=hashes.SHA256(),label=None))
        #AES decrypt
        cipher_decrypt = AES.new(aes_key,AES.MODE_CFB,encrypt_and_signature[3])
        decrypt_info = cipher_decrypt.decrypt(encrypt_and_signature[2])
        #verification
        try:
            voter_public_key.verify(signature,decrypt_info,padding.PSS(mgf=padding.MGF1(hashes.SHA256()),salt_length=padding.PSS.MAX_LENGTH),hashes.SHA256())
            return True
        except:
            return False


    # Gets the last Block in the Blockchain
    def get_last_block(self):
        return self.chain[-1]


    # Adds the verified Block to the Blockchain
    # @param block: verified Block
    def add_block_to_the_chain(self, block):
        self.chain.append(block)


    # Checks the Blockchain's validity
    # @return True if the Blockchain is valid and False if it was modified
    def is_valid_chain(self):
        # Genesis Block's previous hash
        previous_hash = "0"
        for block in self.chain:
            # check if Block is modified
            if previous_hash != block.prev_hash: 
                return False
            # record current Block's hash as next Block's previous hash
            previous_hash = block.hash
        return True

    
    # Clears / Resets the Blockchain
    def clear_the_chain(self):
        self.chain = []