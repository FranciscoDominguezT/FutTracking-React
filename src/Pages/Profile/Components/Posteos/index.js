import React, { useEffect, useState } from "react";
import { FaHeart, FaComment, FaPlus, FaTrash } from "react-icons/fa";
import NewTweetModal from "../NewTweetModal";
import PostDetail from "../PostDetail";
import NewCommentModal from "../NewCommentModal";
import "./index.css";

const Posteos = () => {
    const [posts, setPosts] = useState([]);
    const [likedPosts, setLikedPosts] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
    const [selectedPostId, setSelectedPostId] = useState(null);

    useEffect(() => {
        fetchPosts();
        loadLikedPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const response = await fetch('http://localhost:5001/api/posts');
            const data = await response.json();
            setPosts(data);
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    const loadLikedPosts = () => {
        const storedLikes = localStorage.getItem('likedPosts');
        if (storedLikes) {
            setLikedPosts(JSON.parse(storedLikes));
        }
    };

    const saveLikedPosts = (newLikedPosts) => {
        localStorage.setItem('likedPosts', JSON.stringify(newLikedPosts));
    };

    const handleLike = async (event, postId, currentLikes) => {
        event.stopPropagation();
        try {
            const isLiked = likedPosts[postId];
            const newLikeCount = isLiked ? currentLikes - 1 : currentLikes + 1;

            const response = await fetch(`http://localhost:5001/api/posts/${postId}/like`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ likes: newLikeCount })
            });
            const data = await response.json();

            setPosts(posts.map(post =>
                post.id === postId ? { ...post, likes: data.likes } : post
            ));

            const newLikedPosts = {
                ...likedPosts,
                [postId]: !isLiked
            };

            setLikedPosts(newLikedPosts);
            saveLikedPosts(newLikedPosts);
        } catch (error) {
            console.error("Error updating likes:", error);
        }
    };

    const handleDeleteTweet = async (event, postId) => {
        event.stopPropagation();
        if (window.confirm("¿Estás seguro de que quieres eliminar este tweet?")) {
            try {
                const response = await fetch(`http://localhost:5001/api/posts/${postId}`, {
                    method: 'DELETE'
                });
                
                if (response.ok) {
                    console.log('Tweet eliminado, actualizando el estado de los posts.');
                    console.log('Post ID a eliminar:', postId);
                    
                    setPosts(prevPosts => {
                        const updatedPosts = prevPosts.filter(post => post.id !== postId);
                        console.log('Posts actualizados:', updatedPosts);
                        return updatedPosts;
                    });
                    
                    setSelectedPost(null);

                } else {
                    const errorText = await response.text();
                    console.error('Error al eliminar el post. Respuesta:', errorText);
                    alert('Hubo un error al eliminar el tweet. Por favor, intenta de nuevo.');
                }
            } catch (error) {
                console.error("Error al eliminar el tweet:", error);
                console.error('Error al eliminar el post:', error.response.data);
                alert('Hubo un error al eliminar el tweet. Por favor, intenta de nuevo.');
            }
        }
    };
    
    
    const handleTweetCreated = (newTweet) => {
        // Añade el nuevo tweet al inicio de la lista
        setPosts(prevPosts => [newTweet, ...prevPosts]);
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
        setPosts(posts.map(post =>
            post.id === newComment.posteoid
                ? { ...post, count: (post.count || 0) + 1 }
                : post
        ));
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
            {posts.map((post, index) => (
                <div key={post.id} className="post" onClick={() => handlePostClick(post)} style={{ cursor: 'pointer' }}>
                    <div className="post-header">
                        <img
                            src={post.avatar_url || 'default-avatar.png'}
                            alt="Avatar del usuario"
                            className="user-avatar"
                        />
                        <div className="dxd">
                            <h3>{post.nombre || 'Unknown'} {post.apellido || 'User'}</h3>
                            <p>{new Date(post.fechapublicacion).toLocaleString()}</p>
                        </div>
                        <button
                            onClick={(event) => handleDeleteTweet(event, post.id)}
                            className="delete-button"
                        >
                            <FaTrash />
                        </button>
                    </div>
                    <p className="post-content">{post.contenido}</p>
                    <div className="post-footerA">
                        <button
                            onClick={(event) => handleLike(event, post.id, post.likes)}
                            className={`ytr-button ${likedPosts[post.id] ? 'liked' : ''}`}
                        >
                            <FaHeart className="ytr" /> {post.likes || 0}
                        </button>
                        <button
                            onClick={(event) => handleCommentClick(event, post.id)}
                            className="ytr-button"
                        >
                            <FaComment className="ytr" /> {post.count || 0}
                        </button>
                    </div>
                </div>
            ))}
            {selectedPost && (
                <PostDetail post={selectedPost} onClose={() => setSelectedPost(null)} />
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

export default Posteos;
