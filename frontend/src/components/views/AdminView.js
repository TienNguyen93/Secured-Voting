import React from "react";
import { Link } from "react-router-dom";
import Navbar from "./navbar/Navbar";

const AdminView = () => {
    return (
        <div className="admin">
            <Navbar />
            <h1>Admin Dashboard</h1>
        </div>
    );
};

export default AdminView;
