import React, { useState } from 'react';
import './index.css';

const NewTweetModal = ({ isOpen, onClose, onTweetCreated }) => {
  const [content, setContent] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
        const response = await fetch('http://localhost:5001/api/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                usuarioid: 11, // Asumiendo que el ID del usuario actual es 11
                contenido: content,
                videourl: null, // Si hay algún video asociado, puedes pasar su URL aquí
            }),
        });

        const newPost = await response.json();

        if (response.ok) {
            // Añadimos los datos de usuario y contador de comentarios
            const responseUser = await fetch('http://localhost:5001/api/users/11');
            const userData = await responseUser.json();

            const newTweetWithUserData = {
                ...newPost,
                nombre: userData.nombre,
                apellido: userData.apellido,
                avatar_url: userData.avatar_url,
                count: 0, // Inicialmente 0 comentarios
            };

            onTweetCreated(newTweetWithUserData);
            setContent('');
            onClose();
        } else {
            console.error('Error creating tweet:', newPost);
        }
    } catch (error) {
        console.error('Error creating tweet:', error);
    }
};

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>New Tweet</h2>
        <form onSubmit={handleSubmit}>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's happening?"
            maxLength={280}
          />
          <div className="modal-actions">
            <button type="button" onClick={onClose}>Cancel</button>
            <button type="submit">Tweet</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewTweetModal;
