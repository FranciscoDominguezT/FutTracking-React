import React, { useRef } from 'react';
import { FaPlay, FaPause } from "react-icons/fa";

const Controls = ({ isPlaying, currentTime, duration, onPlayPause }) => {
  const progressBarRef = useRef();

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleProgressClick = (e) => {
    const newTime = (e.nativeEvent.offsetX / progressBarRef.current.offsetWidth) * duration;
    onPlayPause(newTime);
  };

  return (
    <div className="controls-wrapper">
      <button className="pause-button" onClick={() => onPlayPause()}>
        {isPlaying ? <FaPause /> : <FaPlay />}
      </button>
      <div
        className="time-bar"
        ref={progressBarRef}
        onClick={handleProgressClick}
      >
        <span className="time">{formatTime(currentTime)}</span>
        <div className="progress-bar">
          <div
            className="progress"
            style={{ width: `${(currentTime / duration) * 100}%` }}
          ></div>
        </div>
        <span className="time">{formatTime(duration - currentTime)}</span>
      </div>
    </div>
  );
};

export default Controls;