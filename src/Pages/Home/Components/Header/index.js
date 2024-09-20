import React from 'react';
import './index.css';
import { Link } from 'react-router-dom';
import { FaSearch, FaUserCircle, FaSlidersH, FaCog } from "react-icons/fa";
import UserSearch from '../UserSearch';
import user from './images/icons8-user-30.png';
import filter from './images/icons8-mezclador-horizontal-ajustes-30.png';
import settings from './images/icons8-ajustes-50.png';

const Header = () => {
  return (
    <header className="header">
      <Link to="/profile"><img src={user} alt="Logo" className="profile-img" /></Link>
      <UserSearch />
      <div className="icons">
        <Link to="/filter"><img src={filter} alt="Logo" className="icon" /></Link>
        <img src={settings} alt="Logo" className="icon" />
      </div>
    </header>
  );
};

export default Header;
