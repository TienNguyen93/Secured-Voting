from POA import *
from blockchain import *

class Admin:
    #Constructor that initializes the admin class with given election information
    #@param election_info:election information blockchain makes
    def __init__(self,election_info):
        self.candidates=[]
        self.candidates_vote={}
        self.blockchain = Blockchain(election_info)

    #set up candidates and store their names
    #@param candidate_name: names of candidates
    def setup_candidates(self,new_candidate):
        #check if candidates have already existed
        for candidate in self.candidates:
            if candidate==new_candidate:
                return False
                
        self.candidates.append(new_candidate)
        return True
    
    #count the number of votes for each candidate
    def count_vote(self):
        #initialize candidates' number of vote to 0
        for candidate in self.candidates:
            self.candidates_vote[candidate]=0
        
        #count vote except genesis block
        for i in range(1,len(self.blockchain.chain)):
            self.candidates_vote[self.blockchain.chain[i].candidate]+=1
        vote_result=self.candidates_vote

        #record  timestamp of result
        self.result_timestamp=datetime.now()
        return vote_result
    
    








    

































