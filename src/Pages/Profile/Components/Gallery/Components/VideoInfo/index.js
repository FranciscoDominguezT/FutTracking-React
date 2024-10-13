import React from 'react';

const VideoInfo = ({ videoOwner, isFollowing, onFollowToggle }) => {
  if (!videoOwner) return null;

  return (
    <div className="info-user">
      <img
        src={videoOwner.avatar_url || "https://uxwing.com/wp-content/themes/uxwing/download/peoples-avatars/no-profile-picture-icon.png"}
        alt="Usuario"
        className="img-user-profile"
      />
      <div className="details-user">
        <p className="username">
          {videoOwner.nombre} {videoOwner.apellido}
        </p>
        <p className="userlocation">
          {/* {videoOwner.localidad_nombre},  */}
          {videoOwner.provincia_nombre}, {videoOwner.nacion_nombre}
        </p>
      </div>
      <button className="follow-button" onClick={onFollowToggle}>
        {isFollowing ? "Siguiendo" : "Seguir"}
      </button>
    </div>
  );
};

export default VideoInfo;