import React, { useEffect, useState } from "react";
import { FaHeart, FaComment, FaPlus, FaTrash } from "react-icons/fa";
import NewTweetModal from "../NewTweetModal";
import PostDetail from "../PostDetail";
import NewCommentModal from "../NewCommentModal";
import axios from "axios";
import "./index.css";

const Posteos = () => {
  const [posts, setPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);

  useEffect(() => {
    fetchPosts();
    loadLikedPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5001/api/posts", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      console.log("Posts cargados:", data);
      setPosts(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const loadLikedPosts = () => {
    const storedLikes = localStorage.getItem("likedPosts");
    if (storedLikes) {
      setLikedPosts(JSON.parse(storedLikes));
    }
  };

  const saveLikedPosts = (newLikedPosts) => {
    localStorage.setItem("likedPosts", JSON.stringify(newLikedPosts));
  };

  const handleLike = async (event, postId) => {
    event.stopPropagation();
    try {
      const isLiked = likedPosts[postId];
      const token = localStorage.getItem('token');
  
      // Realizar la solicitud con axios
      const response = await axios.put(
        `http://localhost:5001/api/posts/${postId}/like`, 
        {}, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      // Obtener los datos directamente de response.data
      const data = response.data;
  
      // Actualizar los likes del post específico
      setPosts(
        posts.map((post) =>
          post.post_id === postId ? { ...post, likes: data.likes } : post
        )
      );
  
      // Actualizar el estado de likedPosts
      const newLikedPosts = {
        ...likedPosts,
        [postId]: !isLiked,
      };
  
      setLikedPosts(newLikedPosts);
      saveLikedPosts(newLikedPosts);
    } catch (error) {
      console.error("Error updating likes:", error);
    }
  };  

  const handleDeleteTweet = async (postId) => {
    if (!postId || typeof postId !== "number") {
      console.error("Error: postId no está definido o es inválido.", postId);
      return;
    }

    try {
      const response = await fetch(`http://localhost:5001/api/posts/${postId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setPosts((prevPosts) =>
          prevPosts.filter((post) => post.post_id !== postId)
        );
        setSelectedPost(null);
        setIsConfirmModalOpen(false); // Cerrar el modal después de eliminar
      } else {
        const errorText = await response.text();
        console.error("Error al eliminar el post. Respuesta:", errorText);
      }
    } catch (error) {
      console.error("Error al eliminar el tweet:", error);
    }
  };

  const openConfirmModal = (event, postId) => {
    event.stopPropagation();
    console.log("Abriendo modal para el post:", postId);
    setPostToDelete(postId);
    setIsConfirmModalOpen(true);
  };

  const handleTweetCreated = (newTweet) => {
    setPosts((prevPosts) => [{ ...newTweet, post_id: newTweet.id }, ...prevPosts]);
  };

  const handlePostClick = (post) => {
    setSelectedPost(post);
  };

  const handleCommentClick = (event, postId) => {
    event.stopPropagation();
    setSelectedPostId(postId);
    setIsCommentModalOpen(true);
  };

  const handleCommentCreated = (newComment) => {
    setPosts(
      posts.map((post) =>
        post.post_id === newComment.posteoid
          ? { ...post, count: (post.count || 0) + 1 }
          : post
      )
    );
  };

  return (
    <div className="posteos-container">
      <button className="new-tweet-button" onClick={() => setIsModalOpen(true)}>
        <FaPlus />
      </button>
      <NewTweetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onTweetCreated={handleTweetCreated}
      />

      <div className="posts-scroll-container">
        {posts.length === 0 ? (
          <p className="no-posts-message">No hay posteos cargados aún.</p> // Mensaje cuando no hay posteos
        ) : (
          posts.map((post) => (
            <div
              key={post.post_id}
              className="post"
              onClick={() => handlePostClick(post)}
              style={{ cursor: "pointer" }}
            >
              <div className="post-header">
                <img
                  src={post.avatar_url || "default-avatar.png"}
                  alt="Avatar del usuario"
                  className="user-avatar"
                />
                <div className="dxd">
                  <h3>{post.nombre || "Unknown"} {post.apellido || "User"}</h3>
                  <p>{new Date(post.fechapublicacion).toLocaleString()}</p>
                </div>
                <button
                  onClick={(event) => openConfirmModal(event, post.post_id)}
                  className="delete-button"
                >
                  <FaTrash />
                </button>
              </div>
              <p className="post-content">{post.contenido}</p>
              <div className="post-footerA">
                <button
                  onClick={(event) => handleLike(event, post.post_id)}
                  className={`ytr-button ${likedPosts[post.post_id] ? "liked" : ""}`}
                >
                  <FaHeart className="ytr" /> {post.likes || 0}
                </button>
                <button
                  onClick={(event) => handleCommentClick(event, post.post_id)}
                  className="ytr-button"
                >
                  <FaComment className="ytr" /> {parseInt(post.count, 10) || 0}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {selectedPost && (
        <PostDetail
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
          onDelete={handleDeleteTweet}
          onLike={handleLike}
          likedPosts={likedPosts}
          fetchPosts={fetchPosts}
        />
      )}

      {isCommentModalOpen && selectedPostId && (
        <NewCommentModal
          isOpen={isCommentModalOpen}
          onClose={() => setIsCommentModalOpen(false)}
          postId={selectedPostId}
          onCommentCreated={handleCommentCreated}
        />
      )}

      {isConfirmModalOpen && (
        <div className="confirm-modal open">
          <div className="confirm-modal-content">
            <h3>¿Estás seguro de que deseas eliminar este post?</h3>
            <div className="confirm-modal-buttons">
              <button
                onClick={() => setIsConfirmModalOpen(false)}
                className="cancel-button"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDeleteTweet(postToDelete)}
                className="delete-confirm-button"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Posteos;
