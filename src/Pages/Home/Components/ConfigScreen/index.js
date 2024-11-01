import React, { useContext } from "react";
import { useNavigate } from "react-router-dom"; // Importa useNavigate
import { FaChevronRight, FaPowerOff, FaCog, FaArrowLeft } from "react-icons/fa";
import "./index.css";
import { AuthContext } from "../../../../Context/auth-context";


const ConfigScreen = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate(); // Hook para la navegación


  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = '/';
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };


  // Función para redirigir a la pantalla de inicio
  const handleBackToHome = () => {
    navigate('/home'); // Redirige a la pantalla de inicio (cambia '/home' si es necesario)
  };


  return (
    <div className="config-container">
      {/* Botón de volver atrás */}
      <button className="back-button" onClick={handleBackToHome}>
        <FaArrowLeft />
      </button>


      {/* Encabezado */}
      <header className="config-header">
        <FaCog className="config-icon" />
        <h1 className="config-title">Configuración</h1>
      </header>


      {/* Información del Usuario */}
      <div className="user-info-containerTT">
        <div className="user-infoTT">
          <img
            src="https://via.placeholder.com/48"
            alt="user-avatar"
            className="user-avatarTT"
          />
          <span className="user-nameTT">Nicolás Fernandez</span>
        </div>
      </div>


      {/* Opciones de Configuración */}
      <div className="config-body">
        <h3 className="config-section-title">Configuración de la cuenta</h3>
        <ul className="config-options">
          <li>
            <span>Editar perfil</span>
            <FaChevronRight />
          </li>
          <li>
            <span>Cambiar contraseña</span>
            <FaChevronRight />
          </li>
          <li className="option-toggle">
            <span>Estado de actividad</span>
            <label className="switch">
              <input type="checkbox" defaultChecked />
              <span className="slider round"></span>
            </label>
          </li>
          <li className="option-toggle">            
            <span>Silenciar notificaciones</span>
            <label className="switch">
              <input type="checkbox" />
              <span className="slider round"></span>
            </label>
          </li>
          <li>
            <span>Sobre nosotros</span>
            <FaChevronRight />
          </li>
          <li>
            <span>Políticas de privacidad</span>
            <FaChevronRight />
          </li>
          <li>
            <span>Términos y condiciones</span>
            <FaChevronRight />
          </li>
        </ul>
      </div>


      {/* Botón de Cerrar Sesión */}
      <footer className="config-footer">
        <button className="logout-button" onClick={handleLogout}>
          <FaPowerOff className="power-icon" /> Cerrar Sesión
        </button>
      </footer>
    </div>
  );
};


export default ConfigScreen;
