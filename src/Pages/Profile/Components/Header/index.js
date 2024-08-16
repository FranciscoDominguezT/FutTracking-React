import React from 'react';
import './index.css';
import logo from './Images/logo.png';
import { FaChevronLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <header className="profile-header">
          <button className="back-buttont">
            <Link to="/home" className="back-link"><FaChevronLeft /></Link>
          </button>
          <img src={logo} alt="Logo" className="logo" />
        </header>
    );
};

export default Header;
