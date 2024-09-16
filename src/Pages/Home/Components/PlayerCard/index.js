import React from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';

const PlayerCard = ({ player }) => {
    const navigate = useNavigate();
  
    const handleCardClick = () => {
      if (player.usuario_id) {
        console.log(`Navigating to profile with usuario_id: ${player.usuario_id}`);
        navigate(`/playerProfile/${player.usuario_id}`);
      } else {
        console.error("usuario_id is undefined");
      }
    };
  
    return (
      <div className="filter-card" onClick={handleCardClick}>
        <img 
          src={player.avatar_url || '/api/placeholder/48/48'} 
          alt={`${player.nombre} ${player.apellido}`} 
          className="filter-avatar"
        />
        <div className="filter-info">
          <h3 className="filter-name">{`${player.nombre} ${player.apellido}`}</h3>
          <p className="filter-details">{`${player.edad}y | ${player.posicion}`}</p>
          <p className="filter-details">{player.equipo_nombre}</p>
          <p className="filter-details">{`${player.altura}cm | ${player.peso}kg`}</p>
        </div>
      </div>
    );
  };

export default PlayerCard;