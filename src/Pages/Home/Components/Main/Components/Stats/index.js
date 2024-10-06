import React from 'react';
import { FaHeart, FaComment, FaEye, FaShareAlt } from "react-icons/fa";

const Stats = ({ likes, commentsCount, onLikeClick, onCommentClick, onShareClick, liked }) => {
  return (
    <div className="stats">
      <div
        className="stat"
        onClick={onLikeClick}
        style={{ cursor: "pointer" }}
      >
        <FaHeart className={`stat-icon ${liked ? "liked" : ""}`} />
        <span>{likes}</span>
      </div>
      <div
        className="stat"
        onClick={onCommentClick}
        style={{ cursor: "pointer" }}
      >
        <FaComment className="stat-icon" />
        <span>{commentsCount}</span>
      </div>
      <div className="stat">
        <FaEye className="stat-icon" />
        <span>61.3K</span>
      </div>
      <div
        className="stat"
        onClick={onShareClick}
        style={{ cursor: "pointer" }}
      >
        <FaShareAlt className="stat-icon" />
        <span>Compartir</span>
      </div>
    </div>
  );
};

export default Stats;