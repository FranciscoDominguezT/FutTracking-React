import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import SearchCard from '../SearchCard';
import UserSearch from '../UserSearch';
import Header from '../Header';
import Footer from '../Footer';
import axios from 'axios';

const SearchResultsPage = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const location = useLocation();
  const searchTerm = location.state?.searchTerm || '';

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const results = localStorage.getItem('searchResults');
      if (results) {
        const parsedResults = JSON.parse(results);
        setUsers(parsedResults);
      } else {
        const response = await axios.get('http://localhost:5001/api/search/search', {
          params: { term: searchTerm, page }
        });
        setUsers((prevUsers) => [...prevUsers, ...response.data]);
        setHasMore(response.data.length > 0);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
    setLoading(false);
  }, [page, searchTerm]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop !==
        document.documentElement.offsetHeight ||
      loading || !hasMore
    ) {
      return;
    }
    setPage((prevPage) => prevPage + 1);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore]);

  return (
    <div>
      <Header />
      {users.length > 0 ? (
        <SearchCard users={users} />
      ) : (
        <p className="no-videos-message">No se encontraron resultados</p>
      )}

      {loading && <p>Cargando más resultados...</p>}

      <Footer />
    </div>
  );
};

export default SearchResultsPage;