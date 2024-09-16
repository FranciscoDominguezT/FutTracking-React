import React, { useEffect, useState } from "react";
import axios from 'axios';
import "./index.css";

const ProfileInfo = ({ usuario_id, onEditClick }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!usuario_id) {
        setError("ID de usuario no proporcionado");
        setLoading(false);
        return;
      }

      try {
        console.log(`Fetching profile for usuario_id: ${usuario_id}`);
        const response = await axios.get(`http://localhost:5001/api/profile/player/${usuario_id}`);
        console.log(`Profile data received:`, response.data);
        setProfile(response.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError("Error al obtener el perfil. Por favor, intenta de nuevo.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [usuario_id]);

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
        <p className="profile-followers">
          <span>0 seguidores</span>
        </p>
      </div>
      <button className="edit-button" onClick={onEditClick}>
        Seguir
      </button>
    </div>
  );
};

export default ProfileInfo;