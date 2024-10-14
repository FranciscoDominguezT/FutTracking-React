import React from 'react';
import './index.css';
import { FaHome, FaComments, FaCamera, FaEnvelope, FaUser } from "react-icons/fa";
import home from './images/icons8-casa-24.png'
import comments from './images/icons8-burbuja-de-diálogo-con-puntos-30.png'
import camera from './images/icons8-camera-24.png'
import envelope from './images/icons8-nuevo-post-24.png'
import user from './images/icons8-persona-de-sexo-masculino-24.png'
import { Link } from 'react-router-dom';


const Footer = () => {
    return (
        <div className="footer-icons">
                <div className="footer-icon">
                    <Link to="/home"><img src={home} alt="Logo" className="footer-icon-icon"/></Link>
                    <span className='spa'>Inicio</span>
                </div>
                <div className="footer-icon">
                    <img src={comments} alt="Logo" className="footer-icon-icon"/>
                    <span className='spa'>Mensajes</span>
                </div>
                <div className="footer-icon">
                    <img src={camera} alt="Logo" className="footer-icon-icon"/>
                    <span className='spa'>Cámara</span>
                </div>
                <div className="footer-icon">
                    <img src={envelope} alt="Logo" className="footer-icon-icon"/>
                    <span className='spa'>Community</span>
                </div>
                <div className="footer-icon">
                    <Link to="/profile"><img src={user} alt="Logo" className="footer-icon-icon"/></Link>
                    <span className='spa'>Perfil</span>
                </div>
            </div>
    );
};

export default Footer;