import React, { useState, useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './index.css';
import logo from './images/logo.png';
import { Link } from 'react-router-dom';
import BackgroundAnimation from '../../Animation/Animation';
import userName from './images/icons8-usuario-50.png';
import { AuthContext } from '../../../../Context/auth-context';

const Reclutador = () => {
    const { state } = useLocation();
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        email: '',
        password: '',
        confirmPassword: '',
        nacion: '',
        provincia: '',
    });

    useEffect(() => {
        console.log(state.email);
        console.log(state.password);
    }, [state.email, state.password]);
    

    const [naciones , setNaciones] = useState([]);
    const [provincias, setProvincias] = useState([]);
    
    const [error, setError] = useState('');
    const { setAuthError } = useContext(AuthContext);
    const navigate = useNavigate();

    // Cargar ligas, equipos y posiciones al montar el componente
    useEffect(() => {
        const fetchNaciones = async () => {
            const response = await axios.get('http://localhost:5001/api/changeRoles/getNaciones');
            setNaciones(response.data);
        };
    
        fetchNaciones();
    }, []);
    
    useEffect(() => {
        const fetchProvincias = async (nacionId) => {
            try {
                const response = await axios.get(`http://localhost:5001/api/changeRoles/getProvincias/${nacionId}`);
                setProvincias(response.data);
            } catch (error) {
                console.error('Error al obtener provincias:', error);
            }
        };
    
        if (formData.nacion) {
            fetchProvincias(formData.nacion);
        }
    }, [formData.nacion]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setAuthError(null);

        try {
            const response = await axios.post('http://localhost:5001/api/changeRoles/changeToRecruiter', {
                email: state.email,
                nacion: formData.nacion,
                provincia: formData.provincia
            });

            if (response.data.jugador) {
                console.log('Nuevo reclutador:', response.data.jugador);
                setTimeout(() => {
                    console.log('Resultados del registro después de 20 segundos:', response.data.jugador);
                    navigate('/'); // Redirecciona al login
                }, 1000);
            }
        } catch (error) {
            setError(error.response?.data?.error || 'Error al cambiar a reclutador');
        }
    };

    return (
        <div className="register-container">
            <BackgroundAnimation />
            <img src={logo} alt="Logo" className="logoYY" />
            <h1 className="change-rol">Cambiar a Jugador</h1>
            <p className="register-textA">
                ¿Deseas volver al login? <Link to="/">Haga click aquí!</Link>
            </p>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label htmlFor="nacion">Nacionalidad</label>
                    <div className="input-wrapper">
                        <select
                            id="nacion"
                            name="nacion"
                            value={formData.nacion}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Seleccionar nacionalidad</option>
                            {naciones.map((nacion) => (
                                <option key={nacion.id} value={nacion.id}>{nacion.nombre}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="input-group">
                    <label htmlFor="provincia">Provincia</label>
                    <div className="input-wrapper">
                        <select
                            id="provincia"
                            name="provincia"
                            value={formData.provincia}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Seleccionar provincia</option>
                            {provincias.map((provincia) => (
                                <option key={provincia.id} value={provincia.id}>{provincia.nombre}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <button type="submit" className="btn-login">Confirmar</button>
            </form>
        </div>
    );
};

export default Reclutador;
