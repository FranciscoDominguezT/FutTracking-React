import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { FaPencilAlt } from "react-icons/fa";
import { AuthContext } from "../../../../Context/auth-context";

const MisDatosReclutador = () => {
    const [userData, setUserData] = useState(null);
    const [editing, setEditing] = useState(false);
    const [editData, setEditData] = useState({
        nacion_id: '',
        provincia_id: '',
        email: ''
    });
    const [naciones, setNaciones] = useState([]);
    const [provincias, setProvincias] = useState([]);

    useEffect(() => {
        fetchUserData();
        fetchNaciones();
    }, []);

    useEffect(() => {
        if (editData.nacion_id) {
            fetchProvincias(editData.nacion_id);
        }
    }, [editData.nacion_id]);

    const fetchUserData = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5001/api/user/userdata', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setUserData(response.data);
            setEditData({
                nacion_id: response.data.nacion_id || '',
                provincia_id: response.data.provincia_id || '',
                email: response.data.email || ''
            });
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const fetchNaciones = async () => {
        try {
            const response = await axios.get('http://localhost:5001/api/user/naciones');
            setNaciones(response.data);
        } catch (error) {
            console.error('Error fetching naciones:', error);
        }
    };

    const fetchProvincias = async (nacionId) => {
        try {
            const response = await axios.get(`http://localhost:5001/api/user/provincias/${nacionId}`);
            setProvincias(response.data);
        } catch (error) {
            console.error('Error fetching provincias:', error);
        }
    };

    const handleEdit = () => {
        setEditing(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.put('http://localhost:5001/api/user/userdata', editData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            alert('Datos actualizados correctamente');
        } catch (error) {
            console.error('Error updating user data:', error);
        }
    };

    if (!userData) {
        return <div>Loading...</div>;
    }

    return (
        <div className={`mis-datos-container ${editing ? 'editing' : ''}`}>
            <h2>Mis Datos <FaPencilAlt onClick={handleEdit} className="edit-icon" /></h2>
            {!editing ? (
                <div className="datos-list">
                    <p><strong>Nacionalidad:</strong> {naciones.find(n => n.id === userData.nacion_id)?.nombre || 'No especificada'}</p>
                    <p><strong>Correo electrónico:</strong> {userData.email}</p>
                    <p><strong>Residencia:</strong> {provincias.find(p => p.id === userData.provincia_id)?.nombre || 'No especificada'}</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="edit-form">
                    <div>
                        <label>Nacionalidad:</label>
                        <select 
                            name="nacion_id" 
                            value={editData.nacion_id} 
                            onChange={handleChange}
                        >
                            <option value="">No especificada</option>
                            {naciones.map(nacion => (
                                <option key={nacion.id} value={nacion.id}>{nacion.nombre}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label>Correo electrónico:</label>
                        <input 
                            type="email" 
                            name="email" 
                            value={editData.email} 
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label>Residencia:</label>
                        <select 
                            name="provincia_id" 
                            value={editData.provincia_id} 
                            onChange={handleChange}
                        >
                            <option value="">No especificada</option>
                            {provincias.map(provincia => (
                                <option key={provincia.id} value={provincia.id}>{provincia.nombre}</option>
                            ))}
                        </select>
                    </div>
                    <button type="submit">Guardar</button>
                </form>
            )}
        </div>
    );
};

export default MisDatosReclutador;
