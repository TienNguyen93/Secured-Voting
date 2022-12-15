import React, { useState } from "react";
import * as FAcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as MdIcons from "react-icons/md"
import { RiGovernmentFill } from "react-icons/ri";
import { Link } from "react-router-dom";
import { NavbarData } from "./NavbarData";
import "./Navbar.css";
import { useNavigate } from "react-router-dom";

const Navbar = ({childToParent}) => {
    const [active, setActive] = useState(false);

    const handleSignOut = () => {
        localStorage.clear();
        window.location.reload();
    };

    const showNavbar = () => {
        setActive(!active)
        childToParent(!active)
    };

    const navigate = useNavigate()

    return (
        <div className={active ? "header" : "header-mobile"}>
            <div className="menu-icon" onClick={showNavbar}>
                {!active ? <FAcons.FaBars className="menu" /> : <AiIcons.AiOutlineClose className="menu" />}
            </div>
            <nav>
                <ul className={active ? 'ul-item' : 'ul-item oicon'}>
                    <li>
                        <MdIcons.MdDashboard className="icon" onClick={() => navigate('/admin')}/>
                        <Link to="/admin">Dashboard</Link>
                    </li>
                    <li>
                        <RiGovernmentFill className="icon" onClick={() => navigate('/admin/candidates')}/>
                        <Link to="/admin/candidates">Candidates</Link>
                    </li>
                    <li>
                        <MdIcons.MdPeople className="icon" onClick={() => navigate('/admin/voters')}/>
                        <Link to="/admin/voters">Voters</Link>
                    </li>
                    <li>
                        <FAcons.FaSignOutAlt className="icon" onClick={() => handleSignOut()}/>
                        <Link to="/">
                            <span onClick={() => handleSignOut()}>Sign Out</span>
                        </Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
}

export default Navbar;
