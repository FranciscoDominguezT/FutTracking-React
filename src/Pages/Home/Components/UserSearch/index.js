import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './index.css';

const UserSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const loadAllUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5001/api/search/search');
      localStorage.setItem('searchResults', JSON.stringify(response.data));
      navigate('/search');
    } catch (error) {
      console.error('Error loading users:', error);
    }
    setLoading(false);
  };

  const searchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5001/api/search/search', {
        params: { term: searchTerm }
      });
      console.log('Search results:', response.data);
      localStorage.setItem('searchResults', JSON.stringify(response.data));
      navigate('/search', { state: { searchTerm } });
    } catch (error) {
      console.error('Error searching users:', error);
    }
    setLoading(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim() !== '') {
      searchUsers();
    }
  };

  const handleFocus = () => {
    if (searchTerm.trim() === '') {
      loadAllUsers();
    }
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    if (e.target.value.trim() !== '') {
      searchUsers();
    }
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={handleFocus}
          placeholder="Buscar..."
          className="search-bar"
        />
        <button type="submit" className="search-button" disabled={loading}>
          <FaSearch className="search-icon" />
        </button>
      </form>
    </div>
  );
};

export default UserSearch;