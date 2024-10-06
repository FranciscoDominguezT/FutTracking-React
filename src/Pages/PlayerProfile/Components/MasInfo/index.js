
import React, { useState } from "react";
import { FaCheckCircle, FaCrown, FaUserFriends, FaEnvelope, FaEye, FaTimes } from "react-icons/fa";
import "./index.css";


const MasInfo = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);


  const handleSubscribeClick = () => {
    setIsModalOpen(true);
  };


  const handleCloseModal = () => {
    setIsModalOpen(false);
  };


  return (
    <div className="contact-container">
      <p className="contact-message">
        Para ver mas información de este jugador, necesitas una suscripción premium.
      </p>
      <button className="subscribe-button" onClick={handleSubscribeClick}>
        Adquirir Suscripción
      </button>


      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content advanced-modal">
            <div className="modal-header">
              <h2 className="modal-title">Suscripción Premium</h2>
              <button className="close-modal-icon" onClick={handleCloseModal}>
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              <p className="premium-intro">Disfruta de los siguientes beneficios:</p>
              <ul className="benefits-list advanced-benefits-list">
                <li>
                  <FaCrown className="benefit-icon" />
                  <span>Contacta a cualquier jugador</span>
                </li>
                <li>
                  <FaUserFriends className="benefit-icon" />
                  <span>Accede a eventos exclusivos</span>
                </li>
                <li>
                  <FaEnvelope className="benefit-icon" />
                  <span>Mensajes ilimitados con jugadores</span>
                </li>
                <li>
                  <FaEye className="benefit-icon" />
                  <span>Visualiza perfiles completos</span>
                </li>
                <li>
                  <FaCheckCircle className="benefit-icon" />
                  <span>Actualizaciones y notificaciones exclusivas</span>
                </li>
              </ul>
            </div>
            <button className="confirm-subscribe-button">Suscribirme Ahora</button>
          </div>
        </div>
      )}
    </div>
  );
};


export default MasInfo;
