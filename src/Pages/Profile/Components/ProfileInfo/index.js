import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";

const ProfileInfo = ({ onEditClick }) => {
    const [profile, setProfile] = useState(null);
    const [followersCount, setFollowersCount] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                // Obtener el token desde el localStorage
                const token = localStorage.getItem('token');

                if (!token) {
                    navigate('/login'); // Redirigir a login si no hay token
                    return;
                }

                const response = await fetch('http://localhost:5001/api/profile/profile', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}` // Agregar el token al header
                    }
                });

                const data = await response.json();

                if (response.ok) {
                    setProfile(data.profile);
                    setFollowersCount(data.followersCount);
                } else {
                    console.error("Error fetching profile:", data.error);
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
            }
        };

        fetchProfile();
    }, [navigate]);

    if (!profile) {
        return <div>Loading...</div>;
    }

    return (
        <div className="profile-info">
            <img src={profile.avatar_url} alt="Player Profile" className="profile-pic" />
            <div className="profile-details">
                <h1 className="profile-name">{profile.nombre} {profile.apellido}</h1>
                <p className="profile-role">{profile.rol}</p>
                <p className="profile-location">{profile.provincia_nombre}, {profile.nacion_nombre}</p>
                <p className="profile-followers"><span>{followersCount} followers</span></p>
            </div>
            <button 
                className="edit-button"
                onClick={() => onEditClick()}
            >
                Editar
            </button>
        </div>
    );
};

export default ProfileInfo;
