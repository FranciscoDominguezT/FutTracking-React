import React, { useState, useRef, useEffect } from "react";
import {
  FaPlay,
  FaPause,
  FaHeart,
  FaComment,
  FaEye,
  FaShareAlt,
  FaDownload,
  FaLink,
  FaArrowLeft,
  FaChevronDown,
} from "react-icons/fa";
import supabase, {
  getVideoData,
  getVideoComments,
} from "../../../../Configs/supabaseClient";
import "./index.css";
import { FaRegEnvelope } from "react-icons/fa6";

const Gallery = () => {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showCommentMenu, setShowCommentMenu] = useState(false);
  const [videoData, setVideoData] = useState(null);
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [lastClickTime, setLastClickTime] = useState(0);
  const [liked, setLiked] = useState(false);
  const [liked3, setLiked3] = useState(false);
  const [repliesVisible, setRepliesVisible] = useState({});
  const [replyTo, setReplyTo] = useState(null);
  const [profile, setProfile] = useState(null);

  const videoRef = useRef();
  const shareMenuRef = useRef();
  const commentMenuRef = useRef();
  const progressBarRef = useRef();

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/userProfile/videos');
        if (!response.ok) {
          console.log("Error fetching videos:", response.statusText);
        }
        const data = await response.json();
        setVideos(data);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };
    fetchVideos();

    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from("perfil_jugadores")
        .select(
          `
                    id,
                    avatar_url,
                    usuarios (
                        nombre,
                        apellido
                    ),
                    localidades (
                        nombre,
                        provincias (
                            nombre,
                            naciones (nombre)
                        )
                    )
                `
        )
        .eq("usuario_id", 11)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
      } else {
        setProfile(data);
      }
    };
    fetchProfile();
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
      if (
        shareMenuRef.current &&
        !shareMenuRef.current.contains(event.target)
      ) {
        setShowShareMenu(false);
      }
      if (
        commentMenuRef.current &&
        !commentMenuRef.current.contains(event.target)
      ) {
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
        videoRef.current
          .play()
          .catch((e) => console.error("Error al reproducir:", e));
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
    videoRef.current.currentTime =
      newTime < videoRef.current.duration ? newTime : videoRef.current.duration;
  };

  const handleShareClick = (e) => {
    e.stopPropagation();
    setShowShareMenu(!showShareMenu);
  };

  const handleCommentClick = async (e) => {
    e.stopPropagation();
    setShowCommentMenu(!showCommentMenu);

    try {
      const { data, error } = await supabase
        .from("comentarios")
        .select("id,contenido,fechacomentario,usuarioid")
        .eq("videoid", selectedVideo.id);

      if (error) {
        throw error;
      }

      let prevComments = { user: null, text: null, replies: [] };
      for (let i = 0; i < data.length; i++) {
        const newComment = {
          user: data[i].id,
          text: data[i].contenido,
          replies: [],
        };
        if (newComment !== prevComments) {
          setComments((prevComments) => [...prevComments, newComment]);
        }
        if (newComment === prevComments) {
          setComments(null);
        }
      }
    } catch (error) {
      console.error("Error fetching comments:", error.message);
    }
  };

  const handleLikeClick = async () => {
    const updatedLikes = liked3 ? likes - 1 : likes + 1;

    const { data, error } = await supabase
      .from("videos")
      .update({ likes: updatedLikes })
      .eq("id", selectedVideo.id);

    setLikes(updatedLikes);
    setLiked3(!liked3);
  };

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
    const newTime =
      (e.nativeEvent.offsetX / progressBarRef.current.offsetWidth) * duration;
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

  const handlePostComment = () => {
    if (newComment.trim()) {
      if (replyTo !== null) {
        const updatedComments = [...comments];
        updatedComments[replyTo].replies.push({ user: 'Tú', text: newComment, timestamp: new Date(), likes: 0 });
        setComments(updatedComments);
        setReplyTo(null);
      } else {
        setComments([...comments, { user: 'Tú', text: newComment, replies: [], timestamp: new Date(), likes: 0 }]);
      }
      setNewComment("");
    }
  };

  const handleReplyClick = (index) => {
    const replyText = prompt("Escribí tu respuesta:");
    if (replyText && replyText.trim()) {
      const updatedComments = [...comments];
      updatedComments[index].replies.push({ user: "Tú", text: replyText });
      setComments(updatedComments);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = Math.floor((now - new Date(timestamp)) / 1000);
    if (diff < 60) return `${diff} s`;
    if (diff < 3600) return `${Math.floor(diff / 60)} min`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} h`;
    return `${Math.floor(diff / 86400)} d`;
  };

  const handleVideoClick = async (video) => {
    setSelectedVideo(video);
    const videoData = await getVideoData(video.id);
    setLikes(videoData.likes || 0);
  };

  const handleCloseVideo = () => {
    setSelectedVideo(null);
  };

  const handleCommentLike = (commentIndex, replyIndex) => {
    const updatedComments = [...comments];
    if (replyIndex !== undefined) {
      const reply = updatedComments[commentIndex].replies[replyIndex];
      reply.liked = !reply.liked;
      reply.likes += reply.liked ? 1 : -1;
    } else {
      const comment = updatedComments[commentIndex];
      comment.liked = !comment.liked;
      comment.likes += comment.liked ? 1 : -1;
    }
    setComments(updatedComments);
  };

  const toggleReplies = (index) => {
    setRepliesVisible((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div className="gallery">
      {videos.map((video, index) => (
        <React.Fragment key={video.id}>
          <div className="gallery-item" key={video.id}>
            <video
              src={video.url}
              className="gallery-img"
              onClick={() => handleVideoClick(video)}
              controls={false}
            ></video>
          </div>
          {(index + 1) % 3 === 0 && <div className="divider" />}
        </React.Fragment>
      ))}
      {selectedVideo && (
        <div className="fullscreen-video">
          <video
            src={selectedVideo.url}
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
          <button className="close-button" onClick={handleCloseVideo}>
            <FaArrowLeft size={24} />
          </button>
          <div className="info-player">
            <div className="wrapper-controls">
              <button className="button-pause" onClick={handlePlayPause}>
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
                <span className="taime">
                  {formatTime(duration - currentTime)}
                </span>
              </div>
            </div>
            <div className="info-user">
              {profile && (
                <>
                  <img
                    src={profile.avatar_url}
                    alt="Usuario"
                    className="img-user-profile"
                  />
                  <div className="details-user">
                    <p className="username">
                      {profile.usuarios.nombre} {profile.usuarios.apellido}
                    </p>
                    <p className="userlocation">
                      {profile.localidades.nombre},{" "}
                      {profile.localidades.provincias.nombre},{" "}
                      {profile.localidades.provincias.naciones.nombre}
                    </p>
                  </div>
                </>
              )}
              <button className="follow-button">Siguiendo</button>
            </div>
            <div className="estats">
              <div
                className="estat"
                onClick={handleLikeClick}
                style={{ cursor: "pointer" }}
              >
                <FaHeart className={`estat-icon ${liked3 ? "liked" : ""}`} />
                <span>{liked3 ? likes + 1 : likes}</span>
              </div>
              <div
                className="estat"
                onClick={handleCommentClick}
                style={{ cursor: "pointer" }}
              >
                <FaComment className="estat-icon" />
                <span>{comments.length}</span>
              </div>
              <div className="estat">
                <FaEye className="estat-icon" />
                <span>61.3K</span>
              </div>
              <div
                className="estat"
                onClick={handleShareClick}
                style={{ cursor: "pointer" }}
              >
                <FaShareAlt className="estat-icon" />
                <span>Compartir</span>
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
                <div className="icons-share">
                  <div className="container-share-icon">
                    <div className="share-icon">
                      <FaLink />
                    </div>
                    <span>Copiar enlace</span>
                  </div>
                  <div
                    className="container-share-icon"
                    onClick={handleDownload}
                  >
                    <div className="icon-share">
                      <FaDownload />
                    </div>
                    <span>Guardar</span>
                  </div>
                </div>
                <button
                  className="button-cancel"
                  onClick={handleCloseShareMenu}
                >
                  Cancelar
                </button>
              </div>
            )}
            {showCommentMenu && (
              <div
                className="menu-comment"
                ref={commentMenuRef}
                onClick={(e) => e.stopPropagation()}
              >
                <p className="title-comment">Comentarios</p>
                <div className="section-comment">
                  {comments.map((comment, index) => (
                    <div key={index} className="coment">
                      <div className="info-comment-user">
                        <img
                          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjDM0PhKJ_GdWFpZd6zUh3lENRBqkScnZ4Cg&s"
                          alt="User Profile"
                          className="img-comment-user-profile"
                        />
                        <div className="details-comment-user">
                          <p className="name-comment-user">{comment.user}</p>
                          <p className="timestamp-comment">
                            {formatTimestamp(comment.timestamp)}
                          </p>
                        </div>
                      </div>
                      <p className="text-comment">{comment.text}</p>
                      <div className="stats-comment">
                        <button
                          className="button-reply"
                          onClick={() => handleReplyClick(index)}
                        >
                          Responder
                        </button>
                        <div
                          className="icon-like-comment"
                          onClick={() => handleCommentLike(index)}
                        >
                          <FaHeart className={comment.liked3 ? "liked" : ""} />
                          <span>{comment.likes}</span>
                        </div>
                      </div>
                      {comment.replies && comment.replies.length > 0 && (
                        <>
                          <button
                            className="replies-button-view"
                            onClick={() => toggleReplies(index)}
                          >
                            {comment.showReplies
                              ? "Ocultar respuestas"
                              : `Ver ${comment.replies.length} respuestas`}{" "}
                            <FaChevronDown />
                          </button>
                          {comment.showReplies && (
                            <div className="replis">
                              {comment.replies.map((reply, replyIndex) => (
                                <div key={replyIndex} className="coment reply">
                                  <div className="info-comment-user">
                                    <img
                                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjDM0PhKJ_GdWFpZd6zUh3lENRBqkScnZ4Cg&s"
                                      alt="User Profile"
                                      className="img-comment-user-profile"
                                    />
                                    <div className="details-comment-user">
                                      <p className="name-comment-user">
                                        {reply.user}
                                      </p>
                                      <p className="timestamp-comment">
                                        {formatTimestamp(reply.timestamp)}
                                      </p>
                                    </div>
                                  </div>
                                  <p className="text-comment">{reply.text}</p>
                                  <div className="stats-comment">
                                    <button
                                      className="button-reply"
                                      onClick={() => handleReplyClick(index)}
                                    >
                                      Responder
                                    </button>
                                    <div
                                      className="icon-like-comment"
                                      onClick={() =>
                                        handleCommentLike(index, replyIndex)
                                      }
                                    >
                                      <FaHeart
                                        className={reply.liked3 ? "liked" : ""}
                                      />
                                      <span>{reply.likes}</span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  ))}
                </div>
                <div className="comment-wrapper-input">
                  <input
                    type="text"
                    className="input-comment"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder={
                      replyTo !== null
                        ? "Responde al comentario..."
                        : "Escribí tu respuesta"
                    }
                  />
                  <button
                    className="button-comment-send"
                    onClick={handlePostComment}
                  >
                    Enviar
                  </button>
                </div>
                <button
                  className="button-comment-send"
                  onClick={handleCloseCommentMenu}
                >
                  Cancelar
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
