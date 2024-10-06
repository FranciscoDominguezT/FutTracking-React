import React from 'react';

const UserInfo = ({ userData, isFollowing, onFollowToggle }) => {
  return (
    <div className="user-info">
      {userData ? (
        <>
          <img
            src={userData.avatar_url || "/default-avatar.png"}
            alt="Player Profile"
            className="user-profile-img"
          />
          <div className="user-details">
            <p className="user-name">{`${userData.nombre} ${userData.apellido}`}</p>
            <p className="user-location">{`${userData.provincia_nombre || ''}, ${userData.nacion_nombre || ''}`}</p>
          </div>
          <button className="follow-button" onClick={onFollowToggle}>
            {isFollowing ? "Siguiendo" : "Seguir"}
          </button>
        </>
      ) : (
        <p>Cargando información del usuario...</p>
      )}
    </div>
  );
};

export default UserInfo;