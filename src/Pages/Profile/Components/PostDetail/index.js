import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaHeart, FaComment, FaArrowLeft, FaTrash } from "react-icons/fa";
import NewCommentModal from "../NewCommentModal";
import "./index.css";

const PostDetail = ({
  post,
  onClose,
  onDelete,
  onLike,
  likedPosts,
  fetchPosts,
}) => {
  const [comments, setComments] = useState([]);
  const [localPost, setLocalPost] = useState(post);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [selectedParentId, setSelectedParentId] = useState(null);
  const [likedComments, setLikedComments] = useState({});

  useEffect(() => {
    if (post && post.post_id) {
      fetchComments();
      setLocalPost(post);
    }
  }, [post]);

  const fetchComments = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5001/api/posts/${post.post_id}/comments`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Comentarios recibidos:", response.data);
      setComments(response.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleLocalLike = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:5001/api/posts/${localPost.post_id}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
  
      setLocalPost(prevPost => ({
        ...prevPost,
        likes: response.data.likes
      }));
  
      onLike(event, localPost.post_id);
    } catch (error) {
      console.error("Error al likear el post:", error);
    }
  };

  const handleCommentLike = async (commentId) => {
    try {
      const response = await axios.put(
        `http://localhost:5001/api/posts/${commentId}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setComments(comments.map(comment => 
        comment.comment_id === commentId 
          ? { ...comment, likes: response.data.likes }
          : comment
      ));
      setLikedComments(prev => ({ ...prev, [commentId]: !prev[commentId] }));
    } catch (error) {
      console.error("Error al likear el comentario:", error);
    }
  };

  const handleLocalDelete = async (event) => {
    event.preventDefault();
    try {
      await onDelete(event, localPost.post_id);
      onClose();
    } catch (error) {
      console.error("Error al eliminar el post:", error);
    }
  };

  const handleCommentCreated = (newComment) => {
    setComments(prevComments => [...prevComments, newComment]);
    fetchComments(); // Refetch to ensure we have the latest data
  };

  const handleCommentDelete = async (commentId) => {
    try {
      await axios.delete(`http://localhost:5001/api/posts/${commentId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setComments(prevComments => prevComments.filter(comment => comment.comment_id !== commentId));
    } catch (error) {
      console.error("Error al eliminar el comentario:", error);
    }
  };

  const convertToLocalTime = (utcDateString) => {
    const date = new Date(utcDateString);
    return date.toLocaleString("es-AR", {
      timeZone: "America/Argentina/Buenos_Aires",
    });
  };

  const renderComments = (parentId = null, depth = 0) => {
    return comments
      .filter(comment => comment.parent_id === parentId)
      .map((comment) => (
        <div 
          key={comment.comment_id} 
          className="comment"
          style={{ marginLeft: `${depth * 20}px` }}
        >
          <div className="comment-header">
            <img
              src={comment.avatar_url || "default-avatar.png"}
              alt="Avatar del usuario"
              className="user-avatar"
            />
            <div className="comment-info">
              <h4>{comment.nombre} {comment.apellido}</h4>
              <p>{convertToLocalTime(comment.fechapublicacion)}</p>
            </div>
          </div>
          <p className="comment-content">{comment.contenido}</p>
          <div className="comment-footer">
            <button
              onClick={() => handleCommentLike(comment.comment_id)}
              className={`action-button ${likedComments[comment.comment_id] ? "liked" : ""}`}
            >
              <FaHeart /> {comment.likes || 0}
            </button>
            <button
              onClick={() => {
                setSelectedParentId(comment.comment_id);
                setIsCommentModalOpen(true);
              }}
              className="action-button"
            >
              <FaComment /> {comments.filter(c => c.parent_id === comment.comment_id).length}
            </button>
            <button
              onClick={() => handleCommentDelete(comment.comment_id)}
              className="action-button delete-button"
            >
              <FaTrash />
            </button>
          </div>
          {renderComments(comment.comment_id, depth + 1)}
        </div>
      ));
  };

  return (
    <div className="post-detail-overlay">
      <div className="post-detail-content">
        <div className="post-detail-header">
          <button onClick={onClose} className="back-button">
            <FaArrowLeft />
          </button>
          <h2 className="post-detail-title">Detalle del Post</h2>
        </div>
        <div className="original-post">
          <div className="post-header">
            <img
              src={localPost.avatar_url || "default-avatar.png"}
              alt="Avatar del usuario"
              className="user-avatar"
            />
            <div className="post-info">
              <h3>
                {localPost.nombre || "Unknown"} {localPost.apellido || "User"}
              </h3>
              <p>{convertToLocalTime(localPost.fechapublicacion)}</p>
            </div>
            <button onClick={handleLocalDelete} className="delete-button">
              <FaTrash />
            </button>
          </div>
          <p className="post-content">{localPost.contenido}</p>
          <div className="post-footer">
            <button
              onClick={handleLocalLike}
              className={`action-button ${
                likedPosts[localPost.post_id] ? "liked" : ""
              }`}
            >
              <FaHeart /> {localPost.likes || 0}
            </button>
            <button
              onClick={() => {
                setSelectedParentId(localPost.post_id);
                setIsCommentModalOpen(true);
              }}
              className="action-button"
            >
              <FaComment /> {comments.length}
            </button>
          </div>
        </div>
        <div className="comments-section">
          <h3>Comentarios</h3>
          {renderComments(localPost.post_id)}
        </div>
      </div>
      {isCommentModalOpen && (
      <NewCommentModal
        isOpen={isCommentModalOpen}
        onClose={() => {
          setIsCommentModalOpen(false);
          setSelectedParentId(null);
        }}
        onCommentCreated={handleCommentCreated}
        postId={localPost.post_id}
        parentId={selectedParentId}
      />
    )}
    </div>
  );
};

export default PostDetail;