import React, { useState } from 'react';
import './index.css';

const NewCommentModal = ({ isOpen, onClose, onCommentCreated, postId, parentId = null }) => {
  const [content, setContent] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      const response = await fetch(`http://localhost:5001/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usuarioid: 11, // Asumiendo que el ID del usuario actual es 11
          contenido: content,
          parentid: parentId,
        }),
      });

      const newComment = await response.json();

      if (response.ok) {
        // Fetch user data for the new comment
        const responseUser = await fetch('http://localhost:5001/api/users/11');
        const userData = await responseUser.json();

        const newCommentWithUserData = {
          ...newComment,
          nombre: userData.nombre,
          apellido: userData.apellido,
          avatar_url: userData.perfil_jugadores.avatar_url,
        };

        onCommentCreated(newCommentWithUserData);
        setContent('');
        onClose();
      } else {
        console.error('Error creating comment:', newComment);
      }
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
