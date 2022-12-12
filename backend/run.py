from blockchain import *
from POA import *
from admin import *
from flask import Flask, jsonify, request
import requests
import base64
import json

import os
import flask
from flask_cors import CORS

from pymongo import MongoClient
from dotenv import dotenv_values, load_dotenv
from flask_pymongo import PyMongo
from typing import List
from pymongo.collection import Collection, ReturnDocument
from fastapi.encoders import jsonable_encoder
import flask
from bson.json_util import dumps

from database.models import Address, Voter, Admin, Candidate


# Instantiate our Node
app = Flask(__name__)
CORS(app)


load_dotenv()

app.config["MONGO_URI"] = os.getenv("ATLAS_URI")

mongo = PyMongo(app)
collection: Collection = mongo.db.collection
voter_collection: Collection = mongo.db.voter
admin_collection: Collection = mongo.db.admin
candidate_collection: Collection = mongo.db.candidate

# get admin
@app.route('/admin', methods=['GET'])
def get_admin():
    admins = admin_collection.find(limit=10)
    return [Admin(**admin).to_json() for admin in admins]


# add candidate
@app.route('/candidates', methods=['POST'])
def create_candidate():
    new_candidate = request.get_json()

    candidate = Candidate(**new_candidate)
    insert_result = candidate_collection.insert_one(candidate.to_json())
    created_candidate = candidate_collection.find_one({
        "_id": insert_result.inserted_id
    })
    return created_candidate


# get all candidates
@app.route('/candidates', methods=['GET'])
def get_candidates():
    candidates = candidate_collection.find(limit=100)
    return [Candidate(**candidate).to_json() for candidate in candidates]


# update vote count
@app.route('/candidates/<id>', methods=['PUT'])
def update_vote(id):
    req = flask.request.get_json()
    voteCount = req.get("voteCount", None)

    # update the fields 
    candidate = { "_id": id }
    updated_count = {"$set" : {'voteCount' : voteCount} }

    candidate_collection.update_one(candidate, updated_count)
    return {"update successfully" : 200}


# delete candidate
@app.route('/candidates/<id>', methods=['DELETE'])
def delete_candidate(id):
    deleted_candidate = candidate_collection.find_one_and_delete({"_id": id})
    if deleted_candidate:
        return {'status': 'Candidate ID' + id + ' is deleted!'}
        # return Address(**deleted_address).to_json()
    else:
        flask.abort(404, "Address not found")

# ------------------ VOTER METHODS ----------------- #

# create voter
@app.route('/voters', methods=['POST'])
def create_voter():
    new_voter = request.get_json()

    voter = Voter(**new_voter)
    insert_result = voter_collection.insert_one(voter.to_json())
    created_voter = voter_collection.find_one({
        "_id": insert_result.inserted_id
    })
    return created_voter


# get all voters
@app.route('/voters', methods=['GET'])
def get_voters():
    voters = voter_collection.find(limit=100)
    return [Voter(**voter).to_json() for voter in voters]



# /login endpoint for log in frontend
@app.route('/login', methods=['POST'])
def login():
    req = flask.request.get_json()
    email = req.get("email", None)
    password = req.get("password", None)

    if voter_collection.find_one({"email": email}):
        email_found = voter_collection.find_one({"email": email})
        if password == email_found['password']:
            return {'Voter': email_found}

    if admin_collection.find_one({"email": email}):
        email_found = admin_collection.find_one({"email": email})
        if password == email_found['password']:
            return {'Admin': email_found}

    else:
        return {"None": "none"}


