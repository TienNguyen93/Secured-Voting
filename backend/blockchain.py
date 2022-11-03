from blake3 import blake3
import json
from datetime import datetime
from urllib.parse import urlparse
import requests
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
        self.nodes = set()
        self.chain = []
        self.verified_votes = []
        self.to_be_verified_votes = []
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
    # @param encrypt_and_signature: encrypted and signed vote by voter
    # @return True if the vote is verified and False if it was tampered
    def verify_vote(self, admin_private_key, voter_public_key, encrypt_and_signature):
        #load keys
        admin_priv_key = load_pem_private_key(admin_private_key,password=None)
        voter_pub_key = load_pem_public_key(voter_public_key,backend=None)
        
        encrypted_info = encrypt_and_signature[0]
        signature = encrypt_and_signature[1]
        #decrypt for info
        info = admin_priv_key.decrypt(encrypted_info,padding.OAEP(mgf=padding.MGF1(algorithm=hashes.SHA256()),algorithm=hashes.SHA256(),label=None))
        #verification
        try:
            voter_pub_key.verify(signature,info,padding.PSS(mgf=padding.MGF1(hashes.SHA256()),salt_length=padding.PSS.MAX_LENGTH),hashes.SHA256())
            decoded_vote = json.loads(info)
            self.verified_votes.append(decoded_vote)
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


    # Consensus Algorithm (Proof Of Authority) that resolves conflicts by
    # copying the main admin chain to the peer nodes in the network
    # @return True if the nodes were updated, False if not
    def resolve_conflicts(self):
        if len(self.nodes) == 0:
            return False

        neighbours = self.nodes
        # Get the main chain from admin: http://127.0.0.1:5000
        response = requests.get("http://127.0.0.1:5000/chain")
        chain = response.json()['chain']
        headers = {'Content-Type': "application/json"}

        # Update all the nodes in our network
        for node in neighbours:
            requests.post(f'http://{node}' + "/update_node", data=json.dumps(chain), headers=headers)
        
        return True
        

    # Add a new node to the list of nodes
    # @param address: address of the node. Ex. 'http://192.168.0.5:5000'
    def register_node(self, address):
        parsed_url = urlparse(address)
        self.nodes.add(parsed_url.netloc)

    


