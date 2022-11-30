import React from "react";
import Navbar from "./../navbar/Navbar";
import "./Voter.css";

const VoterView = (props) => {
	const { voters } = props;

    return (
        <div>
            <Navbar />
            <div className="VoterFormContainer">
                <h1>Voters</h1>
                <button>New</button>
                <button>Remove</button>
                <button>Edit</button>

                <table className="table">
                    <thead>
                        <tr>
                            <th></th>
							<th>First Name</th>
							<th>Last Name</th>
							<th>Email</th>
							<th>Date of Birth</th>
							<th>Account Registered</th>
							<th>Voted</th>
                        </tr>
                    </thead>
					<tbody>
						{voters.map((voter) => {
							return (
								<tr>
									<td>
										<input type="radio" name="id" value={voter._id} />
									</td>
									<td>{voter.firstname}</td>
									<td>{voter.lastname}</td>
									<td>{voter.email}</td>
									<td>{voter.dob}</td>
									<td>{(voter.registered) ? "Yes" : "No"}</td>
									<td>{(voter.voted) ? "Yes" : "No"}</td>
								</tr>
							);
						})}
					</tbody>
                </table>
            </div>
        </div>
    );
};

export default VoterView;
