from optparse import Values
from blockchain import *
from POA import *
from uuid import uuid4
from flask import Flask, jsonify, request
import requests
import base64

from pymongo import MongoClient
from dotenv import dotenv_values, load_dotenv
from flask_pymongo import PyMongo
from typing import List
from pymongo.collection import Collection, ReturnDocument
from fastapi.encoders import jsonable_encoder
import json
import flask

from database.models import Address

# Instantiate our Node
app = Flask(__name__)

env_var = dotenv_values(".env")
app.config["MONGO_URI"] = env_var["ATLAS_URI"]

mongo = PyMongo(app)
collection: Collection = mongo.db.collection


# create address
@app.route('/address', methods=['POST'])
def create_address():
    new_address = request.get_json()

    address = Address(**new_address)
    insert_result = collection.insert_one(address.to_json())
    created_address = collection.find_one(
        {"_id": insert_result.inserted_id}
    )
    return created_address


# get address
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



# Instantiate the Blockchain
election_info = "Presidential Election 2022"
blockchain = Blockchain(election_info)

# Admin's public and private keys
admin_priv_key, admin_pub_key = generate_keys()

@app.route('/init', methods=['POST'])
def initialize_voters():
    voters = blockchain.nodes
    headers = {'Content-Type': "application/json"}
    key = admin_pub_key
    b64_key = base64.b64encode(key)
    b64_key = b64_key.decode("utf-8")
    for voter in voters:
        requests.post(f'http://{voter}/init_voter', data=json.dumps(b64_key), headers=headers)
    response = {'message': f'Voter got the key'}
    return jsonify(response), 201

@app.route('/init_voter', methods=['POST'])
def initialize_key():
    key_64 = request.get_json()
    key_encoded = key_64.encode("utf-8")
    key = base64.b64decode(key_encoded)
    admin_pub_key = key
    response = {'message': f'Updated the key'}
    return jsonify(response), 201

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
    
    # Sign the vote and send it to be verified
    signed_vote = encrypt_signature(vote, admin_pub_key, v_priv_key)
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
    b64_encrypt_info = vote["signed_vote"][0]
    b64_signature = vote["signed_vote"][1]
    encrypt_info = b64_encrypt_info.encode("utf-8")
    encrypt_info = base64.b64decode(encrypt_info)
    signature = b64_signature.encode("utf-8")
    signature = base64.b64decode(signature)
    signed_vote = (encrypt_info, signature)
    vote["signed_vote"] = signed_vote
    blockchain.to_be_verified_votes.append(vote)
    response = {'message': f'Vote was successfully added to the list to be verified'}
    return jsonify(response), 201


# Lists all unverified votes that need to be verified
@app.route('/vote/unverified', methods=['GET'])
def list_unverified_votes():
    unverified_votes_list = []
    for vote in blockchain.to_be_verified_votes:
        unverified_votes_list.append(vote)
    return json.dumps({"length": len(unverified_votes_list),"unverified_votes": unverified_votes_list}, default=str)


# Verifies voter's votes and adds them to verified votes list
@app.route('/vote/verify', methods=['GET'])
def verify_votes():
    verified = 0
    tampered = 0
    print()
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


# Endpoint to add new peers to the network
@app.route('/nodes/register', methods=['POST'])
def register_nodes():
    values = request.get_json()

    nodes = values.get('nodes')
    if nodes is None:
        return "Error: Please supply a valid list of nodes", 400

    for node in nodes:
        blockchain.register_node(node)

    response = {
        'message': 'New nodes have been added',
        'total_nodes': list(blockchain.nodes),
    }
    return jsonify(response), 201


@app.route('/nodes/resolve', methods=['GET'])
def poa_consensus():
    updated = blockchain.resolve_conflicts()

    if updated:
        response = {
            'message': 'Nodes in the network were updated'
        }
    else:
        response = {
            'message': 'There are no nodes in the network'
        }

    return jsonify(response), 200


@app.route('/update_node', methods=['POST'])
def update_peers():
    # The host address to the peer node 
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
    response = {
            'message': 'Successfully updated the nodes'
        }
    return jsonify(response), 200


if __name__ == '__main__':
    from argparse import ArgumentParser

    parser = ArgumentParser()
    parser.add_argument('-p', '--port', default=5000, type=int, help='port to listen on')
    args = parser.parse_args()
    port = args.port

    app.run(host='0.0.0.0', port=port)

