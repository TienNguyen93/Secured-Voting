# Secured Voting

## Abstract

Secured Voting is a web-based software that aims at providing a secured platform for voters to cast their votes. Voting is an essential democratic practice that should not be altered with malicious intents. Hence, a tamper-free voting system encourages more citizens to voice their opinions and elect the candidates or leaders that can support the people’s interests more efficiently.

## Technologies

- Frontend: React, JavaScript, HTML/CSS, React-google-charts
- Backend: Python, Flask, MongoDB

## Backend

The very essence of the blockchain is to create a network of independent computers where each computer or node stores the exact copy of blockchain. By having multiple copies (in multiple independent nodes), the data in the blockchain is secure from being changed because each node checks on each other via certain agreed upon consensus algorithm and any tampering can be easily detected. The blockchain of our project uses the Proof of Authority Consensus meaning that only the authority/admin node has ability to add voter's vote to the blockchain only after verifying it and checking if the blockchain is valid. Each voter represents a node and after successfully casting his vote, he enters the network and stores the copy of the blockchain. Also, our blockchain is private meaning that only registered voters can enter the network.

## Frontend

The frontend contains two sets of components, one for Administrator and one for Voter. 
- The Administrator's components include:
  - A Dashboard tab that display the result of:
    - the vote difference between the candidates in current election through a pie chart 
    - the number of eligible voters who have voted and who have not voted through a bar chart
    - a table that simulates the blockchain including the following fields:
      | Block      | Voter ID | Voted Candidate | Timestamp | Previous Hash | Hash |
      | ----------- | ----------- | ----------- | ----------- | ----------- | ----------- |
      
  <img src="/assets/admin-dash.png" width=80% height=80%>
  
  - A Candidates tab that displays a list of candidates and their current votes
    - `New` and `Delete` buttons to add and delete the candidate 
    
  <img src="/assets/admin-cand.png" width=80% height=80%>
  
  - A Voters tab that displays a list of voters along with their personal information
    - `New` and `Select a voter to edit` buttons to add and edit voters' information
  <img src="/assets/admin-voter.png" width=80% height=80%>
  
  - A Signout tab for the Admin to signout
  
- The Voter's components include: 
  - A Voting page that allows voters to select a candidate and cast their vote
  <img src="/assets/voter-voting.png" width=80% height=80%>
  
  - A Voting Success page that displays the successfully casted vote and a receipt of their vote
  <img src="/assets/voter-success.png" width=80% height=80%>
  
  - A Signout button for the voters to signout

## How to run Blockchain (backend)

In order to run this project in a single computer and simulate the real blockchain, please follow these instructions:

- Open several terminals (one for admin and several other for voters)
- Admin runs on port 5000 and each new voter should run on a unique port starting from 5001, 5002, 5003 and so on
- Change the directory to backend with `cd backend`
- Run the following commands in each separate terminal with corresponding ports:
  - `python3 run.py --port 5000` (admin's terminal)
  - `python3 run.py --port 5001` (voter's terminal)
  - `python3 run.py --port 5002` (another voter's terminal)
  - etc.

## How to run the frontend application

- Change the directory to frontend with `cd frontend`
- Run the following commands to initialize different React application:
  - `$env:PORT=3000; npm start` (admin's corresponding frontend)
  - `$env:PORT=3001; npm start` (voter's corresponding frontend)
  - `$env:PORT=3002; npm start` (another voter's corresponding frontend)
  - etc
- Login to Admin page on `port 3000` and click `Start election` button to initialize the blockchain system
- Login to Voter page on `port 300x`, pick a candidate, then submit the vote
- Vote will go through the system and be displayed on the Admin dashboard

## Wireframes

- Wireframes for Admin Dashboard and Voter UI:
  <img src="/assets/UI.png" width=80% height=80%>

- Wireframes for Blockchain system:
  <img src="/assets/bc-wf.png" width=80% height=80%>
