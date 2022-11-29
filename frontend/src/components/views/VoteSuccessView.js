import React from 'react';
import checkmark from '../../image/checkmark.jpeg';

const VoteSuccessView = () => {
    return (
        <div className="vote-success">
            <img className="checkmark" src={checkmark} alt={checkmark} />
            <h1 className="center">Success!</h1>
            <p className="center">Your vote has been cast.</p>
            <button>Sign Out</button>
        </div>
    )
}

export default VoteSuccessView;