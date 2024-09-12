import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./index.css";
import logo from "./images/logo.png";
import correoIcon from "./images/icons8-correo-48.png";
import lockIcon from "./images/icons8-bloquear-50.png";
import eyeIcon from "./images/icons8-visible-48.png";
import googleIcon from "./images/icons8-logo-de-google-50.png";
import instagramIcon from "./images/icons8-instagram-50.png";
import linkedinIcon from "./images/icons8-linkedin-50.png";
import BackgroundAnimation from "./Animation/Animation"; // Importar la animación
import { supabase } from "../../Configs/supabaseClient";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Por favor, ingrese todos los campos");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5001/api/login/login",
        { email, password }
      );

      localStorage.setItem("token", response.data.token);
      navigate("/home");
    } catch (error) {
      setError("Credenciales inválidas. Intente nuevamente.");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/home'
        }
      });
      if (error) throw error;
      
      // Obtener la información del usuario después del inicio de sesión
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Guardar la información del usuario en el localStorage
        localStorage.setItem('googleUser', JSON.stringify({
          name: user.user_metadata.full_name,
          email: user.email,
          avatar_url: user.user_metadata.avatar_url
        }));
        
        // Llamar a tu API para crear o actualizar el usuario en tu base de datos
        const response = await axios.post('http://localhost:5001/api/login/google-login', {
          name: user.user_metadata.full_name,
          email: user.email,
          picture: user.user_metadata.avatar_url
        });
        
        // Guardar el token JWT en el localStorage
        localStorage.setItem('token', response.data.token);
        
        navigate('/home');
      }
      
      return { data };
    } catch (error) {
      console.error('Error during Google sign-in', error);
      return { error };
    }
  };

  return (
    <div className="login-container">
      <BackgroundAnimation /> {/* Añadir la animación aquí */}
      <img src={logo} alt="Logo" className="logoYY" />
      <h1>Iniciar sesión</h1>
      <p className="register-text">
        Si no tienes una cuenta, <a href="/register">regístrate aquí!</a>
      </p>
      {error && <p className="error-text">{error}</p>}
      <form onSubmit={handleLogin}>
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
        <div className="options">
          <label>
            <input type="checkbox" /> Recuérdame
          </label>
          <a href="#">Olvidé mi contraseña</a>
        </div>
        <button type="submit" className="btn-login">
          Ingresar
        </button>
        <p className="continue-text">O continúa con</p>
        <div className="social-login">
          <a href="#" onClick={handleGoogleLogin}>
            <img src={googleIcon} alt="Google" />
          </a>
          <a href="#">
            <img src={instagramIcon} alt="Instagram" />
          </a>
          <a href="#">
            <img src={linkedinIcon} alt="Apple" />
          </a>
        </div>
      </form>
    </div>
  );
};

export default Login;
