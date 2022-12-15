# Secured Voting

## Abstract

Secured Voting is a web-based software that aims at providing a secured platform for voters to cast their votes. Voting is an essential democratic practice that should not be altered with malicious intents. Hence, a tamper-free voting system encourages more citizens to voice their opinions and elect the candidates or leaders that can support the people’s interests more efficiently.

## Technologies

- Frontend: React, JavaScript, HTML/CSS
- Backend: Python, Flask, MongoDB

## Backend

The very essence of the blockchain is to create a network of independent computers where each computer or node stores the exact copy of blockchain. By having multiple copies (in multiple independent nodes), the data in the blockchain is secure from being changed because each node checks on each other via certain agreed upon consensus algorithm and any tampering can be easily detected. The blockchain of our project uses the Proof of Authority Consensus meaning that only the authority/admin node has ability to add voter's vote to the blockchain only after verifying it and checking if the blockchain is valid. Each voter represents a node and after successfully casting his vote, he enters the network and stores the copy of the blockchain. Also, our blockchain is private meaning that only registered voters can enter the network.

## How to run Blockchain (backend)

In order to run this project in a single computer and simulate the real blockchain, please follow these instructions:

- Open several terminals (one for admin and several other for voters)
- Admin runs on port 5000 and each new voter should run on a unique port starting from 5001, 5002, 5003 and so on
- Change the directory to "backend" directory
- Run the following commands in each separate terminal with corresponding ports
- python3 run.py --port 5000 (admin's terminal)
- python3 run.py --port 5001 (voter's terminal)
- python3 run.py --port 5002 (another voter's terminal)
- etc.

## How to run the frontend application

- Type 'cd frontend' then '$env:PORT=3005; npm start'

## Wireframes

- Wireframes for Admin Dashboard and Voter UI:
  <img src="/assets/UI.png" width=80% height=80%>

- Wireframes for Blockchain system:
  <img src="/assets/bc-wf.png" width=80% height=80%>
