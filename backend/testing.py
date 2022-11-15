from blockchain import *
from POA import *
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

from database.models import Address, Voter, Admin


# Instantiate our Node
app = Flask(__name__)
CORS(app)


load_dotenv()

app.config["MONGO_URI"] = os.getenv("ATLAS_URI")

mongo = PyMongo(app)
collection: Collection = mongo.db.collection
voter_collection: Collection = mongo.db.voter
admin_collection: Collection = mongo.db.admin

# ------------------ ADMIN METHODS ----------------- #

# get admin
@app.route('/admin', methods=['GET'])
def get_admin():
    admins = admin_collection.find(limit=10)
    return [Admin(**admin).to_json() for admin in admins]

# ------------------ END OF ADMIN METHODS ----------------- #

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


# get single voter
# @app.route('/voters/<id>', methods=['GET'])
# def get_voter(id):
#     voter = voter_collection.find_one_or_404({"_id": id})
#     return Voter(**voter).to_json()


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
            return 'Voter email + pass correct'

    if admin_collection.find_one({"email": email}):
        email_found = admin_collection.find_one({"email": email})
        if password == email_found['password']:
            return 'Admin email + pass correct'

    else:
        return "None existence"

# ------------------ END OF VOTER METHODS ----------------- #


# ------------------ ADDRESS CRUD METHODS ----------------- #

# create address
@app.route('/address', methods=['POST'])
def create_address():
    new_address = request.get_json()

    """
    check if there exists an address inside the database
    if yes -> add that address into the neighbor set
    else -> return
    """
    address = Address(**new_address)
    insert_result = collection.insert_one(address.to_json())
    created_address = collection.find_one(
        {"_id": insert_result.inserted_id}
    )
    return created_address


# get single address
@app.route("/address/<id>", methods=["GET"])
def get_address(id):
    address = collection.find_one_or_404({"_id": id})
    return Address(**address).to_json()


# get all addresses
@app.route('/address', methods=['GET'])
def get_addresses():
    addresses = collection.find(limit=100)
    return [Address(**address).to_json() for address in addresses]


# delete address
@app.route("/address/<id>", methods=["DELETE"])
def delete_address(id):
    deleted_address = collection.find_one_and_delete({"_id": id})
    if deleted_address:
        return Address(**deleted_address).to_json()
    else:
        flask.abort(404, "Address not found")
# ------------------ END OF ADDRESS CRUD METHODS ----------------- #


# Instantiate the Blockchain
election_info = "Presidential Election 2022"
blockchain = Blockchain(election_info)

# Admin's public and private keys
admin_priv_key, admin_pub_key = generate_keys()
# Set of nodes in the network
nodes = set()

# ---------------- INITIALIZATION OF NODES ---------------------

# Each voter node registers their port in the network
@app.route('/init', methods=['POST'])
def initialize():
    global nodes
    global admin_pub_key
    headers = {'Content-Type': "application/json"}
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


@app.route('/init_nodes', methods=['POST'])
def update_nodes():
    port = request.get_json()
    nodes.add(port)
    response = {'message': f'Addeded new port to the set of nodes'}
    return jsonify(response), 201


@app.route('/get_neighbors', methods=['GET'])
def get_neighbors():
    return json.dumps({"neighbors": list(nodes)})


@app.route('/get_pub_key', methods=['GET'])
def get_admin_public_key():
    key = admin_pub_key
    b64_key = base64.b64encode(key)
    b64_key = b64_key.decode("utf-8")
    return json.dumps({"admin_pub_key": b64_key})


# -------------------------- VOTING ----------------------------

# Voter votes
@app.route('/vote/new', methods=['POST'])
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
    blockchain.to_be_verified_votes.append(vote)
    response = {'message': f'Vote was successfully added to the list to be verified'}
    return jsonify(response), 201


# Lists all unverified votes that need to be verified
@app.route('/vote/unverified', methods=['GET'])
def list_unverified_votes():
    unverified_votes_list = []
    for vote in blockchain.to_be_verified_votes:
        unverified_votes_list.append((vote['voter'], vote['candidate']))
    return json.dumps({"length": len(unverified_votes_list),"unverified_votes": unverified_votes_list}, default=str)


# ---------------------- VOTE VERIFICATION ------------------------

# Admin verifies voters' votes
@app.route('/vote/verify', methods=['GET'])
def verify_votes():
    verified = 0
    tampered = 0
    for vote in blockchain.to_be_verified_votes:
        if (blockchain.verify_vote(admin_priv_key, vote["public_key"], vote["signed_vote"])):
            verified += 1
        else:
            tampered += 1
    # Empty out the list of to be verified votes
    blockchain.to_be_verified_votes = []

    if verified == 0 and tampered == 0:
        response = {'message': f'There were no votes to be verified'}
        return jsonify(response), 201
    else:
        response = {'message': f'{verified} votes were successfully verified and {tampered} votes were tampered'}
        return jsonify(response), 201


# Verifies the Blockchain and then adds all verified votes to the chain
@app.route('/add_vote', methods=['POST'])
def add_votes_to_blockchain():
    if blockchain.is_valid_chain():
        for vote in blockchain.verified_votes:
            block = blockchain.create_a_block(vote["voter"], vote["candidate"])
            blockchain.add_block_to_the_chain(block)
        # Empty out the list of verified votes
        blockchain.verified_votes = []
        return "Blocks were added to the chain", 201
    return "The Blockchain was not valid therefore no votes were added to the chain", 400


@app.route('/chain', methods=['GET'])
def full_chain():
    chain_data = []
    for block in blockchain.chain:
        chain_data.append(block.__dict__)
    return json.dumps({"length": len(chain_data),"chain": chain_data}, default=str)


# ---------------------- NODE RESOLUTION ------------------------

# Resolve all blockchains in the network with Proof Of Authority Consensus Algorithm
@app.route('/nodes/resolve', methods=['GET'])
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


@app.route('/resolve_node', methods=['POST'])
def resolve_nodes():
    chain = request.get_json()
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


if __name__ == '__main__':
    from argparse import ArgumentParser

    parser = ArgumentParser()
    parser.add_argument('-p', '--port', default=5000, type=int, help='port to listen on')
    args = parser.parse_args()
    port = args.port

    app.run(host='0.0.0.0', port=port)