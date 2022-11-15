import React from 'react';

const VotingView = () => {
    return (
        <div>
            <h1>Vote</h1>
            <div>
                <h2>President</h2>
                <form>
                    <input type="radio" id="president1" name="president" value="president1" />
                    <label htmlFor="president1">President 1</label><br />
                    <input type="radio" id="president2" name="president" value="president2" />
                    <label htmlFor="president2">President 2</label><br />
                    <input type="radio" id="president3" name="president" value="president3" />
                    <label htmlFor="president3">President 3</label><br />
                </form>
            </div>
            <div>
                <h2>Vice President</h2>
                <form>
                    <input type="radio" id="vicePresident1" name="vicePresident" value="vicePresident1" />
                    <label htmlFor="vicePresident1">Vice President 1</label><br />
                    <input type="radio" id="vicePresident2" name="vicePresident" value="vicePresident2" />
                    <label htmlFor="vicePresident2">Vice President 2</label><br />
                    <input type="radio" id="vicePresident3" name="vicePresident" value="vicePresident3" />
                    <label htmlFor="vicePresident3">Vice President 3</label><br />
                </form>
            </div>
            <br />
            <input type="submit" value="Submit" />
        </div>
    )
}

export default VotingView;