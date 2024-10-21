import React from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';
import logo from './images/logo.png';
import { Link } from 'react-router-dom';
import BackgroundAnimation from '../Login/Animation/Animation';

const ChangeRol = () => {
    const navigate = useNavigate();

    const handlePlayerClick = () => {
        navigate('/mailJugador'); // Redirige a la ruta /jugador
    };

    const handleRecruiterClick = () => {
        navigate('/mailReclutador'); // Redirige a la ruta /reclutador
    };

    return (
        <div className="register-container">
            <BackgroundAnimation />
            <img src={logo} alt="Logo" className="logoYY" />
            <h1 className="change-rol">Cambio de Rol</h1>
            <p className="register-textA">
                ¿Deseas volver al login? <Link to="/">Haga click aquí!</Link>
            </p>
            <button type="button" className="btn-change" onClick={handlePlayerClick}>
                Cambiar a Jugador
            </button>
            <button type="button" className="btn-change" onClick={handleRecruiterClick}>
                Cambiar a Reclutador
            </button>
        </div>
    );
};

export default ChangeRol;
