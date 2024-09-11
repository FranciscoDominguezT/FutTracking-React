import React, { useState, useEffect } from 'react';
import supabase from '../../../../Configs/supabaseClient';
import './index.css';

const NewCommentModal = ({ isOpen, onClose, onCommentCreated, postId, parentId = null }) => {
  const [content, setContent] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Fetch the current user data
    const fetchCurrentUser = async () => {
      try {
        const { data, error } = await supabase
          .from('usuarios')
          .select(`
            id,
            nombre,
            apellido,
            perfil_jugadores (
              avatar_url
            )
          `)
          .eq('id', 11) // Assuming the current user ID is 11
          .single();
          
        if (error) throw error;
        setCurrentUser(data);
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };

    fetchCurrentUser();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      const { data, error } = await supabase
        .from('respuestas_posteos')
        .insert([
          {
            posteoid: postId,
            usuarioid: currentUser.id, // Use the current user ID
            contenido: content,
            fechapublicacion: new Date().toISOString(),
            likes: 0,
            parentid: parentId
          }
        ])
        .select();

      if (error) throw error;

      const newCommentWithUserData = {
        ...data[0],
        usuarios: currentUser
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
