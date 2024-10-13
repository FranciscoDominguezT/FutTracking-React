import React, { useRef, useEffect } from 'react';
import { FaArrowLeft } from "react-icons/fa";
import VideoControls from '../VideoControls';

const FullScreenVideo = ({
  video,
  isPlaying,
  setIsPlaying,
  currentTime,
  setCurrentTime,
  duration,
  setDuration,
  onClose,
  children
}) => {
  const videoRef = useRef();

  useEffect(() => {
    if (videoRef.current) {
      const playVideo = async () => {
        try {
          await videoRef.current.play();
          setIsPlaying(true);
        } catch (e) {
          console.error("Error al reproducir:", e);
          setIsPlaying(false);
        }
      };
      playVideo();
    }
  }, [video, setIsPlaying]);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch((e) => console.error("Error al reproducir:", e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    setCurrentTime(videoRef.current.currentTime);
    setDuration(videoRef.current.duration);
  };

  const handleScreenClick = () => {
    handlePlayPause();
  };

  return (
    <div className="fullscreen-video">
      <video
        src={video.url}
        className="fullscreen-video-player"
        autoPlay
        controlsList="nodownload nofullscreen"
        ref={videoRef}
        playsInline
        loop
        onTimeUpdate={handleTimeUpdate}
        onClick={handleScreenClick}
        onLoadedMetadata={() =>
          videoRef.current
            .play()
            .catch((e) => console.error("Error al cargar metadata:", e))
        }
      ></video>
      <button className="close-button" onClick={onClose}>
        <FaArrowLeft size={24} />
      </button>
      <div className="info-player">
        <VideoControls
          isPlaying={isPlaying}
          currentTime={currentTime}
          duration={duration}
          onPlayPause={handlePlayPause}
          videoRef={videoRef}
        />
        {children}
      </div>
    </div>
  );
};

export default FullScreenVideo;