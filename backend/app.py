import json 
from flask import Flask, request
# import requests
from blockchain import Blockchain


app = Flask(__name__)

# create a Blockchain class object
election_info = 1
blockchain_obj = Blockchain(election_info)

@app.route('/chain', methods=['GET'])
def get_chain():
  chain_data = []
  for block in blockchain_obj.chain:
    chain_data.append(block.__dict__)
  return json.dumps({"length": len(chain_data),"chain": chain_data}, default=str)

app.run(debug=True, port=5000)