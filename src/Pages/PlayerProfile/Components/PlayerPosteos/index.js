import React, { useEffect, useState } from "react";
import { FaHeart, FaComment } from "react-icons/fa";
import PlayerPostDetail from "../PlayerPostDetail";
import NewCommentModal from "../NewCommentModal";
import axios from "axios";

const PlayerPosteos = ({ userId }) => {
  const [posts, setPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState({});
  const [selectedPost, setSelectedPost] = useState(null);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);

  useEffect(() => {
    fetchPosts();
    loadLikedPosts();
  }, [userId]);

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`http://localhost:5001/api/posts/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPosts(response.data);
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
  
      const response = await axios.put(
        `http://localhost:5001/api/posts/${postId}/like`, 
        {}, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      const data = response.data;
  
      setPosts(
        posts.map((post) =>
          post.post_id === postId ? { ...post, likes: data.likes } : post
        )
      );
  
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
      <div className="posts-scroll-container">
        {posts.length === 0 ? (
          <p className="no-posts-message">Este usuario aún no tiene posteos.</p>
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
        <PlayerPostDetail
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
          onLike={handleLike}
          likedPosts={likedPosts}
          fetchPosts={fetchPosts}
          isOwnProfile={false}
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
    </div>
  );
};

export default PlayerPosteos;