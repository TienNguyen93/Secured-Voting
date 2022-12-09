import React, { useState } from "react";
import * as FIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { NavbarData } from "./NavbarData";
import "./Navbar.css";
import { IconContext } from "react-icons";

function Navbar() {
    const [navbar, setNavbar] = useState(false);
    const navigate = useNavigate();

    const handleSignOut = () => {
        window.localStorage.clear();
        navigate("/");
    };

    const showNavbar = () => setNavbar(!navbar);
    return (
        <div>
            <IconContext.Provider value={{ color: "black" }}>
                <div className="navbar">
                    <Link to="#" className="menu-bars">
                        <FIcons.FaBars onClick={showNavbar} />
                    </Link>
                </div>
                <nav className={navbar ? "nav-menu active" : "nav-menu"}>
                    <ul className="nav-menu-items" onClick={showNavbar}>
                        <li className="navbar-toggle">
                            <Link to="#" className="menu-bars">
                                <AiIcons.AiOutlineClose />
                            </Link>
                        </li>
                        {NavbarData.map((tab, index) => {
                            return (
                                <li key={index} className={tab.cName}>
                                    <Link to={tab.path}>
                                        <span>{tab.title}</span>
                                    </Link>
                                </li>
                            );
                        })}
                        <li className="sign-out">
                            <Link to="/">
                                <span onClick={() => handleSignOut()}>Sign Out</span>
                            </Link>
                        </li>
                    </ul>
                </nav>
            </IconContext.Provider>
        </div>
    );
}

export default Navbar;
