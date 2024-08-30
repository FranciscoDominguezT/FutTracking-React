import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaHeart, FaComment, FaArrowLeft, FaTrash } from 'react-icons/fa';
import NewCommentModal from '../NewCommentModal'; // Nuevo componente que crearemos
import './index.css';

const PostDetail = ({ post, onClose, onDelete, onLike, likedPosts, fetchPosts }) => {
    const [comments, setComments] = useState([]);
    const [localPost, setLocalPost] = useState(post);
    const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
    const [selectedParentId, setSelectedParentId] = useState(null);
    const [likedComments, setLikedComments] = useState({});

    useEffect(() => {
        fetchComments();
    }, [post.id]);

    const fetchComments = async () => {
        try {
            const response = await axios.get(`http://localhost:5001/api/posts/${post.id}/comments`);
            setComments(response.data);
        } catch (error) {
            console.error("Error fetching comments:", error);
        }
    };

    const handleLocalLike = (event) => {
        onLike(event, localPost.id, localPost.likes);
        setLocalPost(prevPost => ({
            ...prevPost,
            likes: likedPosts[prevPost.id] ? prevPost.likes - 1 : prevPost.likes + 1
        }));
    };

    const handleLocalDelete = async (event) => {
        await onDelete(event, localPost.id);
        onClose();
        fetchPosts();
    };

    const handleCommentCreated = (newComment) => {
        setComments([...comments, newComment]);
    };

    const handleDeleteComment = async (commentId) => {
        if (window.confirm("Are you sure you want to delete this comment?")) {
            try {
                await axios.delete(`http://localhost:5001/api/posts/${localPost.id}/comments/${commentId}`);
                setComments(comments.filter(comment => comment.id !== commentId));
            } catch (error) {
                console.error("Error deleting comment:", error);
            }
        }
    };

    const convertToLocalTime = (utcDateString) => {
        const date = new Date(utcDateString);
        return date.toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' });
    };

    useEffect(() => {
        const storedLikes = localStorage.getItem('likedComments');
        if (storedLikes) {
            setLikedComments(JSON.parse(storedLikes));
        }
    }, []);

    const handleCommentLike = async (commentId, currentLikes) => {
        try {
            const isLiked = likedComments[commentId];
            const newLikeCount = isLiked ? currentLikes - 1 : currentLikes + 1;

            const response = await axios.put(`http://localhost:5001/api/comments/${commentId}/like`, { likes: newLikeCount });
            setComments(comments.map(comment =>
                comment.id === commentId ? { ...comment, likes: response.data.likes } : comment
            ));

            const newLikedComments = {
                ...likedComments,
                [commentId]: !isLiked
            };
            setLikedComments(newLikedComments);
            localStorage.setItem('likedComments', JSON.stringify(newLikedComments));
        } catch (error) {
            console.error("Error updating comment likes:", error);
        }
    };

    const renderComments = (parentId = null, depth = 0) => {
        return comments
            .filter(comment => comment.parentid === parentId)
            .map(comment => (
                <div key={comment.id} className="comment" style={{ marginLeft: `${depth * 20}px` }}>
                    <div className="comment-header">
                        <img
                            src={comment.avatar_url || 'default-avatar.png'}
                            alt="Avatar del usuario"
                            className="user-avatar"
                        />
                        <div className="comment-info">
                            <h4>{comment.nombre || 'Unknown'} {comment.apellido || 'User'}</h4>
                            <p>{convertToLocalTime(comment.fechapublicacion)}</p>
                        </div>
                    </div>
                    <p className="comment-content">{comment.contenido}</p>
                    <div className="comment-footer">
                        <button
                            onClick={() => handleCommentLike(comment.id, comment.likes)}
                            className={`comment-likes ${likedComments[comment.id] ? 'liked' : ''}`}
                        >
                            <FaHeart /> {comment.likes || 0}
                        </button>
                        <button onClick={() => {
                            setSelectedParentId(comment.id);
                            setIsCommentModalOpen(true);
                        }} className="reply-button">
                            <FaComment /> {(comment.respuestas && comment.respuestas.length) || 0}
                        </button>
                        <button onClick={() => handleDeleteComment(comment.id)} className="delete-button">
                            <FaTrash />
                        </button>
                    </div>
                    {renderComments(comment.id, depth + 1)}
                </div>
            ));
    };

    return (
        <div className="post-detail-overlay">
            <div className="post-detail-content">
                <div className="post-detail-header">
                    <button onClick={onClose} className="back-button">
                        <FaArrowLeft />
                    </button>
                    <h2 className="post-detail-title">Post</h2>
                </div>
                <div className="original-post">
                    <div className="post-header">
                        <img
                            src={localPost.avatar_url || 'default-avatar.png'}
                            alt="Avatar del usuario"
                            className="user-avatar"
                        />
                        <div className="post-info">
                            <h3>{localPost.nombre || 'Unknown'} {localPost.apellido || 'User'}</h3>
                            <p>{convertToLocalTime(localPost.fechapublicacion)}</p>
                        </div>
                        <button
                            onClick={handleLocalDelete}
                            className="delete-button"
                        >
                            <FaTrash />
                        </button>
                    </div>
                    <p className="post-content">{localPost.contenido}</p>
                    <div className="post-footer">
                        <button
                            onClick={handleLocalLike}
                            className={`action-button ${likedPosts[localPost.id] ? 'liked' : ''}`}
                        >
                            <FaHeart /> {localPost.likes || 0}
                        </button>
                        <button
                            onClick={() => setIsCommentModalOpen(true)}
                            className="action-button"
                        >
                            <FaComment /> {comments.length}
                        </button>
                    </div>
                </div>
                <div className="comments-section">
                    <h3>Comments</h3>
                    {renderComments()}
                </div>
            </div>
            <NewCommentModal
                isOpen={isCommentModalOpen}
                onClose={() => {
                    setIsCommentModalOpen(false);
                    setSelectedParentId(null);
                }}
                onCommentCreated={handleCommentCreated}
                postId={localPost.id}
                parentId={selectedParentId}
            />
        </div>
    );
};

export default PostDetail;
