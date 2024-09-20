import React from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';

const SearchCard = ({ users }) => {
  const navigate = useNavigate();

  const handleCardClick = (userId) => {
    if (userId) {
      console.log(`Navigating to profile with usuario_id: ${userId}`);
      navigate(`/playerProfile/${userId}`);
    } else {
      console.error("usuario_id is undefined");
    }
  };

  return (
    <div className="search-results">
      {users.map((user) => (
        <div key={user.id} className="user-cardRR" onClick={() => handleCardClick(user.id)}>
          <img
            src={user.avatar_url || '/default-avatar.png'}
            alt={`${user.nombre} ${user.apellido}`}
            className="userRR-avatar"
          />
          <div className="user-infoRR">
            <h3>{`${user.nombre} ${user.apellido}`}</h3>
            <p>{`${user.seguidores} seguidores · ${user.videos} videos`}</p>
          </div>
          <button className="followRR-button" onClick={(e) => e.stopPropagation()}>Seguir</button>
        </div>
      ))}
    </div>
  );
};

export default SearchCard;