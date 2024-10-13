import React from 'react';
import { FaHeart, FaComment, FaEye, FaShareAlt } from "react-icons/fa";

const VideoStats = ({ likes, commentsCount, onLikeClick, onCommentClick, onShareClick }) => {
  return (
    <div className="estats">
      <div className="estat" onClick={onLikeClick} style={{ cursor: "pointer" }}>
        <FaHeart className={`stat-icon ${likes > 0 ? "liked" : ""}`} />
        <span>{likes}</span>
      </div>
      <div className="estat" onClick={onCommentClick} style={{ cursor: "pointer" }}>
        <FaComment className="estat-icon" />
        <span>{commentsCount}</span>
      </div>
      <div className="estat">
        <FaEye className="estat-icon" />
        <span>61.3K</span>
      </div>
      <div className="estat" onClick={onShareClick} style={{ cursor: "pointer" }}>
        <FaShareAlt className="estat-icon" />
        <span>Compartir</span>
      </div>
    </div>
  );
};

export default VideoStats;