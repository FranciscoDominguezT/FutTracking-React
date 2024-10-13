import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import './index.css';
import { Link } from 'react-router-dom';
import { FaSearch, FaUserCircle, FaSlidersH, FaCog } from "react-icons/fa";
import UserSearch from '../UserSearch';
import user from './images/icons8-user-30.png';
import filter from './images/icons8-mezclador-horizontal-ajustes-30.png';
import settings from './images/icons8-ajustes-50.png';
import { AuthContext } from '../../../../Context/auth-context';

const Header = () => {
  const [avatarUrl, setAvatarUrl] = useState(null);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchAvatar = async () => {
      try {
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
  }, [token]);

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
        <Link to="/config"><img src={settings} alt="Logo" className="icon" /></Link>
      </div>
    </header>
  );
};

export default Header;