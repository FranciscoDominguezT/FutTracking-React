import React, { useEffect, useState, useContext } from "react";
import axios from 'axios';
import { AuthContext } from '../../../../Context/auth-context';
import FollowersList from "../FollowersList";
import "./index.css";

const ProfileInfo = ({ usuario_id }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [showFollowers, setShowFollowers] = useState(false);
  const { user, token } = useContext(AuthContext);

  useEffect(() => {
    const fetchProfileAndFollowStatus = async () => {
      if (!usuario_id) {
        setError("ID de usuario no proporcionado");
        setLoading(false);
        return;
      }

      try {
        const [profileResponse, followResponse] = await Promise.all([
          axios.get(`http://localhost:5001/api/profile/player/${usuario_id}`), // Obtener el perfil del usuario
          axios.get(`http://localhost:5001/api/profile/player/${usuario_id}/followers`), // Obtener la cantidad de seguidores
          user && user.id ? axios.get(`http://localhost:5001/api/videos/${user.id}/${usuario_id}/follow`) : Promise.resolve({ data: { isFollowing: false } }) // Estado de seguimiento
        ]);

        setProfile(profileResponse.data);
        setFollowersCount(followResponse.data.followersCount); // Actualizar la cantidad de seguidores
        setIsFollowing(followResponse.data.isFollowing);
      } catch (error) {
        console.error("Error fetching profile or follow status:", error);
        setError("Error al obtener la información. Por favor, intenta de nuevo.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfileAndFollowStatus();
  }, [usuario_id, user]);

  const handleFollowToggle = async () => {
    if (!user || !user.id) return;

    try {
      const response = await axios.post(
        `http://localhost:5001/api/videos/${user.id}/${usuario_id}/followChange`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsFollowing(response.data.isFollowing);
    } catch (error) {
      console.error("Error toggling follow status:", error);
    }
  };

  const handleFollowersClick = () => {
    setShowFollowers(true);
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!profile) {
    return <div>No se encontró información del perfil</div>;
  }

  return (
    <div className="profile-info">
      <img
        src={profile.avatar_url || "/default-avatar.png"}
        alt="Player Profile"
        className="profile-pic"
      />
      <div className="profile-details">
        <h1 className="profile-name">
          {profile.nombre} {profile.apellido}
        </h1>
        <p className="profile-role">Jugador</p>
        <p className="profile-location">
          {profile.provincia_nombre || "No especificada"},{" "}
          {profile.nacion_nombre || "No especificado"}
        </p>
        <p className="profile-followers" onClick={handleFollowersClick}>
          <span>{followersCount} seguidores</span>
        </p>
      </div>
      <button 
        className={`edit-button ${isFollowing ? 'following' : ''}`} 
        onClick={handleFollowToggle}
      >
        {isFollowing ? "Siguiendo" : "Seguir"}
      </button>
      {showFollowers && (
        <FollowersList
          userId={usuario_id}
          onClose={() => setShowFollowers(false)}
        />
      )}
    </div>
  );
};

export default ProfileInfo;