import React, { useState, useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './index.css';
import logo from './images/logo.png';
import { Link } from 'react-router-dom';
import BackgroundAnimation from '../../Animation/Animation';
import userName from './images/icons8-usuario-50.png';
import { AuthContext } from '../../../../Context/auth-context';

const Jugador = () => {
    const { state } = useLocation();
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        email: '',
        password: '',
        confirmPassword: '',
        edad: '',
        altura: '',
        peso: '',
        liga: '',
        equipo: '',
        posicion: '',
    });

    useEffect(() => {
        console.log(state.email);
        console.log(state.password);
    }, [state.email, state.password]);
    

    const [ligas, setLigas] = useState([]);
    const [equipos, setEquipos] = useState([]);
    const [posiciones, setPosiciones] = useState([]);
    
    const [error, setError] = useState('');
    const { setAuthError } = useContext(AuthContext);
    const navigate = useNavigate();

    // Cargar ligas, equipos y posiciones al montar el componente
    useEffect(() => {
        const fetchLigas = async () => {
            const response = await axios.get('http://localhost:5001/api/changeRoles/getLigas');
            setLigas(response.data);
        };
        
        const fetchEquipos = async () => {
            const response = await axios.get('http://localhost:5001/api/changeRoles/getEquipos');
            setEquipos(response.data);
        };
        
        const fetchPosiciones = async () => {
            const response = await axios.get('http://localhost:5001/api/changeRoles/getPosiciones');
            setPosiciones(response.data);
        };

        fetchLigas();
        fetchEquipos();
        fetchPosiciones();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setAuthError(null);

        try {
            const response = await axios.post('http://localhost:5001/api/changeRoles/changeToPlayer', {
                email: state.email,
                edad: formData.edad,
                altura: formData.altura,
                peso: formData.peso,
                liga: formData.liga,
                equipo: formData.equipo,
                posicion: formData.posicion
            });

            if (response.data.jugador) {
                console.log('Nuevo jugador:', response.data.jugador);
                setTimeout(() => {
                    console.log('Resultados del registro después de 20 segundos:', response.data.jugador);
                    navigate('/'); // Redirecciona al login
                }, 1000);
            }
        } catch (error) {
            setError(error.response?.data?.error || 'Error al cambiar a jugador');
        }
    };

    return (
        <div className="register-container">
            <BackgroundAnimation />
            <img src={logo} alt="Logo" className="logoYY" />
            <h1 className="change-rol">Cambiar a Jugador</h1>
            <p className="register-textA">
                ¿Deseas volver al login? <Link to="/">Haga click aquí!</Link>
            </p>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label htmlFor="edad">Edad</label>
                    <div className="input-wrapper">
                        <img src={userName} alt="User Icon" className="input-icon" />
                        <input
                            type="number"
                            id="edad"
                            name="edad"
                            value={formData.edad}
                            onChange={handleChange}
                            placeholder="Escribir tu edad"
                            required
                        />
                    </div>
                </div>
                <div className="input-group">
                    <label htmlFor="altura">Altura</label>
                    <div className="input-wrapper">
                        <img src={userName} alt="User Icon" className="input-icon" />
                        <input
                            type="number"
                            id="altura"
                            name="altura"
                            value={formData.altura}
                            onChange={handleChange}
                            placeholder="Escribir tu altura"
                            required
                        />
                    </div>
                </div>
                <div className="input-group">
                    <label htmlFor="peso">Peso</label>
                    <div className="input-wrapper">
                        <img src={userName} alt="User Icon" className="input-icon" />
                        <input
                            type="number"
                            id="peso"
                            name="peso"
                            value={formData.peso}
                            onChange={handleChange}
                            placeholder="Escribir tu peso"
                            required
                        />
                    </div>
                </div>
                <div className="input-group">
                    <label htmlFor="liga">Liga</label>
                    <div className="input-wrapper">
                        <select
                            id="liga"
                            name="liga"
                            value={formData.liga}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Seleccionar liga</option>
                            {ligas.map((liga) => (
                                <option key={liga.id} value={liga.id}>{liga.nombre}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="input-group">
                    <label htmlFor="equipo">Equipo</label>
                    <div className="input-wrapper">
                        <select
                            id="equipo"
                            name="equipo"
                            value={formData.equipo}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Seleccionar equipo</option>
                            {equipos.map((equipo) => (
                                <option key={equipo.id} value={equipo.id}>{equipo.nombre}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="input-group">
                    <label htmlFor="posicion">Posición</label>
                    <div className="input-wrapper">
                        <select
                            id="posicion"
                            name="posicion"
                            value={formData.posicion}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Seleccionar posición</option>
                            {posiciones.map((posicion) => (
                                <option key={posicion.id} value={posicion.id}>{posicion.nombre}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <button type="submit" className="btn-login">Confirmar</button>
            </form>
        </div>
    );
};

export default Jugador;
