import React, { useState, useContext } from 'react';
import { AuthContext } from '../../../../Context/auth-context';
import './index.css';

const NewCommentModal = ({ isOpen, onClose, onCommentCreated, postId, parentId = null }) => {
  const [content, setContent] = useState('');
  const { user, token } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      const response = await fetch(`http://localhost:5001/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          contenido: content,
          parentid: parentId
        })
      });

      if (!response.ok) {
        throw new Error('Error creating comment');
      }

      const newComment = await response.json();

      const newCommentWithUserData = {
        ...newComment,
        nombre: user.nombre,
        apellido: user.apellido,
        avatar_url: user.avatar_url
      };

      onCommentCreated(newCommentWithUserData);
      setContent('');
      onClose();
    } catch (error) {
      console.error("Error creating comment:", error);
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