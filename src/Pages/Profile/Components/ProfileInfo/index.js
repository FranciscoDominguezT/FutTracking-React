import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";

const ProfileInfo = ({ onEditClick }) => {
    const [profile, setProfile] = useState(null);
    const [followersCount, setFollowersCount] = useState(0);
    const navigate = useNavigate(); // Hook para navegación

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/profile/profile'); // Asegúrate de que esta URL coincida con tu configuración
                const data = await response.json();

                if (response.ok) {
                    setProfile(data.profile);
                    setFollowersCount(data.followersCount);
                } else {
                    console.error("Error fetching data:", data.error);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchProfile();
    }, []);

    if (!profile) {
        return <div>Loading...</div>;
    }

    return (
        <div className="profile-info">
            <img src={profile.avatar_url} alt="Player Profile" className="profile-pic" />
            <div className="profile-details">
                <h1 className="profile-name">{profile.usuarios.nombre} {profile.usuarios.apellido}</h1>
                <p className="profile-role">{profile.usuarios.rol}</p>
                <p className="profile-location">{profile.provincias.nombre}, {profile.naciones.nombre}</p>
                <p className="profile-followers"><span>{followersCount} followers</span></p>
            </div>
            <button 
                className="edit-button"
                onClick={() => onEditClick()} // Llama a la función proporcionada como prop
            >
                Editar
            </button>
        </div>
    );
}

export default ProfileInfo;
