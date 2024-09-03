import React, { useState, useContext } from 'react';
import axios from 'axios';
import './index.css';

const NewCommentModal = ({ isOpen, onClose, onCommentCreated, postId, parentId = null }) => {
  const [content, setContent] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      console.log('Posting comment with postId:', postId);
      const response = await axios.post(`http://localhost:5001/api/posts/${postId}/comments`, {
        usuarioid: 11, // TODO: Reemplazar con ID dinámico del usuario autenticado
        contenido: content,
        parentid: parentId,
      });

      const newComment = response.data;

      // Fetch user data for the new comment
      const responseUser = await axios.get('http://localhost:5001/api/users/11');
      const userData = responseUser.data;
      console.log('User Data:', userData);

      const newCommentWithUserData = {
        ...newComment,
        nombre: userData.nombre,
        apellido: userData.apellido,
        avatar_url: userData.perfil_jugadores ? userData.perfil_jugadores.avatar_url : '', // Protege contra undefined
      };

      onCommentCreated(newCommentWithUserData);
      setContent('');
      onClose();
    } catch (error) {
      console.error('Error creating comment:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>New Comment</h2>
        <form onSubmit={handleSubmit}>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's your comment?"
            maxLength={280}
          />
          <div className="modal-actions">
            <button type="button" onClick={onClose}>Cancel</button>
            <button type="submit">Comment</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewCommentModal;
