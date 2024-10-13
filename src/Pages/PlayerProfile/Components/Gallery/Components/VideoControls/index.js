import React, { useRef, useState } from 'react';
import { FaPlay, FaPause } from "react-icons/fa";

const VideoControls = ({ isPlaying, currentTime, duration, onPlayPause, videoRef }) => {
  const progressBarRef = useRef();
  const [isDragging, setIsDragging] = useState(false);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleProgressClick = (e) => {
    const newTime =
      (e.nativeEvent.offsetX / progressBarRef.current.offsetWidth) * duration;
    videoRef.current.currentTime = newTime;
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    handleProgressClick(e);
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      handleProgressClick(e);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="wrapper-controls">
      <button className="button-pause" onClick={onPlayPause}>
        {isPlaying ? <FaPause /> : <FaPlay />}
      </button>
      <div
        className="bar-time"
        ref={progressBarRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <span className="taime">{formatTime(currentTime)}</span>
        <div className="bar-progress">
          <div
            className="progres"
            style={{ width: `${(currentTime / duration) * 100}%` }}
          ></div>
        </div>
        <span className="taime">{formatTime(duration - currentTime)}</span>
      </div>
    </div>
  );
};

export default VideoControls;