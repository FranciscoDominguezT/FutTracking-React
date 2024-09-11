import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./index.css";

const ProfileInfo = ({ onEditClick }) => {
  const [profile, setProfile] = useState(null);
  const [followersCount, setFollowersCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("Token:", token);

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axios.get(
          "http://localhost:5001/api/profile/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = response.data;
        console.log("API Response:", data);

        if (data.profile) {
          setProfile(data.profile);
          setFollowersCount(data.followersCount);
        } else {
          setError("No se encontró información del perfil");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError("Error al obtener el perfil. Por favor, intenta de nuevo.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

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
        <p className="profile-role">{profile.rol || "Jugador"}</p>
        <p className="profile-location">
          {profile.provincia_nombre || "No especificada"},{" "}
          {profile.nacion_nombre || "No especificado"}
        </p>
        <p className="profile-followers">
          <span>{followersCount} seguidores</span>
        </p>
      </div>
      <button className="edit-button" onClick={onEditClick}>
        Editar
      </button>
    </div>
  );
};

export default ProfileInfo;