import React, { useRef, useEffect } from 'react';

const VideoPlayer = ({ videoData, isPlaying, onPlayPause, onTimeUpdate, onDurationChange }) => {
  const videoRef = useRef();

  useEffect(() => {
    if (videoData && videoRef.current) {
      const playVideo = async () => {
        try {
          if (isPlaying) {
            await videoRef.current.play();
          } else {
            videoRef.current.pause();
          }
        } catch (e) {
          console.error("Error al reproducir:", e);
        }
      };
      playVideo();
    }
  }, [videoData, isPlaying]);

  const handleTimeUpdate = () => {
    onTimeUpdate(videoRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    onDurationChange(videoRef.current.duration);
  };

  const handleScreenClick = () => {
    onPlayPause();
  };

  return (
    videoData && videoData.url ? (
      <video
        ref={videoRef}
        src={videoData.url}
        className="player-img"
        onClick={handleScreenClick}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        controls={false}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
    ) : (
      <p>Cargando video...</p>
    )
  );
};

export default VideoPlayer;