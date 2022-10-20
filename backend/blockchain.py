from blake3 import blake3
import json
from datetime import datetime
from urllib.parse import urlparse
from POA import encrypt_signature


class Block:

    # Constructor that initializes the Block with passed parameters
    # @param block_index: index number of the block in the chain
    # @param timestamp: the date and time when the vote was casted
    # @param voter_pub_key: voter's public key that he used to cast the vote with
    # @param candidate: the candidate for whom the voter voted for
    # @param prev_hash: the hash of the previous block in the chain
    def __init__(self, block_index, timestamp, voter_pub_key, candidate, prev_hash):
        self.index = block_index
        self.timestamp = timestamp
        self.voter = voter_pub_key
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
    def __init__(self, election_info):
        self.index = 0
        self.timestamp = datetime.now()
        self.election = election_info
        self.prev_hash = "0"
    

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
        self.nodes = set()
        self.votes = []
        genesis_block = Genesis_Block(election_info)
        genesis_block.hash = genesis_block.compute_hash()
        self.chain.append(genesis_block)


    # Creates a Block with voter's public key and the candidate's name
    # for whom the voter casted his vote for 
    # @param voter_pub_key: public key used by the voter to cast his vote
    # @param candidate: candidate's name for whom voter voted for
    # @return the hashed Block containing the vote
    def create_a_block(self, voter_pub_key, candidate):
        block_index = len(self.chain)
        timestamp = datetime.now()
        prev_hash = self.get_last_block().hash
        block = Block(block_index, timestamp, voter_pub_key, candidate, prev_hash)
        block.hash = block.compute_hash()
        return block


    # Creates digitally signed vote 
    # @param voter_pub_key: public key used by the voter to cast his vote
    # @param candidate: candidate's name for whom voter voted for
    # @return digitally signed vote
    def create_the_vote(self, voter_pub_key, candidate):
        block = self.create_a_block(voter_pub_key, candidate)
        signed_vote = encrypt_signature(block.__dict__, voter_pub_key)
        return signed_vote


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

    # Add a new node to the list of nodes
    # @param address: Address of node. Eg. 'http://192.168.0.5:5000'
    def register_node(self, address):
        parsed_url = urlparse(address)
        self.nodes.add(parsed_url.netloc)
        



