import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './index.css';
import logo from './images/logo.png';
import emailIcon from './images/icons8-correo-48.png';
import lockIcon from './images/icons8-bloquear-50.png';
import eyeIcon from './images/icons8-visible-48.png';
import googleIcon from './images/icons8-logo-de-google-50.png';
import instagramIcon from './images/icons8-instagram-50.png';
import appleIcon from './images/icons8-mac-os-50.png';
import { Link } from 'react-router-dom';
import BackgroundAnimation from '../Login/Animation/Animation';
import userName from './images/icons8-usuario-50.png';
import { supabase } from "../../Configs/supabaseClient";
import { AuthContext } from '../../Context/auth-context';


const Register = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState('');
  const { setAuthError } = useContext(AuthContext);
  const navigate = useNavigate();


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const togglePasswordVisibility = (field) => {
    if (field === 'password') {
      setPasswordVisible(!passwordVisible);
    } else if (field === 'confirm-password') {
      setConfirmPasswordVisible(!confirmPasswordVisible);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setAuthError(null);


    if (!termsAccepted) {
      setError('Debes aceptar los términos y condiciones');
      return;
    }


    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }


    try {
      const response = await axios.post('http://localhost:5001/api/register', formData);
      localStorage.setItem('token', response.data.token);
      navigate('/');
    } catch (error) {
      setError(error.response?.data?.error || 'Error al registrar');
      setAuthError(error.response?.data?.error || 'Error al registrar');
    }
  };

  const handleGoogleLogin = async (e) => {
    e.preventDefault(); // Esto evita que el formulario se envíe
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin + "/home",
        },
      });
      if (error) throw error;
      // No se lanza ningún alert innecesario
    } catch (error) {
      console.error("Error durante el inicio de sesión con Google", error);
      setAuthError("Error al iniciar sesión con Google");
      // Mostrar mensaje de error solo si hay un problema real con Google
    }
  };


  return (
    <div className="register-container">
      <BackgroundAnimation />
      <img src={logo} alt="Logo" className="logoYY" />
      <h1>Crear cuenta</h1>
      <p className="register-text">
        <Link to="/">¿Ya tienes una cuenta? Inicia sesión aquí!</Link>
      </p>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="nombre">Nombre</label>
          <div className="input-wrapper">
            <img src={userName} alt="User Icon" className="input-icon" />
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Escribir tu nombre"
              required
            />
          </div>
        </div>
        <div className="input-group">
          <label htmlFor="apellido">Apellido</label>
          <div className="input-wrapper">
            <img src={userName} alt="User Icon" className="input-icon" />
            <input
              type="text"
              id="apellido"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              placeholder="Escribir tu apellido"
              required
            />
          </div>
        </div>
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <div className="input-wrapper">
            <img src={emailIcon} alt="Email Icon" className="input-icon" />
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Escribir tu correo electrónico"
              required
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
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Escribir tu contraseña"
              required
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
          <label htmlFor="confirmPassword">Confirmar Contraseña</label>
          <div className="input-wrapper">
            <img src={lockIcon} alt="Lock Icon" className="input-icon" />
            <input
              type={confirmPasswordVisible ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirmar tu contraseña"
              required
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
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={() => setTermsAccepted(!termsAccepted)}
            /> Acepto los términos y condiciones
          </label>
        </div>
        <button type="submit" className="btn-login">Registrarse</button>
        <p className="continue-text">O continúa con</p>
        <div className="social-login">
          <button
            type="button"
            className="btn-google"
            onClick={handleGoogleLogin}
          >
            <img src={googleIcon} alt="Google" className="google-icon" />
            Iniciar sesión con Google
          </button>
        </div>
      </form>
    </div>
  );
};


export default Register;
