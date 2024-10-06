import React, { useContext } from "react";
import { Link } from 'react-router-dom';
import "./index.css";
import { AuthContext } from "../../../../Context/auth-context";

const ConfigScreen = () => {

    const { logout } = useContext(AuthContext);

    const handleLogout = async () => {
        try {
          await logout(); // Llamamos a la función logout del contexto
          // Opcionalmente, puedes redirigir al usuario a la pantalla de login
          window.location.href = '/';
        } catch (error) {
          console.error("Error al cerrar sesión:", error);
        }
      };

    return (
        <div className="logout-container">
          <Link to="/">
            <button className="logout-button" onClick={handleLogout}>
              Cerrar sesión
            </button>
          </Link>
        </div>
    );
  };
  
  export default ConfigScreen;