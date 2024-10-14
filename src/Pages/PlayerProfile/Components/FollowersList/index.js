import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft } from 'react-icons/fa';
import './index.css'; // Asegúrate de crear este archivo CSS
import { AuthContext } from '../../../../Context/auth-context';

const FollowersList = ({ userId, onClose }) => {
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, token } = useContext(AuthContext);
  const [followStatus, setFollowStatus] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/profile/player/${userId}/followers/list`);
        setFollowers(response.data);
        setLoading(false);

        // Verificar el estado de seguimiento para cada seguidor
        const statusPromises = response.data.map(async (follower) => {
          try {
            const followResponse = await axios.get(
              `http://localhost:5001/api/videos/${user.id}/${follower.id}/follow`
            );
            return { [follower.id]: followResponse.data.isFollowing };
          } catch (error) {
            console.error(`Error checking follow status for user ${follower.id}:`, error);
            return { [follower.id]: false };
          }
        });

        const statuses = await Promise.all(statusPromises);
        setFollowStatus(Object.assign({}, ...statuses));

      } catch (error) {
        console.error('Error fetching followers:', error);
        setError('Error al obtener la lista de seguidores');
        setLoading(false);
      }
    };

    if (userId) {
      fetchFollowers();
    }
  }, [userId, user]);

  const handleFollowToggle = async (e, targetUserId) => {
    e.stopPropagation();
    if (!user || !user.id) return;

    try {
      const response = await axios.post(
        `http://localhost:5001/api/videos/${user.id}/${targetUserId}/followChange`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFollowStatus((prev) => ({ ...prev, [targetUserId]: response.data.isFollowing }));
    } catch (error) {
      console.error('Error toggling follow status:', error);
    }
  };

  const handleCardClick = (followerId) => {
    // Redirigir al perfil del seguidor al hacer clic en la tarjeta
    console.log(`Navigating to profile with followerId: ${followerId}`);
    navigate(`/playerProfile/${followerId}`);  // Navegar al perfil del seguidor
  };

  if (loading) {
    return <div className="followers-list-overlay">Cargando...</div>;
  }

  if (error) {
    return <div className="followers-list-overlay">{error}</div>;
  }

  return (
    <div className="followers-list-overlay">
      <div className="followers-list-content">
        <div className="followers-list-header">
          <button onClick={onClose} className="back-button">
            <FaArrowLeft />
          </button>
          <h2 className="followers-list-title">Lista de Seguidores</h2>
        </div>
        <div className="followers-list">
          {followers.map((follower) => (
            <div 
              key={follower.id} 
              className="follower-item"
              onClick={() => handleCardClick(follower.id)}
            >
              <img
                src={follower.avatar_url || '/default-avatar.png'}
                alt={`${follower.nombre} ${follower.apellido}`}
                className="follower-avatar"
              />
              <div className="follower-info">
                <h3>{`${follower.nombre} ${follower.apellido}`}</h3>
                <p>{follower.rol}</p>
              </div>
              {follower.id !== user?.id && (
                <button
                  className={`followRR-button ${followStatus[follower.id] ? 'following' : ''}`}
                  onClick={(e) => handleFollowToggle(e, follower.id)}
                >
                  {followStatus[follower.id] ? 'Siguiendo' : 'Seguir'}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FollowersList;