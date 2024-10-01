import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './index.css';
import { Link } from 'react-router-dom';
import { FaSearch, FaUserCircle, FaSlidersH, FaCog } from "react-icons/fa";
import UserSearch from '../UserSearch';
import user from './images/icons8-user-30.png';
import filter from './images/icons8-mezclador-horizontal-ajustes-30.png';
import settings from './images/icons8-ajustes-50.png';

const Header = () => {
  const [avatarUrl, setAvatarUrl] = useState(null);

  useEffect(() => {
    // Llamada al backend para obtener el avatar del usuario logueado
    const fetchAvatar = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found');
          return;
        }
    
        const response = await axios.get('http://localhost:5001/api/user/avatar', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAvatarUrl(response.data.avatar_url);
      } catch (error) {
        console.error('Error al obtener el avatar del usuario:', error);
      }
    };

    fetchAvatar();
  }, []);

  return (
    <header className="header">
      <Link to="/profile">
        {avatarUrl ? (
          <img src={avatarUrl} alt="User Avatar" className="profile-img" />
        ) : (
          <img src={user} alt="Default Icon" className="profile-img" />
        )}
      </Link>
      <UserSearch />
      <div className="icons">
        <Link to="/filter"><img src={filter} alt="Logo" className="icon" /></Link>
        <img src={settings} alt="Logo" className="icon" />
      </div>
    </header>
  );
};

export default Header;
