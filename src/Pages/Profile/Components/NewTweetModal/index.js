import React, { useState } from 'react';
import './index.css';

const NewTweetModal = ({ isOpen, onClose, onTweetCreated }) => {
  const [content, setContent] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
  
    try {
      const token = localStorage.getItem('token');
      
      // Obtener los datos del usuario ANTES de crear el tweet
      const userResponse = await fetch('http://localhost:5001/api/user/userdata', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      if (!userResponse.ok) {
        throw new Error('Error fetching user data');
      }
  
      const userData = await userResponse.json();
  
      // Crear el nuevo post
      const response = await fetch('http://localhost:5001/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          contenido: content,
          usuario_id: userData.usuario_id,  // Asigna el usuario logueado al post
          nombre: userData.nombre,
          apellido: userData.apellido,
          avatar_url: userData.avatar_url
        })
      });
  
      if (!response.ok) {
        throw new Error('Error creating tweet');
      }
  
      const newTweet = await response.json();
  
      // Añadir los datos del usuario al nuevo tweet antes de enviarlo al frontend
      const newTweetWithUserData = {
        ...newTweet,
        nombre: userData.nombre,
        apellido: userData.apellido,
        avatar_url: userData.avatar_url
      };
  
      onTweetCreated(newTweetWithUserData);
      setContent('');
      onClose();
    } catch (error) {
      console.error('Error creating tweet:', error);
    }
  };
  

  if (!isOpen) return null;

  return (
    <div className="modal-overlayt">
      <div className="modal-contentt">
        <h2>New Tweet</h2>
        <form onSubmit={handleSubmit}>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's happening?"
            maxLength={280}
          />
          <div className="modal-actionst">
            <button type="button" onClick={onClose}>Cancel</button>
            <button type="submit">Tweet</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewTweetModal;