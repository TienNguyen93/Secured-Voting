from email.policy import default
import os
from flask import Flask, render_template, request, url_for, redirect
from flask_sqlalchemy import SQLAlchemy

from sqlalchemy.sql import func

basedir = os.path.abspath(os.path.dirname(__file__))

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] =  'sqlite:///' + os.path.join(basedir, 'database.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Eligible Voter model
class EliVoter(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    firstname = db.Column(db.String(100), nullable=False)
    lastname = db.Column(db.String(100), nullable=False)
    dob = db.Column(db.String)
    ssn = db.Column(db.Integer)
    state = db.Column(db.String(100), nullable=False)
    voted = db.Column(db.Boolean, default=False) 
    pubkey = db.Column(db.Integer)

    # declare relationship with Registered Voter
    # backref: establish EliVoter to RegVoter aka 2-ways
    # useList = False => one-to-one relationship
    regvoter = db.relationship('RegVoter', backref='eli_voter', uselist=False)

    def __repr__(self) -> str:
        return f'<EliVoter {self.firstname}>'

# Registered Voter model
class RegVoter(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(80), unique=True, nullable=False)
    username = db.Column(db.String(100), nullable=False)
    password = db.Column(db.String(100), nullable=False)
    elivoter_id = db.Column(db.Integer, db.ForeignKey('eli_voter.id'))

    def __repr__(self) -> str:
        return f'<RegVoter {self.username}>'


    
