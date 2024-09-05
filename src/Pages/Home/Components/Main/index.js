import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  FaPlay,
  FaPause,
  FaHeart,
  FaComment,
  FaEye,
  FaShareAlt,
  FaDownload,
  FaLink,
  FaChevronDown,
  FaTrash
} from "react-icons/fa";
import { FaRegEnvelope } from "react-icons/fa6";
import "./index.css";

const API_BASE_URL = 'http://localhost:5001/api';

const Main = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showCommentMenu, setShowCommentMenu] = useState(false);
  const [videoData, setVideoData] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedComment, setSelectedComment] = useState(null);
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [lastClickTime, setLastClickTime] = useState(0);
  const [liked, setLiked] = useState(false);
  const [replyTo, setReplyTo] = useState(null);
  const videoRef = useRef();
  const shareMenuRef = useRef();
  const commentMenuRef = useRef();
  const [likedComments, setLikedComments] = useState({});
  const progressBarRef = useRef();
  const [visibleReplies, setVisibleReplies] = useState({});
  const [commentsCount, setCommentsCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(11);
  const [userData, setUserData] = useState(null);
  const [userLocation, setUserLocation] = useState("");

  useEffect(() => {
    const getRandomVideoId = () => Math.floor(Math.random() * 5) + 1;
    const fetchVideoData = async () => {
      const videoId = getRandomVideoId();
      try {
        const videoResponse = await axios.get(`${API_BASE_URL}/videos/${videoId}`);
        console.log("Video data:", videoResponse.data);

        setVideoData(videoResponse.data);
        setSelectedVideo(videoResponse.data);
        setLikes(videoResponse.data.likes);
        setLiked(videoResponse.data.liked);

        const commentsResponse = await axios.get(`${API_BASE_URL}/videos/${videoId}/comments`);
        console.log("Video comments:", commentsResponse.data);
        setComments(commentsResponse.data);

        const likesResponse = await axios.get(`${API_BASE_URL}/videos/${videoId}/likes`);
        console.log("Video likes:", likesResponse.data);
        setLikes(likesResponse.data.likes);

        const comentarioLikesResponse = await axios.get(`${API_BASE_URL}/videos/${videoId}/comment-likes`);
        console.log("Comentario likes:", comentarioLikesResponse.data);
        const likesMap = comentarioLikesResponse.data.reduce((acc, like) => {
          acc[like.comentarioid] = (acc[like.comentarioid] || 0) + 1;
          return acc;
        }, {});
        setLikedComments(likesMap);

      } catch (error) {
        console.error("Error al obtener datos del video:", error.response?.data || error.message);
      }
    };

    fetchVideoData();
  }, []);

  useEffect(() => {
    if (videoData && videoRef.current) {
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

  }, [videoData]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (shareMenuRef.current && !shareMenuRef.current.contains(event.target)) {
        setShowShareMenu(false);
      }
      if (commentMenuRef.current && !commentMenuRef.current.contains(event.target)) {
        setShowCommentMenu(false);
      }
    };

    if (showShareMenu || showCommentMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showShareMenu, showCommentMenu]);

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

  const handleScreenClick = (e) => {
    const currentTime = new Date().getTime();
    if (currentTime - lastClickTime < 300) {
      handleDoubleClick(e);
    } else {
      handlePlayPause();
    }
    setLastClickTime(currentTime);
  };

  const handleDoubleClick = (e) => {
    const newTime = videoRef.current.currentTime + 10;
    videoRef.current.currentTime = newTime < videoRef.current.duration ? newTime : videoRef.current.duration;
  };

  const handleShareClick = (e) => {
    e.stopPropagation();
    setShowShareMenu(!showShareMenu);
  };

  const handleLikeClick = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/videos/${selectedVideo.id}/like`);
      setLikes(response.data.likes); // Actualiza el número de likes en el estado
      setLiked(response.data.liked); // Actualiza el estado de si el video está likeado o no
    } catch (error) {
      console.error('Error updating video likes:', error);
    }
  };


  useEffect(() => {
    if (selectedVideo && Array.isArray(selectedVideo.likes)) {
      setLikes(selectedVideo.likes.length);
      setLiked(selectedVideo.likes.includes(11));
    } else {
      setLikes(0);
      setLiked(false); // O el valor por defecto que prefieras
    }
  }, [selectedVideo]);




  const handleCloseShareMenu = () => {
    setShowShareMenu(false);
  };

  const handleCloseCommentMenu = () => {
    setShowCommentMenu(false);
  };

  const handleDownload = () => {
    if (videoData && videoData.url) {
      const link = document.createElement("a");
      link.href = videoData.url;
      link.setAttribute("download", "video.mp4");
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleTimeUpdate = () => {
    setCurrentTime(videoRef.current.currentTime);
    setDuration(videoRef.current.duration);
  };

  const handleProgressClick = (e) => {
    const newTime = (e.nativeEvent.offsetX / progressBarRef.current.offsetWidth) * duration;
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
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

  const handleReplyClick = (commentId) => {
    setReplyTo(commentId);
  };

  useEffect(() => {
    const fetchCommentsCount = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/comments/count/${selectedVideo.id}`);
        setCommentsCount(response.data.count);
      } catch (error) {
        console.error("Error fetching comments count:", error);
      }
    };

    if (selectedVideo) {
      fetchCommentsCount();
    }
  }, [selectedVideo]);

  const handleCommentClick = async () => {
    setShowCommentMenu(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/comments/${selectedVideo.id}`);
      console.log("Comentarios obtenidos:", response.data);

      if (Array.isArray(response.data)) {
        setComments(response.data);
      } else {
        console.error("La respuesta no es un array:", response.data);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  useEffect(() => {
    // Recuperar los likes almacenados en localStorage
    const storedLikes = JSON.parse(localStorage.getItem('likedComments')) || {};
    setLikedComments(storedLikes);
  }, []);

  useEffect(() => {
    // Guardar los likes actuales en localStorage cada vez que cambie likedComments
    localStorage.setItem('likedComments', JSON.stringify(likedComments));
  }, [likedComments]);


  const handleCommentLike = async (commentId) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/comments/${commentId}/like`, { userid: 11 });
      const updatedLikes = response.data.likes;

      // Actualiza el estado de los comentarios
      setComments(prevComments =>
        prevComments.map(c =>
          c.id === commentId ? { ...c, likes: updatedLikes } : c
        )
      );

      // Actualiza el estado de likedComments
      setLikedComments(prevLikedComments => ({
        ...prevLikedComments,
        [commentId]: !prevLikedComments[commentId] // Toggle like status
      }));
    } catch (error) {
      console.error("Error updating comment likes:", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      // Hacer la solicitud DELETE a la API
      await axios.delete(`${API_BASE_URL}/comments/${commentId}`);
      // Actualizar los comentarios filtrando el eliminado
      setComments(comments.filter(comment => comment.id !== commentId));
    } catch (error) {
      console.error("Error al eliminar el comentario:", error);
    }
  };

  const handleSubmitComment = async () => {
    if (!newComment) {
      console.error('No se puede enviar un comentario vacío');
      return;
    }
  
    try {
      const response = await axios.post(`${API_BASE_URL}/comments/${selectedVideo.id}/comments`, {
        usuarioid: currentUserId,
        contenido: newComment,
        parent_id: replyTo || null // Si es una respuesta
      });
  
      // Actualiza la lista de comentarios con el nuevo comentario
      setComments([...comments, response.data]);
      setNewComment(''); // Limpia el campo de entrada
    } catch (error) {
      console.error('Error al publicar comentario:', error);
    }
  };
  

  const renderComments = (parentId = null) => {
    // Ordenar comentarios por fecha de comentario
    const sortedComments = [...comments].sort((a, b) => new Date(b.fechacomentario) - new Date(a.fechacomentario));

    return sortedComments
      .filter(comment => comment.parent_id === parentId)
      .map(comment => {
        const hasReplies = sortedComments.some(reply => reply.parent_id === comment.id);
        const replies = sortedComments.filter(reply => reply.parent_id === comment.id);
        const areRepliesVisible = visibleReplies[comment.id];

        return (
          <div key={comment.id} className="comment">
            <div className="comment-user-info">
              <img
                src={comment.avatar_url || "default-avatar.png"}
                alt="User Profile"
                className="comment-user-profile-img"
              />
              <div className="comment-user-details">
                <p className="comment-user-name">
                  {comment.nombre || "Unknown"} {comment.apellido || "User"}
                </p>
                <p className="comment-timestamp">{new Date(comment.fechacomentario).toLocaleString()}</p>
              </div>
            </div>
            <p className="comment-text">{comment.contenido}</p>
            <div className="comment-stats">
              <button className="reply-button" onClick={() => setReplyTo(comment.id)}>
                Responder
              </button>
              <div className="comment-like-icon" onClick={() => handleCommentLike(comment.id)}>
                <FaHeart className={likedComments[comment.id] ? "liked" : ""} />
                <span>{comment.likes}</span>
              </div>
              <div className="comment-delete-icon" onClick={() => handleDeleteComment(comment.id)}>
              <FaTrash />
              </div>
            </div>
            {hasReplies && (
              <div>
                {!areRepliesVisible && (
                  <button className="view-replies-button" onClick={() => setVisibleReplies({ ...visibleReplies, [comment.id]: true })}>
                    Ver Respuesta/s
                  </button>
                )}
                {areRepliesVisible && (
                  <div>
                    {replies.map(reply => (
                      <div key={reply.id} className="comment-reply">
                        <img
                          src={reply.avatar_url || "default-avatar.png"}
                          alt="User Profile"
                          className="comment-user-profile-img"
                        />
                        <p className="reply-user-name">
                          <span>{reply.nombre || 'Unknown'} {reply.apellido || 'User'}</span>
                          <FaPlay className="reply-icon" />
                          <span>{comment.nombre || 'Unknown'} {comment.apellido || 'User'}</span>
                        </p>
                        <p className="comment-timestamp">{new Date(reply.fechacomentario).toLocaleString()}</p>
                        <p className="comment-text">{reply.contenido}</p>
                        <div className="comment-stats">
                          <button className="reply-button" onClick={() => setReplyTo(reply.id)}>
                            Responder
                          </button>
                          <div className="comment-like-icon" onClick={() => handleCommentLike(reply.id)}>
                            <FaHeart className={likedComments[reply.id] ? "liked" : ""} />
                            <span>{reply.likes}</span>
                          </div>
                          <div className="comment-delete-icon" onClick={() => handleDeleteComment(comment.id)}>
                            <FaTrash />
                          </div>
                        </div>
                      </div>
                    ))}
                    <button className="hide-replies-button" onClick={() => setVisibleReplies({ ...visibleReplies, [comment.id]: false })}>
                      Ocultar Respuestas
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      });
  };



  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className="image-container">
      {videoData && videoData.url ? (
        <video
          ref={videoRef}
          src={videoData.url}
          className="player-img"
          onClick={handleScreenClick}
          onTimeUpdate={handleTimeUpdate}
          controls={false}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ) : (
        <p>Cargando video...</p>
      )}
      <div className="player-info">
        <div className="controls-wrapper">
          <button className="pause-button" onClick={handlePlayPause}>
            {isPlaying ? <FaPause /> : <FaPlay />}
          </button>
          <div
            className="time-bar"
            ref={progressBarRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
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
        <div className="user-info">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjDM0PhKJ_GdWFpZd6zUh3lENRBqkScnZ4Cg&s"
            alt="Player Profile"
            className="user-profile-img"
          />
          <div className="user-details">
            <p className="user-name">Ruben Botta</p>
            <p className="user-location">CABA, Buenos Aires, Argentina</p>
          </div>
          <button className="follow-button">Siguiendo</button>
        </div>
        <div className="stats">
          <div
            className="stat"
            onClick={handleLikeClick}
            style={{ cursor: "pointer" }}
          >
            <FaHeart className={`stat-icon ${liked ? "liked" : ""}`} />
            <span>{likes}</span>
          </div>
          <div
            className="stat"
            onClick={handleCommentClick}
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
            onClick={handleShareClick}
            style={{ cursor: "pointer" }}
          >
            <FaShareAlt className="stat-icon" />
            <span>Compartir</span>
          </div>
        </div>
      </div>
      {showShareMenu && (
        <div
          className="share-menu"
          ref={shareMenuRef}
          onClick={(e) => e.stopPropagation()}
        >
          <p className="share-title">Compartir video</p>
          <div className="share-subtitle-container">
            <FaRegEnvelope className="envelope" />
            <p className="share-subtitle">Enviar vía Mensaje Directo</p>
          </div>
          <div className="share-icons">
            <div className="share-icon-container">
              <img
                src="https://cdn-icons-png.freepik.com/256/3983/3983877.png?semt=ais_hybrid"
                alt="WhatsApp"
                className="share-img"
              />
              <span>WhatsApp</span>
            </div>
            <div className="share-icon-container">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Telegram_logo.svg/2048px-Telegram_logo.svg.png"
                alt="Telegram"
                className="share-img"
              />
              <span>Telegram</span>
            </div>
            <div className="share-icon-container">
              <img
                src="https://cdn1.iconfinder.com/data/icons/logotypes/32/circle-linkedin-512.png"
                alt="LinkedIn"
                className="share-img"
              />
              <span>LinkedIn</span>
            </div>
            <div className="share-icon-container">
              <img
                src="https://static-00.iconduck.com/assets.00/gmail-icon-1024x1024-09wrt8am.png"
                alt="Gmail"
                className="share-img"
              />
              <span>Gmail</span>
            </div>
          </div>
          <div className="share-icons">
            <div className="share-icon-container">
              <div className="share-icon">
                <FaLink />
              </div>
              <span>Copiar enlace</span>
            </div>
            <div className="share-icon-container" onClick={handleDownload}>
              <div className="share-icon">
                <FaDownload />
              </div>
              <span>Guardar</span>
            </div>
          </div>
          <button className="cancel-button" onClick={handleCloseShareMenu}>
            Cancelar
          </button>
        </div>
      )}
      {showCommentMenu && (
        <div className="comment-menu" ref={commentMenuRef} onClick={(e) => e.stopPropagation()}>
          <p className="comment-title">Comentarios</p>
          <div className="comment-section">
            {renderComments()}
          </div>
          <div className="comment-input-wrapper">
            <input
              type="text"
              className="comment-input"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={replyTo !== null ? "Responde al comentario..." : "Escribí tu respuesta"}
            />
            <button className="comment-send-button" onClick={handleSubmitComment}>
              Enviar
            </button>
          </div>
          <button className="cancel-button" onClick={handleCloseCommentMenu}>
            Cancelar
          </button>
        </div>
      )}
    </div>
  );
};


export default Main;
