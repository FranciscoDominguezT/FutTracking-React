import React from 'react';
import './index.css';
import { Link } from 'react-router-dom';
import { FaSearch, FaUserCircle, FaSlidersH, FaCog } from "react-icons/fa";
import user from './images/icons8-user-30.png'
import filter from './images/icons8-mezclador-horizontal-ajustes-30.png'
import settings from './images/icons8-ajustes-50.png'

const Header = () => {
    return (
        <header className="header">
            <Link to="/profile"><img src={user} alt="Logo" className="profile-img"/></Link>
            <div className="search-container">
                <input type="text" placeholder="Buscar..." className="search-bar" />
                <FaSearch className="search-icon" />
            </div>
            <div className="icons">
                <img src={filter} alt="Logo" className="icon" />
                <img src={settings} alt="Logo" className="icon" />
            </div>
        </header>
    );
};

export default Header;