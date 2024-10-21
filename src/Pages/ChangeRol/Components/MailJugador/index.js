import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Importamos axios para hacer la solicitud al backend
import logo from './images/logo.png';
import lockIcon from './images/icons8-bloquear-50.png';
import eyeIcon from './images/icons8-visible-48.png';
import { Link } from 'react-router-dom';
import BackgroundAnimation from './Animation/Animation';
import correoIcon from "./images/icons8-correo-48.png";
import googleIcon from './images/icons8-logo-de-google-50.png';

const MailJugador = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleConfirm = async () => {
    try {
      const response = await axios.post('http://localhost:5001/api/changeRoles/verify-aficionado', {
        email,
        contraseña: password
      });

      // Si el usuario tiene rol de "Aficionado", redirige a /jugador
      if (response.data.rol === 'Aficionado') {
        navigate('/jugador', { state: { email, password } }); // Pasamos email y contraseña como state
      }
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data.error); // Mostrar error desde el backend
      } else {
        setErrorMessage('Error de conexión con el servidor');
      }
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="register-container">
      <BackgroundAnimation />
      <img src={logo} alt="Logo" className="logoYY" />
      <h1 className="change-rol">Jugador</h1>
      <p className="register-textA">
        ¿Deseas volver al login? <Link to="/">Haga click aquí!</Link>
      </p>
      {errorMessage && <div className="error-message">{errorMessage}</div>} {/* Mensaje de error */}
      <div className="input-group">
        <label htmlFor="email">Email</label>
        <div className="input-wrapper">
          <img src={correoIcon} alt="Email Icon" className="input-icon" />
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Escribir tu correo electrónico"
            autoComplete="off"
          />
        </div>
      </div>
      <div className="input-group">
        <label htmlFor="password">Contraseña</label>
        <div className="input-wrapper">
          <img src={lockIcon} alt="Lock Icon" className="input-icon" />
          <input
            type={passwordVisible ? "text" : "password"}
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Escribir tu contraseña"
          />
          <img
            src={eyeIcon}
            alt="Eye Icon"
            className="input-icon-right"
            onClick={togglePasswordVisibility}
          />
        </div>
      </div>
      <button type="button" className="btn-change" onClick={handleConfirm}>
        Confirmar
      </button>
    </div>
  );
};

export default MailJugador;
