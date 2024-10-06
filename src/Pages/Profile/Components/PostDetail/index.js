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
  const [localPost, setLocalPost] = useState({
    post_id: post?.post_id || "",
    nombre: post?.nombre || "Unknown",
    apellido: post?.apellido || "User",
    ...post,
  });


  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [selectedParentId, setSelectedParentId] = useState(null);
  const [likedComments, setLikedComments] = useState({});


  useEffect(() => {
    console.log("Selected post:", post);
    if (post && post.post_id) {
      fetchComments();
    } else {
      console.error("Post or post.post_id is undefined in PostDetail");
    }
  }, [post]);


  const fetchComments = async () => {
    if (!post || !post.post_id) {
      console.error("Post or post.id is undefined");
      return;
    }


    try {
      const response = await axios.get(
        `http://localhost:5001/api/posts/${post.post_id}/comments`
      );
      console.log("Comments fetched:", response.data);
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
      setLocalPost((prevPost) => ({
        ...prevPost,
        likes: response.data.likes,
      }));
    } catch (error) {
      console.error("Error al likear el post:", error);
    }
  };


  const handleLocalDelete = async (event) => {
    await onDelete(event, localPost.post_id);
    onClose();
    fetchPosts();
  };


  const handleCommentCreated = (newComment) => {
    setComments([...comments, newComment]);
  };


  const handleDeleteComment = async (commentId) => {
    if (
      window.confirm("¿Estás seguro de que quieres eliminar este comentario?")
    ) {
      try {
        await axios.delete(
          `http://localhost:5001/api/posts/${localPost.post_id}/comments/${commentId}`
        );
        setComments(
          comments.filter((comment) => comment.comment_id !== commentId)
        );
      } catch (error) {
        console.error("Error eliminando el comentario:", error);
      }
    }
  };


  const convertToLocalTime = (utcDateString) => {
    const date = new Date(utcDateString);
    return date.toLocaleString("es-AR", {
      timeZone: "America/Argentina/Buenos_Aires",
    });
  };


  useEffect(() => {
    const storedLikes = localStorage.getItem("likedComments");
    if (storedLikes) {
      setLikedComments(JSON.parse(storedLikes));
    }
  }, []);


  const handleCommentLike = async (commentId, currentLikes) => {
    try {
      const isLiked = likedComments[commentId];
      const newLikeCount = isLiked ? currentLikes - 1 : currentLikes + 1;


      const response = await axios.put(
        `http://localhost:5001/api/comments/${commentId}/like`,
        { likes: newLikeCount }
      );
      setComments(
        comments.map((comment) =>
          comment.comment_id === commentId
            ? { ...comment, likes: response.data.likes }
            : comment
        )
      );


      const newLikedComments = {
        ...likedComments,
        [commentId]: !isLiked,
      };
      setLikedComments(newLikedComments);
      localStorage.setItem("likedComments", JSON.stringify(newLikedComments));
    } catch (error) {
      console.error("Error actualizando likes del comentario:", error);
    }
  };


  const renderComments = () => {
    const commentTree = [];
    const commentMap = {};


    // Construir un mapa de comentarios por id
    comments.forEach((comment) => {
      comment.children = [];
      commentMap[comment.comment_id] = comment;
    });


    // Construir la estructura de árbol
    comments.forEach((comment) => {
      if (comment.parentid) {
        // Si el comentario tiene un padre, añádelo como hijo de ese padre
        commentMap[comment.parentid].children.push(comment);
      } else {
        // Si no tiene padre, es un comentario raíz
        commentTree.push(comment);
      }
    });


    // Renderizar el árbol de comentarios
    const renderCommentBranch = (commentBranch, depth = 0) => {
      return commentBranch.map((comment) => (
        <div
          key={comment.comment_id}
          className="commentRT"
          style={{ marginLeft: `${depth * 20}px` }}
        >
          <div className="comment-header">
            <img
              src={comment.avatar_url || "default-avatar.png"}
              alt="Avatar del usuario"
              className="user-avatar"
            />
            <div className="comment-info">
              <h4>
                {comment.nombre || "Unknown"} {comment.apellido || "User"}
              </h4>
              <p>{convertToLocalTime(comment.fechapublicacion)}</p>
            </div>
          </div>
          <p className="comment-content">{comment.contenido}</p>
          <div className="comment-footer">
            <button
              onClick={() =>
                handleCommentLike(comment.comment_id, comment.likes)
              }
              className={`comment-likes ${
                likedComments[comment.comment_id] ? "liked" : ""
              }`}
            >
              <FaHeart /> {comment.likes || 0}
            </button>
            <button
              onClick={() => {
                setSelectedParentId(comment.comment_id);
                setIsCommentModalOpen(true);
              }}
              className="reply-button"
            >
              <FaComment /> {(comment.children && comment.children.length) || 0}
            </button>
            <button
              onClick={() => handleDeleteComment(comment.comment_id)}
              className="delete-button"
            >
              <FaTrash />
            </button>
          </div>
          {/* Renderizar las respuestas al comentario */}
          {renderCommentBranch(comment.children, depth + 1)}
        </div>
      ));
    };


    return renderCommentBranch(commentTree);
  };


  return (
    <div className="post-detail-overlay">
      <div className="post-detail-content">
        <div className="post-detail-header">
          <button onClick={onClose} className="back-button">
            <FaArrowLeft />
          </button>
          <h2 className="post-detail-title">Posteos</h2>
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
                likedPosts[localPost.id] ? "liked" : ""
              }`}
            >
              <FaHeart /> {localPost.likes || 0}
            </button>
            <button
              onClick={() => setIsCommentModalOpen(true)}
              className="action-button"
            >
              <FaComment /> {comments.length}
            </button>
          </div>
        </div>
        <div className="comments-section">
          <h3>Comentarios</h3>
          {renderComments()}
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
