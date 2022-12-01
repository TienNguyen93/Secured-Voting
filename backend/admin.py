from POA import *
from blockchain import *

class AdminPerson:
    # Constructor that initializes the admin class 
    # Admin's public and private keys are generated
    def __init__(self):
        keys = generate_keys()
        self.priv_key = keys[0]
        self.pub_key = keys[1]
        
    
    #count the number of votes for each candidate
    def count_vote(self,blockchain):
        candidates_vote = {}
        #count vote except genesis block
        for i in range(1,len(blockchain.chain)):
            if str(blockchain.chain[i].candidate) not in candidates_vote.keys():
                candidates_vote[str(blockchain.chain[i].candidate)]=1
            else:
                candidates_vote[str(blockchain.chain[i].candidate)]+=1
        vote_result=candidates_vote

        #record  timestamp of result
        self.result_timestamp=datetime.now()
        return vote_result