# for authenticate the registered voter
@app.route('/voters/<id>', methods=['PUT'])
def register(id):
    req = flask.request.get_json()
    password = req.get("password", None)
    registered = req.get("registered", None)
    email = req.get("email", None)
    firstname = req.get("firstname", None)
    lastname = req.get("lastname", None)
    dob = req.get("dob", None)
    voted = req.get("voted", None)

    # update the fields 
    voter = { "_id": id }
    updated_pass = {"$set" : 
        {
            'password' : password, 
            'registered': registered, 
            'email': email,
            'firstname': firstname,
            'lastname': lastname,
            'dob': dob,
            'voted': voted
        }
    }
    voter_collection.update_one(voter, updated_pass)
    return {"update successfully" : 200}
    
# ------------------ END OF VOTER METHODS ----------------- #

# Blockchain
blockchain = -1
# Admin's public key
admin_pub_key = -1
admin = -1
# Set of nodes in the network
nodes = set()

# ---------------- INITIALIZATION OF NODES ---------------------

# Admin initializes itself, creates a blockchain and 
# shares its' public key with other nodes (voters)
# Each voter node registers their port in the network
@app.route('/init', methods=['POST'])
def initialize():
    global nodes
    global admin
    global admin_pub_key
    global blockchain
    headers = {'Content-Type': "application/json"}
    if port == 5000:
        admin = AdminPerson()
        blockchain = Blockchain('Election 2022')
        admin_pub_key = admin.pub_key
    # Get a copy of all registered neighbors from admin port 5000
    # And get admin public key for voting
    if port != 5000:
        response = requests.get("http://127.0.0.1:5000/get_neighbors")
        nodes = set(response.json()['neighbors'])
        response = requests.get("http://127.0.0.1:5000/get_pub_key")
        key_64 = response.json()['admin_pub_key']
        key_encoded = key_64.encode("utf-8")
        key = base64.b64decode(key_encoded)
        admin_pub_key = key
    # Update all the registered nodes in the network with new added port
    for voter in nodes:
        requests.post(f'http://127.0.0.1:{voter}/init_nodes', data=json.dumps(port), headers=headers)
    nodes.add(port)
    response = {'message': f'You are now in network'}
    return jsonify(response), 201


# Helper endpoint
@app.route('/init_nodes', methods=['POST'])
def update_nodes():
    port = request.get_json()
    nodes.add(port)
    response = {'message': f'Addeded new port to the set of nodes'}
    return jsonify(response), 201


# Helper endpoint
@app.route('/get_neighbors', methods=['GET'])
def get_neighbors():
    return json.dumps({"neighbors": list(nodes)})


# Helper endpoint
@app.route('/get_pub_key', methods=['GET'])
def get_admin_public_key():
    key = admin_pub_key
    b64_key = base64.b64encode(key)
    b64_key = b64_key.decode("utf-8")
    return json.dumps({"admin_pub_key": b64_key})


# -------------------------- VOTING ----------------------------

# Voter votes
@app.route('/vote', methods=['POST'])
def vote():
    vote = request.get_json()
    # Check that the required fields are in the POST'ed data
    required = ['voter', 'candidate']
    if not all(k in vote for k in required):
        return 'Missing values', 400

    # Generate keys for the voter
    v_priv_key, v_pub_key = generate_keys()
    aes_key = generate_16bytes_key()
    
    # Sign the vote and send it to be verified by admin
    signed_vote = encrypt_signature(vote, admin_pub_key, v_priv_key, aes_key)
    b64_v_pub_key = base64.b64encode(v_pub_key)
    b64_v_pub_key = b64_v_pub_key.decode("utf-8")
    vote["public_key"] = b64_v_pub_key
    vote["signed_vote"] = signed_vote
    headers = {'Content-Type': "application/json"}
    requests.post(f'http://127.0.0.1:5000/vote/receive', data=json.dumps(vote), headers=headers)
    response = {'message': f'Vote was successfully sent'}
    return jsonify(response), 201


