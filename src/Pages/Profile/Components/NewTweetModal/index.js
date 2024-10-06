import React, { useState, useContext } from 'react';
import { AuthContext } from '../../../../Context/auth-context';
import './index.css';

const NewTweetModal = ({ isOpen, onClose, onTweetCreated }) => {
  const [content, setContent] = useState('');
  const { user, token } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
  
    try {
      const response = await fetch('http://localhost:5001/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          contenido: content,
          videourl: '' // Añade esto si es necesario
        })
      });
  
      if (!response.ok) {
        throw new Error('Error creating tweet');
      }
  
      const newTweet = await response.json();
  
      const newTweetWithUserData = {
        ...newTweet,
        nombre: user.nombre,
        apellido: user.apellido,
        avatar_url: user.avatar_url
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