import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../../../Context/auth-context';
import './index.css';

const SearchCard = ({ users }) => {
  const navigate = useNavigate();
  const { user, token } = useContext(AuthContext);
  const [followStatus, setFollowStatus] = useState({});

  useEffect(() => {
    const checkFollowStatus = async () => {
      if (!user || !user.id) return;

      const statusPromises = users.map(async (targetUser) => {
        try {
          const response = await axios.get(`http://localhost:5001/api/videos/${user.id}/${targetUser.id}/follow`);
          return { [targetUser.id]: response.data.isFollowing };
        } catch (error) {
          console.error(`Error checking follow status for user ${targetUser.id}:`, error);
          return { [targetUser.id]: false };
        }
      });

      const statuses = await Promise.all(statusPromises);
      setFollowStatus(Object.assign({}, ...statuses));
    };

    checkFollowStatus();
  }, [user, users]);

  const handleFollowToggle = async (e, targetUserId) => {
    e.stopPropagation();
    if (!user || !user.id) return;

    try {
      const response = await axios.post(
        `http://localhost:5001/api/videos/${user.id}/${targetUserId}/followChange`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFollowStatus(prev => ({ ...prev, [targetUserId]: response.data.isFollowing }));
    } catch (error) {
      console.error("Error toggling follow status:", error);
    }
  };

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
      {users.map((targetUser) => (
        <div key={targetUser.id} className="user-cardRR" onClick={() => handleCardClick(targetUser.id)}>
          <img
            src={targetUser.avatar_url || '/default-avatar.png'}
            alt={`${targetUser.nombre} ${targetUser.apellido}`}
            className="userRR-avatar"
          />
          <div className="user-infoRR">
            <h3>{`${targetUser.nombre} ${targetUser.apellido}`}</h3>
            <p>{`${targetUser.seguidores} seguidores · ${targetUser.videos} videos`}</p>
          </div>
          {targetUser.id !== user?.id && (
            <button 
              className={`followRR-button ${followStatus[targetUser.id] ? 'following' : ''}`}
              onClick={(e) => handleFollowToggle(e, targetUser.id)}
            >
              {followStatus[targetUser.id] ? "Siguiendo" : "Seguir"}
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default SearchCard;