# Admin receives the signed Vote
@app.route('/vote/receive', methods=['POST'])
def receive_the_vote():
    vote = request.get_json()
    b64_v_pub_key = vote["public_key"]
    v_pub_key = b64_v_pub_key.encode("utf-8")
    v_pub_key = base64.b64decode(v_pub_key)
    vote["public_key"] = v_pub_key

    if (blockchain.verify_vote(admin.priv_key, vote["public_key"], vote["signed_vote"])):
        if blockchain.is_valid_chain():
            block = blockchain.create_a_block(vote["voter"], vote["candidate"])
            blockchain.add_block_to_the_chain(block)
            requests.get("http://127.0.0.1:5000/resolve")
            response = {'message': f'Vote was successfully verified and added to the blockchain.'}
        else:
            response = {'message': f'The blockchain was tampered. Cannot add votes.'}
    else:
        response = {'message': f'Vote was tampered. Hence, it was not added to the blockchain.'}
    return jsonify(response), 201


# Returns the blockchain data
@app.route('/chain', methods=['GET'])
def full_chain():
    chain_data = []
    for block in blockchain.chain:
        chain_data.append(block.__dict__)
    return json.dumps({"length": len(chain_data),"chain": chain_data}, default=str)


# ---------------------- NODE RESOLUTION ------------------------

# Resolve all blockchains in the network with Proof Of Authority Consensus Algorithm
@app.route('/resolve', methods=['GET'])
def poa_consensus():
    global nodes
    if len(nodes) == 0:
        response = {'message': 'There are no nodes in the network'}

    # Get the main chain from admin: http://127.0.0.1:5000
    response = requests.get("http://127.0.0.1:5000/chain")
    chain = response.json()['chain']
    headers = {'Content-Type': "application/json"}

    # Update all the nodes in our network
    for node in nodes:
        requests.post(f'http://127.0.0.1:{node}' + "/resolve_node", data=json.dumps(chain), headers=headers)

    response = {'message': 'Nodes in the network were resolved'}
    return jsonify(response), 200


# Helper endpoint
@app.route('/resolve_node', methods=['POST'])
def resolve_nodes():
    global blockchain
    chain = request.get_json()
    blockchain = Blockchain("Voter's Blockchain")    
    new_chain = []
    for vote in chain:
        if vote["index"] == 0:
            block = Genesis_Block(vote["election"], vote["index"], vote["timestamp"], vote["prev_hash"])
            block.hash = vote["hash"]
            new_chain.append(block)
        else:
            block = Block(vote["index"], vote["timestamp"], vote["voter"], vote["candidate"], vote["prev_hash"])
            block.hash = vote["hash"]
            new_chain.append(block)
    blockchain.chain = new_chain
    response = {'message': 'Successfully updated the nodes'}
    return jsonify(response), 200

# ---------------------- VOTING RESULT ------------------------#
#update vote count in database
@app.route('/vote_update', methods=['GET'])
def update_voting():
    
    #get voting count result in the chain
    vote_result={}
    vote_result=admin.count_vote(blockchain)

    #update voting count for each candidate
    for name in vote_result:
            candidate={"name":name}
            voteCount=vote_result[name]
            update_vote_count={"$set":{'voteCount':voteCount}}
            candidate_collection.update_one(candidate,update_vote_count)
    #update voteCount in the database
    result={}
    candidates = candidate_collection.find(limit=100)
    for candidate in candidates:
        result[candidate["name"]]=candidate["voteCount"]
    
    return json.dumps(result)


# ---------------------- RESETING THE CHAIN ------------------------
@app.route('/clear_blockchain', methods=['POST'])
def clear_the_blockchain():
    global blockchain
    blockchain.clear_the_chain() 
    requests.get("http://127.0.0.1:5000/resolve")
    response = {'message': 'Successfully reset the blockchain'}
    return jsonify(response), 200


    
if __name__ == '__main__':
    from argparse import ArgumentParser

    parser = ArgumentParser()
    parser.add_argument('-p', '--port', default=5000, type=int, help='port to listen on')
    args = parser.parse_args()
    port = args.port

    app.run(host='0.0.0.0', port=port)