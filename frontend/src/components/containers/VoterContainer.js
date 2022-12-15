import { VoterView } from "../views";
import React, { useEffect, useState } from "react";

const VoterContainer = () => {
    const [voters, setVoters] = useState([]);
    const [newVoter, setNewVoter] = useState([]);
    const [selectedVoter, setSelectedVoter] = useState({});

    const [isClicked, setIsClicked] = useState(null)

    const reload = () => {
        window.location.reload();
    }

    const childToParent = (data) => {
        setIsClicked(data)
    }

    useEffect(() => {
        fetch("http://localhost:5000/voters").then((response) =>
            response.json().then((data) => {
                setVoters(data);
            })
        );
    }, []);

    const handleSelect = (e) => {
        setSelectedVoter(e.target.value);
    };

    const handleEdit = (e) => {
        e.preventDefault();

        if (newVoter.dob !== undefined) {
            newVoter.dob =
                newVoter.dob.substring(5, 7) +
                "/" +
                newVoter.dob.substring(8) +
                "/" +
                newVoter.dob.substring(0, 4);
        }

        voters.forEach((voter) => {
            if (voter._id === selectedVoter) {
                let first_name =
                    newVoter.firstname !== undefined
                        ? newVoter.firstname
                        : voter.firstname;
                let last_name =
                    newVoter.lastname !== undefined
                        ? newVoter.lastname
                        : voter.lastname;
                let birthday =
                    newVoter.dob !== undefined
                        ? newVoter.dob
                        : voter.dob;

                const request = {
                    method: "PUT",
                    headers: { "content-Type": "application/json" },
                    body: JSON.stringify({
                        firstname: first_name,
                        lastname: last_name,
                        dob: birthday,
                        ssn: voter.ssn,
                        password: voter.password,
                        registered: voter.registered,
                        email: voter.email,
                        voted: voter.voted,
                    }),
                };
                fetch(`http://localhost:5000/voters/${selectedVoter}`, request)
                    .then((response) => response.json())
                    .then((data) => console.log(data))
                    .catch((error) => console.log(error));

                setNewVoter([]);
            }
        });

        setTimeout(reload, 1000);
    };

    const handleChange = (e) => {
        let new_voter = {};
        new_voter = { [e.target.name]: e.target.value };
        setNewVoter((newVoter) => ({
            ...newVoter,
            ...new_voter,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        newVoter.dob =
            newVoter.dob.substring(5, 7) +
            "/" +
            newVoter.dob.substring(8) +
            "/" +
            newVoter.dob.substring(0, 4);

        const request = {
            method: "POST",
            headers: { "content-Type": "application/json" },
            body: JSON.stringify({
                firstname: newVoter.firstname,
                lastname: newVoter.lastname,
                email: "",
                dob: newVoter.dob,
                ssn: parseInt(newVoter.ssn),
                password: "",
            }),
        };
        fetch(`http://localhost:5000/voters`, request)
            .then((response) => response.json())
            .then((data) => console.log("post method", data))
            .catch((error) => console.log(error));

        setTimeout(reload, 1000);
    };

    return (
        <VoterView
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            handleSelect={handleSelect}
            handleEdit={handleEdit}
            selectedVoter={selectedVoter}
            voters={voters}
            childToParent={childToParent}
            isClicked={isClicked}
        />
    );
};

export default VoterContainer;
