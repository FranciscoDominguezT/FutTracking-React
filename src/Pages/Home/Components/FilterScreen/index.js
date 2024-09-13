import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PlayerCard from '../PlayerCard';
import Footer from '../Footer';
import './index.css';

const FilterScreen = () => {
  const [players, setPlayers] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [filters, setFilters] = useState({
    height: [140, 220],
    weight: [50, 150],
    age: [15, 45],
    nationality: '',
    position: '',
    liga: '',
    club: '',
  });

  useEffect(() => {
    fetchPlayers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, players]);

  const fetchPlayers = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/filter/players');
      setPlayers(response.data);
      setFilteredPlayers(response.data);
    } catch (error) {
      console.error('Error fetching players:', error);
    }
  };
  

  const applyFilters = () => {
    const filtered = players.filter(player => 
      player.altura >= filters.height[0] && player.altura <= filters.height[1] &&
      player.peso >= filters.weight[0] && player.peso <= filters.weight[1] &&
      player.edad >= filters.age[0] && player.edad <= filters.age[1] &&
      (filters.nationality === '' || player.nacion_nombre === filters.nationality) &&
      (filters.position === '' || player.posicion === filters.position) &&
      (filters.liga === '' || player.liga === filters.liga) &&
      (filters.club === '' || player.equipo_nombre === filters.club)
    );
    setFilteredPlayers(filtered);
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterName]: value
    }));
  };

  const resetFilters = () => {
    setFilters({
      height: [140, 220],
      weight: [50, 150],
      age: [15, 45],
      nationality: '',
      position: '',
      liga: '',
      club: '',
    });
  };

  return (
    <div className="filter-screen">
      <h1>Pantalla Filtrado</h1>
      <div className="filter-container">
        <div className="filter-sidebar">
          <h2>Filtros</h2>
          
          {/* Altura */}
          <div className="filter-group">
            <label>Altura</label>
            <input 
              type="range" 
              min="140" 
              max="220" 
              value={filters.height[0]} 
              onChange={(e) => handleFilterChange('height', [e.target.valueAsNumber, filters.height[1]])}
            />
            <div className="filter-values">
              <span>{filters.height[0]}cm</span>
              <span>{filters.height[1]}cm</span>
            </div>
          </div>

          {/* Peso */}
          <div className="filter-group">
            <label>Peso</label>
            <input 
              type="range" 
              min="50" 
              max="150" 
              value={filters.weight[0]} 
              onChange={(e) => handleFilterChange('weight', [e.target.valueAsNumber, filters.weight[1]])}
            />
            <div className="filter-values">
              <span>{filters.weight[0]}kg</span>
              <span>{filters.weight[1]}kg</span>
            </div>
          </div>

          {/* Edad */}
          <div className="filter-group">
            <label>Edad</label>
            <input 
              type="range" 
              min="15" 
              max="45" 
              value={filters.age[0]} 
              onChange={(e) => handleFilterChange('age', [e.target.valueAsNumber, filters.age[1]])}
            />
            <div className="filter-values">
              <span>{filters.age[0]} años</span>
              <span>{filters.age[1]} años</span>
            </div>
          </div>

          {/* Nacionalidad */}
          <div className="filter-group">
            <label>Nacionalidad</label>
            <select 
              value={filters.nationality}
              onChange={(e) => handleFilterChange('nationality', e.target.value)}
            >
              <option value="">Nacionalidad</option>
              {/* Add nationality options here */}
            </select>
          </div>

          {/* Posición */}
          <div className="filter-group">
            <label>Posición</label>
            <select 
              value={filters.position}
              onChange={(e) => handleFilterChange('position', e.target.value)}
            >
              <option value="">Posición</option>
              {/* Add position options here */}
            </select>
          </div>

          {/* Liga */}
          <div className="filter-group">
            <label>Liga</label>
            <select 
              value={filters.liga}
              onChange={(e) => handleFilterChange('liga', e.target.value)}
            >
              <option value="">Liga</option>
              {/* Add league options here */}
            </select>
          </div>

          {/* Club */}
          <div className="filter-group">
            <label>Club</label>
            <select 
              value={filters.club}
              onChange={(e) => handleFilterChange('club', e.target.value)}
            >
              <option value="">Club</option>
              {/* Add club options here */}
            </select>
          </div>

          <div className="filter-buttons">
            <button onClick={resetFilters}>Borrar</button>
            <button onClick={applyFilters}>Aplicar</button>
          </div>
        </div>

        <div className="players-container">
          <div className="players-grid">
            {filteredPlayers.map(player => (
              <PlayerCard key={player.id} player={player} />
            ))}
          </div>
        </div>
      </div>
      <footer className="footer">
            <Footer />
          </footer>
    </div>
    
  );
};

export default FilterScreen;