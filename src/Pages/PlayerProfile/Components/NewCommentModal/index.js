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
  
      onCommentCreated(newComment);
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
        <h2>{parentId ? "Nueva Respuesta" : "Nuevo Comentario"}</h2>
        <form onSubmit={handleSubmit}>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={parentId ? "Escribe tu respuesta..." : "Escribe tu comentario..."}
            maxLength={280}
          />
          <div className="modal-actions">
            <button type="button" onClick={onClose}>Cancelar</button>
            <button type="submit">{parentId ? "Responder" : "Comentar"}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewCommentModal;