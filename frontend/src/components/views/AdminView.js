import React from "react";
import "./adminComponents/Admin.css";
import { useEffect, useState } from "react";

const AdminView = ({chain}) => {
    // ORIGINAL FUNCTION
    // useEffect(() => {
    //     const fetchData = async () => {
    //         const data = await (
    //             await fetch(
    //                 `http://localhost:5000/chain`
    //             )
    //         ).json()

    //         setChain(data.chain)
    //     }

    //     const timer = setTimeout(() => {
    //         fetchData()
    //     }, 3000)

    //     return () => clearTimeout(timer)
    // }, [chain])

    return (
        <div>
            <div>
                <div>
                    <table className="chain-table">
                        <thead>
                            <tr>
                                <th>Block</th>
                                <th>Voter ID</th>
                                <th>Voted Candidate</th>
                                <th>Timestamp</th>
                                <th>Previous Hash</th>
                                <th>Hash</th>
                            </tr>
                        </thead>
                        <tbody>

                            {chain.map((block) => {
                                return [
                                    <tr key={block}>
                                        <td>{block.index}</td>
                                        <td>{block.voter}</td>
                                        <td>{block.candidate}</td>
                                        <td>{block.timestamp}</td>
                                        <td className="hash">
                                            {parseInt(block.prev_hash) === 0
                                                ? block.prev_hash
                                                : block.prev_hash.slice(0, 10) + "..."
                                            }
                                            <span className="tooltip">{block.prev_hash}</span>
                                        </td>

                                        <td className="hash">
                                            {block.hash.slice(0, 10) + "..."}
                                            <span className="tooltip">{block.hash}</span>
                                        </td>
                                    </tr>
                                ]
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminView;
