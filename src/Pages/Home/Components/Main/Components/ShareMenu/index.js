import React from 'react';
import { FaRegEnvelope, FaLink, FaDownload } from "react-icons/fa";

const ShareMenu = ({ onClose, videoUrl }) => {
  const handleDownload = () => {
    if (videoUrl) {
      const link = document.createElement("a");
      link.href = videoUrl;
      link.setAttribute("download", "video.mp4");
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(videoUrl)
      .then(() => alert('Enlace copiado al portapapeles'))
      .catch(err => console.error('Error al copiar el enlace: ', err));
  };

  return (
    <div className="share-menu" onClick={(e) => e.stopPropagation()}>
      <p className="share-title">Compartir video</p>
      <div className="share-subtitle-container">
        <FaRegEnvelope className="envelope" />
        <p className="share-subtitle">Enviar vía Mensaje Directo</p>
      </div>
      <div className="share-icons">
        <div className="share-icon-container">
          <img
            src="https://cdn-icons-png.freepik.com/256/3983/3983877.png?semt=ais_hybrid"
            alt="WhatsApp"
            className="share-img"
          />
          <span>WhatsApp</span>
        </div>
        <div className="share-icon-container">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Telegram_logo.svg/2048px-Telegram_logo.svg.png"
            alt="Telegram"
            className="share-img"
          />
          <span>Telegram</span>
        </div>
        <div className="share-icon-container">
          <img
            src="https://cdn1.iconfinder.com/data/icons/logotypes/32/circle-linkedin-512.png"
            alt="LinkedIn"
            className="share-img"
          />
          <span>LinkedIn</span>
        </div>
        <div className="share-icon-container">
          <img
            src="https://static-00.iconduck.com/assets.00/gmail-icon-1024x1024-09wrt8am.png"
            alt="Gmail"
            className="share-img"
          />
          <span>Gmail</span>
        </div>
      </div>
      <div className="share-icons">
        <div className="share-icon-container" onClick={handleCopyLink}>
          <div className="share-icon">
            <FaLink />
          </div>
          <span>Copiar enlace</span>
        </div>
        <div className="share-icon-container" onClick={handleDownload}>
          <div className="share-icon">
            <FaDownload />
          </div>
          <span>Guardar</span>
        </div>
      </div>
      <button className="cancel-button" onClick={onClose}>
        Cancelar
      </button>
    </div>
  );
};

export default ShareMenu;