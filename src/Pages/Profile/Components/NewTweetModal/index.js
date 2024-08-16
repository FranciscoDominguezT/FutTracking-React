import React, { useState } from 'react';
import supabase from '../../../../Configs/supabaseClient';
import './index.css';

const NewTweetModal = ({ isOpen, onClose, onTweetCreated }) => {
  const [content, setContent] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      const { data, error } = await supabase
        .from('posteos')
        .insert([
          { 
            usuarioid: 11, // Asumiendo que el ID del usuario actual es 11
            contenido: content,
            fechapublicacion: new Date().toISOString(),
            likes: 0
          }
        ])
        .select();

      if (error) throw error;
      
      // Fetch the user data for the new tweet
      const { data: userData, error: userError } = await supabase
        .from('usuarios')
        .select(`
          id,
          nombre,
          apellido,
          perfil_jugadores (
            avatar_url
          )
        `)
        .eq('id', 11)
        .single();

      if (userError) throw userError;

      const newTweetWithUserData = {
        ...data[0],
        usuarios: userData,
        respuestas_posteos: [{ count: 0 }]
      };

      onTweetCreated(newTweetWithUserData);
      setContent('');
      onClose();
    } catch (error) {
      console.error("Error creating tweet:", error);
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