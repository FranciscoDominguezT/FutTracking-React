import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PlayerCard from '../PlayerCard';
import Footer from '../Footer';
import Header from '../Header'; 
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
  
  // Nuevos estados para las opciones
  const [nationalities, setNationalities] = useState([]);
  const [positions, setPositions] = useState([]);
  const [leagues, setLeagues] = useState([]);
  const [clubs, setClubs] = useState([]);

  useEffect(() => {
    fetchPlayers();
    fetchNationalities();
    fetchPositions();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, players]);

  useEffect(() => {
    if (filters.liga) {
      fetchClubs(filters.liga);
    }
  }, [filters.liga]);

  const fetchPlayers = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/filter/players');
      setPlayers(response.data);
      setFilteredPlayers(response.data);
    } catch (error) {
      console.error('Error fetching players:', error);
    }
  };

  const fetchNationalities = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/filter/nationalities'); // Suponiendo que tengas este endpoint
      setNationalities(response.data);
    } catch (error) {
      console.error('Error fetching nationalities:', error);
    }
  };

  const fetchPositions = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/filter/positions'); // Suponiendo que tengas este endpoint
      setPositions(response.data);
    } catch (error) {
      console.error('Error fetching positions:', error);
    }
  };

  const fetchLeagues = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/filter/leagues'); // Suponiendo que tengas este endpoint
      setLeagues(response.data);
    } catch (error) {
      console.error('Error fetching leagues:', error);
    }
  };

  const fetchClubs = async (ligaId) => {
    try {
      const response = await axios.get(`http://localhost:5001/api/filter/clubs?ligaId=${ligaId}`); // Endpoint modificado para filtrar clubes
      setClubs(response.data);
    } catch (error) {
      console.error('Error fetching clubs:', error);
    }
  };

  const applyFilters = () => {
    const filtered = players.filter(player =>
      player.altura >= filters.height[0] && player.altura <= filters.height[1] &&
      player.peso >= filters.weight[0] && player.peso <= filters.weight[1] &&
      player.edad >= filters.age[0] && player.edad <= filters.age[1] &&
      (filters.nationality === '' || player.nacion_nombre === filters.nationality) &&
      (filters.position === '' || player.posicion_nombre === filters.position) && // Cambia a posicion_nombre
      (filters.liga === '' || player.liga_nombre === filters.liga) &&
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
    <div>
      <Header />
      <div className="filter-screen">
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
                onChange={(e) => {
                  handleFilterChange('nationality', e.target.value);
                  fetchLeagues(); // Cargar ligas cuando se seleccione nacionalidad
                }}
              >
                <option value="">Nacionalidad</option>
                {nationalities.map(nat => (
                  <option key={nat.id} value={nat.nombre}>{nat.nombre}</option>
                ))}
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
                {positions.map(pos => (
                  <option key={pos.id} value={pos.nombre}>{pos.nombre}</option>
                ))}
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
                {leagues.map(lig => (
                  <option key={lig.id} value={lig.nombre}>{lig.nombre}</option>
                ))}
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
                {clubs.map(club => (
                  <option key={club.id} value={club.nombre}>{club.nombre}</option>
                ))}
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
    </div>
  );
};

export default FilterScreen;
