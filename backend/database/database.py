from email.policy import default
import os
import re
from flask import Flask, render_template, request, url_for, redirect
from flask_sqlalchemy import SQLAlchemy
#from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy_utils import UUIDType

from sqlalchemy.sql import func
from flask_migrate import Migrate

import uuid

basedir = os.path.abspath(os.path.dirname(__file__))

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] =  'sqlite:///' + os.path.join(basedir, 'database.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
migrate = Migrate(app, db)

# Eligible Voter model
class EliVoter(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    firstname = db.Column(db.String(100), nullable=False)
    lastname = db.Column(db.String(100), nullable=False)
    dob = db.Column(db.String)
    ssn = db.Column(db.Integer)
    state = db.Column(db.String(100), nullable=False)
    voted = db.Column(db.Boolean, default=False) 
    adminplk = db.Column(db.Integer) 
    voterpvk = db.Column(db.Integer)
    uuid = db.Column(UUIDType(binary=False), default=uuid.uuid4)

    # declare relationship with Registered Voter
    # backref: establish EliVoter to RegVoter aka 2-ways
    # useList = False => one-to-one relationship
    regvoter = db.relationship('RegVoter', backref='eli_voter', uselist=False)

    def __repr__(self) -> str:
        return f'<EliVoter {self.firstname}>'

    def __init__(self, firstname, lastname, dob, ssn, state, voted, adminplk, voterpvk):
        self.firstname = firstname
        self.lastname = lastname
        self.dob = dob
        self.ssn = ssn
        self.state = state
        self.voted = voted
        self.adminplk = adminplk
        self.voterpvk = voterpvk

# Registered Voter model
class RegVoter(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(80), unique=True, nullable=False)
    username = db.Column(db.String(100), nullable=False)
    password = db.Column(db.String(100), nullable=False)
    elivoter_id = db.Column(db.Integer, db.ForeignKey('eli_voter.id'))

    def __repr__(self) -> str:
        return f'<RegVoter {self.username}>'
    
    def __init__(self, email, username, password):
        self.email = email
        self.username = username
        self.password = password


# format for Frontend use
def format_eli(elivoter):
    return {
        "id": elivoter.id,
        "firstname": elivoter.firstname,
        "lastname ": elivoter.lastname,
        "dob": elivoter.dob,
        "ssn" : elivoter.ssn,
        "state" : elivoter.state,
        "voted" : elivoter.voted,
        "adminplk": elivoter.adminplk,
        "voterpvk": elivoter.voterpvk,
        "uuid": elivoter.uuid
    }

#format for Frontend use
def format_reg(regvoter):
    return {
        "id": regvoter.id,
        "email": regvoter.email,
        "username": regvoter.username,
        "password": regvoter.password,
        "foreignkey": regvoter.elivoter_id
    }


# get all eligible voters
@app.route('/elivoters', methods=['GET'])
def get_elivoters():
    elivoters = EliVoter.query.order_by(EliVoter.id.asc()).all()
    eli_list = []
    for e in elivoters:
        eli_list.append(format_eli(e))
    return {'elivoters': eli_list}
    
    

# get single eligible voter
@app.route('/elivoters/<id>', methods=['GET'])
def get_elivoter(id):
    elivoter = EliVoter.query.filter_by(id=id).one()
    formatted = format_eli(elivoter)
    return {'elivoter': formatted}


# add eligible voter
@app.route('/elivoters', methods=['POST'])
def add_elivoter():
    firstname = request.json['firstname']
    lastname = request.json['lastname']
    dob = request.json['dob']
    ssn = request.json['ssn']
    state = request.json['state']
    voted = request.json['voted']
    adminplk = request.json['adminplk']
    voterpvk = request.json['voterpvk']
    elivoter = EliVoter(firstname, lastname, dob, ssn, state, voted, adminplk, voterpvk)
    db.session.add(elivoter)
    db.session.commit()
    return format_eli(elivoter)

# delete single eligible voter
@app.route('/elivoters/<id>', methods=['DELETE'])
def delete_elivoter(id):
    elivoter = EliVoter.query.filter_by(id=id).one()
    db.session.delete(elivoter)
    db.session.commit()
    return f'Eligible Voter: {id} deleted!'


# update eligible voter information
@app.route('/elivoters/<id>', methods=['PUT'])
def update_elivoter(id):
    elivoter = EliVoter.query.filter_by(id=id)
    adminplk = request.json['adminplk']
    elivoter.update(dict(adminplk = adminplk))
    db.session.commit()
    return {'elivoter': format_eli(elivoter.one())}

            # ---------------------------- #
# get all registered voters
@app.route('/regvoters', methods=['GET'])
def get_regvoters():
    regvoters = RegVoter.query.order_by(RegVoter.id.asc()).all()
    reg_list = []
    for r in regvoters:
        reg_list.append(format_reg(r))
    return {'regvoters': reg_list}


# get single registered voter
@app.route('/regvoters/<id>', methods=['GET'])
def get_regvoter(id):
    regvoter = RegVoter.query.filter_by(id=id).one()
    formatted = format_reg(regvoter)
    return {'regvoter': formatted}


if __name__ == '__main__':
    app.run()