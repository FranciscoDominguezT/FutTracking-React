import React from 'react';

const GalleryGrid = ({ videos, onVideoClick }) => {
  if (videos.length === 0) {
    return <p className="no-videos-message">No hay videos cargados aún.</p>;
  }

  return (
    <div className="video-grid">
      {videos.map((video) => (
        <div className="gallery-item" key={video.id}>
          <video
            src={video.url}
            className="gallery-img"
            onClick={() => onVideoClick(video)}
            controls={false}
          ></video>
        </div>
      ))}
    </div>
  );
};

export default GalleryGrid;