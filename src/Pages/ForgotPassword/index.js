import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./index.css";
import logo from "./images/logo.png";
import lockIcon from "./images/icons8-bloquear-50.png";
import eyeIcon from "./images/icons8-visible-48.png";
import { Link } from "react-router-dom";
import BackgroundAnimation from "../Login/Animation/Animation";
import { AuthContext } from "../../Context/auth-context";

const ForgotPassword = () => {
  const [formData, setFormData] = useState({
    email: "",
    currentPassword: "", // Contraseña actual
    newPassword: "", // Nueva contraseña
    confirmPassword: "", // Confirmar nueva contraseña
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [error, setError] = useState("");
  const { setAuthError } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = (field) => {
    if (field === "currentPassword") {
      setPasswordVisible(!passwordVisible);
    } else if (field === "confirmPassword") {
      setConfirmPasswordVisible(!confirmPasswordVisible);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar que las contraseñas coincidan
    if (formData.newPassword !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5001/api/forgotPassword/forgot-password",
        {
          email: formData.email,
          currentPassword: formData.currentPassword, // Contraseña actual
          newPassword: formData.newPassword, // Nueva contraseña
        }
      );

      if (response.status === 200) {
        alert("Contraseña actualizada exitosamente");
        navigate("/"); // Redirigir al login
      }
    } catch (error) {
      console.error("Error al cambiar la contraseña:", error);
      setError(error.response?.data?.error || "Error al cambiar la contraseña");
    }
  };

  return (
    <div className="register-container">
      <BackgroundAnimation />
      <img src={logo} alt="Logo" className="logoYY" />
      <h1 className="change-rol">Cambiar Contraseña</h1>
      <p className="register-textA">
        ¿Deseas volver al login? <Link to="/">Haga click aquí!</Link>
      </p>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <div className="input-wrapper">
            <img src={lockIcon} alt="Lock Icon" className="input-icon" />
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Escribir tu email"
              required
            />
          </div>
        </div>

        <div className="input-group">
          <label htmlFor="currentPassword">Contraseña Actual</label>
          <div className="input-wrapper">
            <img src={lockIcon} alt="Lock Icon" className="input-icon" />
            <input
              type={passwordVisible ? "text" : "password"}
              id="currentPassword"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              placeholder="Escribir tu contraseña actual"
              required
            />
            <img
              src={eyeIcon}
              alt="Eye Icon"
              className="input-icon-right"
              onClick={() => togglePasswordVisibility("currentPassword")}
            />
          </div>
        </div>

        <div className="input-group">
          <label htmlFor="newPassword">Nueva Contraseña</label>
          <div className="input-wrapper">
            <img src={lockIcon} alt="Lock Icon" className="input-icon" />
            <input
              type={passwordVisible ? "text" : "password"}
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="Escribir tu nueva contraseña"
              required
            />
            <img
              src={eyeIcon}
              alt="Eye Icon"
              className="input-icon-right"
              onClick={() => togglePasswordVisibility("newPassword")}
            />
          </div>
        </div>

        <div className="input-group">
          <label htmlFor="confirmPassword">Confirmar Nueva Contraseña</label>
          <div className="input-wrapper">
            <img src={lockIcon} alt="Lock Icon" className="input-icon" />
            <input
              type={confirmPasswordVisible ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirmar tu nueva contraseña"
              required
            />
            <img
              src={eyeIcon}
              alt="Eye Icon"
              className="input-icon-right"
              onClick={() => togglePasswordVisibility("confirmPassword")}
            />
          </div>
        </div>

        {error && <p className="error-message">{error}</p>}

        <button type="submit" className="btn-login">
          Cambiar Contraseña
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
