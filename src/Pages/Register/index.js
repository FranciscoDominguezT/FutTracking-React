import React, { useState } from 'react';
import './index.css';
import logo from './images/logo.png'; // Asegúrate de ajustar la ruta según tu proyecto
import emailIcon from './images/icons8-correo-48.png';
import lockIcon from './images/icons8-bloquear-50.png';
import eyeIcon from './images/icons8-visible-48.png';
import googleIcon from './images/icons8-logo-de-google-50.png';
import instagramIcon from './images/icons8-instagram-50.png';
import appleIcon from './images/icons8-mac-os-50.png';
import { Link } from 'react-router-dom';
import Login from '../Login/index';
import BackgroundAnimation from '../Login/Animation/Animation';

const Register = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const togglePasswordVisibility = (field) => {
    if (field === 'password') {
      setPasswordVisible(!passwordVisible);
    } else if (field === 'confirm-password') {
      setConfirmPasswordVisible(!confirmPasswordVisible);
    }
  };

  return (
    <div className="login-container">
      <BackgroundAnimation /> {/* Añadir la animación aquí */}
      <img src={logo} alt="Logo" className="logoYY" />
      <h1>Crear cuenta</h1>
      <p className="register-text">
      <Link to="/">¿Ya tienes una cuenta? Inicia sesión aquí!</Link>
      </p>
      <form>
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <div className="input-wrapper">
            <img src={emailIcon} alt="Email Icon" className="input-icon" />
            <input type="email" id="email" placeholder="Escribir tu correo electrónico" />
          </div>
        </div>
        <div className="input-group">
          <label htmlFor="password">Contraseña</label>
          <div className="input-wrapper">
            <img src={lockIcon} alt="Lock Icon" className="input-icon" />
            <input
              type={passwordVisible ? "text" : "password"}
              id="password"
              placeholder="Escribir tu contraseña"
            />
            <img
              src={eyeIcon}
              alt="Eye Icon"
              className="input-icon-right"
              onClick={() => togglePasswordVisibility('password')}
            />
          </div>
        </div>
        <div className="input-group">
          <label htmlFor="confirm-password">Confirmar Contraseña</label>
          <div className="input-wrapper">
            <img src={lockIcon} alt="Lock Icon" className="input-icon" />
            <input
              type={confirmPasswordVisible ? "text" : "password"}
              id="confirm-password"
              placeholder="Confirmar tu contraseña"
            />
            <img
              src={eyeIcon}
              alt="Eye Icon"
              className="input-icon-right"
              onClick={() => togglePasswordVisibility('confirm-password')}
            />
          </div>
        </div>
        <div className="options">
          <label>
            <input type="checkbox" /> Acepto los términos y condiciones
          </label>
        </div>
        <button type="submit" className="btn-login">Registrarse</button>
        <p className="continue-text">O continúa con</p>
        <div className="social-login">
          <a href="#"><img src={googleIcon} alt="Google" /></a>
          <a href="#"><img src={instagramIcon} alt="Instagram" /></a>
          <a href="#"><img src={appleIcon} alt="Apple" /></a>
        </div>
      </form>
    </div>
  );
};

export default Register;
