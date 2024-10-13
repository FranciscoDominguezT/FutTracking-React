import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { FaHeart, FaPlay, FaTrash } from "react-icons/fa";
import { AuthContext } from '../../../../../../Context/auth-context';

const API_BASE_URL = 'http://localhost:5001/api';

const CommentSection = ({ comments, selectedVideo, onClose, onCommentSubmit }) => {
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [likedComments, setLikedComments] = useState({});
  const [visibleReplies, setVisibleReplies] = useState({});
  const { user, token, isLoading } = useContext(AuthContext);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    console.log('Estado del usuario autenticado:', user);
  }, [user]);

  useEffect(() => {
    console.log('Usuario actual:', user);
    console.log('Comentarios:', comments);
  }, [user, comments]);

  useEffect(() => {
    const storedLikes = JSON.parse(localStorage.getItem('likedComments')) || {};
    setLikedComments(storedLikes);
  }, []);

  useEffect(() => {
    localStorage.setItem('likedComments', JSON.stringify(likedComments));
  }, [likedComments]);

  const handleCommentLike = async (commentId) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/comments/${commentId}/like`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const updatedLikes = response.data.likes;
  
      onCommentSubmit(comments.map(c =>
        c.id === commentId ? { ...c, likes: updatedLikes } : c
      ));
  
      setLikedComments(prevLikedComments => ({
        ...prevLikedComments,
        [commentId]: !prevLikedComments[commentId]
      }));
    } catch (error) {
      console.error("Error updating comment likes:", error);
    }
  };
  const handleDeleteComment = async (commentId) => {
    console.log(`Intentando borrar comentario:`, commentId);
    try {
      const response = await axios.delete(`${API_BASE_URL}/comments/${commentId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('Respuesta del servidor:', response.data);
      onCommentSubmit(comments.filter(comment => comment.id !== commentId));
    } catch (error) {
      console.error("Error al eliminar el comentario:", error.response?.data || error.message);
    }
  };
  const handleSubmitComment = async () => {
    console.log('handleSubmitComment iniciado');
    console.log('Estado de usuario:', user);
    console.log('Token actual:', token);
    
    if (isLoading) {
      console.log('Esperando a que se cargue la información del usuario...');
      return;
    }

    if (!newComment.trim()) {
      console.error('No se puede enviar un comentario vacío');
      return;
    }

    if (!user) {
      console.error('Usuario no autenticado');
      // Aquí podrías redirigir al usuario a la página de login o mostrar un mensaje
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('Intentando enviar comentario...');
      console.log('Headers de la solicitud:', { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      });
      console.log('Cuerpo de la solicitud:', {
        contenido: newComment,
        parent_id: replyTo || null
      });
  
      const response = await axios.post(`${API_BASE_URL}/comments/${selectedVideo.usuarioid}/comments`, {
        contenido: newComment,
        parent_id: replyTo || null
      }, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      console.log('Respuesta del servidor:', response.data);
  
      onCommentSubmit([...comments, response.data]);
      setNewComment('');
      setReplyTo(null);
    } catch (error) {
      console.error('Error al publicar comentario:', error.response?.data || error.message);
      if (error.response && error.response.status === 401) {
        console.error('Usuario no autenticado');
        // Puedes mostrar un mensaje al usuario o redirigir a la página de login
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderComments = (parentId = null) => {
    const sortedComments = [...comments].sort((a, b) => new Date(b.fechacomentario) - new Date(a.fechacomentario));

    return sortedComments
      .filter(comment => comment.parent_id === parentId)
      .map(comment => {
        const hasReplies = sortedComments.some(reply => reply.parent_id === comment.id);
        const replies = sortedComments.filter(reply => reply.parent_id === comment.id);
        const areRepliesVisible = visibleReplies[comment.id];

        const userId = user?.id;

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
              {user  && userId === comment.usuarioid && (
                <div className="comment-delete-icon" onClick={() => handleDeleteComment(comment.id)}>
                  <FaTrash />
                </div>
              )}
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
                          {reply.usuarioid === userId && (
                            <div className="comment-delete-icon" onClick={() => handleDeleteComment(reply.id)}>
                              <FaTrash />
                            </div>
                          )}
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

  return (
    <div className="comment-menu" onClick={(e) => e.stopPropagation()}>
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
          disabled={isLoading || isSubmitting}
        />
          <button 
          className="comment-send-button" 
          onClick={handleSubmitComment}
          disabled={isLoading || isSubmitting || !newComment.trim()}
        >
          {isSubmitting ? 'Enviando...' : 'Enviar'}
        </button>
      </div>
      <button className="cancel-button" onClick={onClose}>
        Cancelar
      </button>
    </div>
  );
};

export default CommentSection;