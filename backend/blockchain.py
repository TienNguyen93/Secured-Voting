from blake3 import blake3
import json
from datetime import datetime

# from POA import generate_keys

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
        block_string = (json.dumps(self.__dict__, sort_keys=True)).encode()
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

    def __init__(self, election_info):
        self.chain = []
        genesis_block = Genesis_Block(election_info)
        genesis_block.hash = genesis_block.compute_hash()
        self.chain.append(genesis_block)

    def create_a_block(self, voter_pub_key, candidate):
        block_index = len(self.chain)
        timestamp = datetime.now()
        prev_hash = self.get_last_block().hash
        block = Block(block_index, timestamp, voter_pub_key, candidate, prev_hash)
        block.hash = block.compute_hash()
        return block

    def get_last_block(self):
        return self.chain[-1]

    def add_block_to_the_chain(self, block):
        """
        if not self.is_valid_chain(block):
            return False
        """

        self.chain.append(block)

    """
    def is_valid_chain(self, chain)
    """

    """
    def poa(private_key,signature) 
    """
        



