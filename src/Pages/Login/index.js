import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./index.css";
import logo from "./images/logo.png";
import correoIcon from "./images/icons8-correo-48.png";
import lockIcon from "./images/icons8-bloquear-50.png";
import eyeIcon from "./images/icons8-visible-48.png";
import googleIcon from "./images/icons8-logo-de-google-50.png";
import BackgroundAnimation from "./Animation/Animation"; // Importar la animación
import { supabase } from "../../Configs/supabaseClient";
import { AuthContext } from "../../Context/auth-context";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const { setUser, setToken, setAuthError, fetchUserData } = useContext(AuthContext);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const showAlert = (message) => {
    setAlertMessage(message);
    setTimeout(() => {
      setAlertMessage("");
    }, 3000); // La alerta desaparecerá después de 3 segundos
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError(null);
  
    if (!email || !password) {
      setAuthError("Por favor, ingrese todos los campos");
      showAlert("Por favor, ingrese todos los campos");
      return;
    }
  
    try {
      const response = await axios.post(
        "http://localhost:5001/api/login/login",
        { email, password }
      );
  
      const { token, user } = response.data;
      localStorage.setItem("token", token);
      setToken(token);
      setUser(user);
      await fetchUserData(token);
      navigate("/home");
    } catch (error) {
      setAuthError("Credenciales inválidas. Intente nuevamente.");
      showAlert("Credenciales inválidas. Intente nuevamente.");
    }
  };


  const handleGoogleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin + "/home",
        },
      });
      if (error) throw error;
      // No necesitamos hacer nada más aquí, ya que el AuthContext manejará la respuesta de Google
    } catch (error) {
      console.error("Error durante el inicio de sesión con Google", error);
      setAuthError("Error al iniciar sesión con Google");
    }
  };

  return (
    <div className="login-container">
      {alertMessage && <div className="custom-alert">{alertMessage}</div>}
      <BackgroundAnimation /> {/* Añadir la animación aquí */}
      <img src={logo} alt="Logo" className="logoYY" />
      <h1>Iniciar sesión</h1>
      <p className="register-text">
        Si no tienes una cuenta, <a href="/register">regístrate aquí!</a>
      </p>
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

export default Login;
