import { CandidateView } from "../views";
import React, { useEffect, useState } from "react";

const CandidateContainer = () => {
    const [candidates, setCandidates] = useState([]);
    const [newCandidate, setNewCandidate] = useState("");
    const [selectedCandidate, setSelectedCandidate] = useState("");

    const [isClicked, setIsClicked] = useState(null)

    const childToParent = (data) => {
        setIsClicked(data)
    }

    const reload = () => {
        window.location.reload();
    }

    useEffect(() => {
        fetch("http://localhost:5000/candidates").then((response) =>
            response.json().then((data) => {
                setCandidates(data);
            })
        );
    }, []);

    const handleSelect = (e) => {
        setSelectedCandidate(e.target.value);
    };

    const handleDelete = () => {
        fetch(`http://localhost:5000/candidates/${selectedCandidate}`, {
            method: "DELETE",
        })
            .then((response) => response.json())
            .then((data) => console.log("delete method", data))
            .catch((error) => console.log(error));

        setTimeout(reload, 1000);
    };

    const handleChange = (e) => {
        setNewCandidate(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const request = {
            method: "POST",
            headers: { "content-Type": "application/json" },    
            body: JSON.stringify({ name: newCandidate }),
        };
        fetch(`http://localhost:5000/candidates`, request)
            .then((response) => response.json())
            .then((data) => console.log("post method", data))
            .catch((error) => console.log(error));
        
        setTimeout(reload, 1000);
    };

    return (
        <CandidateView
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            handleSelect={handleSelect}
            handleDelete={handleDelete}
            candidates={candidates}
            childToParent={childToParent}
            isClicked={isClicked}
        />
    );
};

export default CandidateContainer;
