from blockchain import *
from POA import *
from textwrap import dedent
from uuid import uuid4
import requests
from flask import Flask, jsonify, request


# Instantiate our Node
app = Flask(__name__)

# Generate a globally unique address for this node
node_identifier = str(uuid4()).replace('-', '')

# Instantiate the Blockchain
blockchain = Blockchain("Presidential Election 2022")

# private_key, public_key = generate_keys()
# print("Private Key: ", private_key)
# print("Public Key: ", public_key)

@app.route('/vote/new', methods=['POST'])
def create_the_vote():
    values = request.get_json()
    # Check that the required fields are in the POST'ed data
    # Private Key is required for TESTING
    required = ['voter', 'candidate', 'private_key']
    if not all(k in values for k in required):
        return 'Missing values', 400

    # Create a new Vote and verify it
    signed_vote = blockchain.create_the_vote(values['voter'], values['candidate'])
    verified = poa(values['private_key'], signed_vote)
    if verified:
        blockchain.add_block_to_the_chain(json.loads(signed_vote[0]))
        response = {'message': f'Vote will be added to Blockchain at index {blockchain.get_last_block().index}'}
        return jsonify(response), 201
    else:
        response = {'message': f'The vote was tampered and will not be added to the Blockchain'}
        return jsonify(response), 201


@app.route('/chain', methods=['GET'])
def full_chain():
    chain_data = []
    for block in blockchain.chain:
        chain_data.append(block.__dict__)
    return json.dumps({"length": len(chain_data),"chain": chain_data}, default=str)


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


if __name__ == '__main__':
    from argparse import ArgumentParser

    parser = ArgumentParser()
    parser.add_argument('-p', '--port', default=5000, type=int, help='port to listen on')
    args = parser.parse_args()
    port = args.port

    app.run(host='0.0.0.0', port=port)




















# print(blockchain.chain[0].election)
# print(blockchain.chain[0].index)
# print(blockchain.chain[0].timestamp)
# print(blockchain.chain[0].prev_hash)
# print(blockchain.chain[0].hash)

# pub_key0 = generate_keys()[1] # get a public key
# # print(pub_key)
# vote = blockchain.create_a_block(pub_key0, "Joe Biden")
# blockchain.add_block_to_the_chain(vote)

# print(blockchain.chain[1].index)
# print(blockchain.chain[1].timestamp)
# print(blockchain.chain[1].voter)
# print(blockchain.chain[1].candidate)
# print(blockchain.chain[0].hash)
# print(blockchain.chain[1].prev_hash)
# print(blockchain.chain[1].hash)

# pub_key2 = generate_keys()[1] # get a public key
# vote2 = blockchain.create_a_block(pub_key2, "Kathy Smith")
# blockchain.add_block_to_the_chain(vote2)

# print(blockchain.chain[2].index)
# print(blockchain.chain[2].timestamp)
# print(blockchain.chain[2].voter)
# print(blockchain.chain[2].candidate)
# print(blockchain.chain[1].hash)
# print(blockchain.chain[2].prev_hash)
# print(blockchain.chain[2].hash)

# keys = generate_keys() # get a pair of keys
# priv_key = keys[0]
# pub_key = keys[1]
# vote3 = blockchain.create_the_vote(pub_key, "Terry Dollores")
# check = poa(priv_key, vote3)
# print("Checked signature by POA", check)
# # print("Validity", blockchain.is_valid_chain())