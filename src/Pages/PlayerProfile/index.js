import React, { useState, useEffect, act } from "react";
import { useParams } from "react-router-dom";
import Header from "./Components/Header";
import ProfileInfo from "./Components/ProfileInfo";
import Tabs from "./Components/Tabs";
import Footer from "./Components/Footer";
import Gallery from "./Components/Gallery";
import Posteos from "./Components/Posteos"
import './index.css';

function PlayerProfile() {
    const { usuario_id } = useParams();
    const [activeTab, setActiveTab] = useState('Videos');

    // Recuperar la pestaña activa desde localStorage cuando el componente se monta
    useEffect(() => {
        const storedTab = localStorage.getItem('activeTab');
        if (storedTab) {
            setActiveTab(storedTab);
        }
    }, [])

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        localStorage.setItem('activeTab', tab); // Guardar la pestaña activa en localStorage
    };

    const handleEditClick = () => {
        setActiveTab('MisDatos'); // Cambia la pestaña activa a MisDatos
        localStorage.setItem('activeTab', 'MisDatos'); // Guardar la pestaña activa en localStorage
    };

    return (
        <div className="container">
            <Header />
            <ProfileInfo usuario_id={usuario_id} onEditClick={handleEditClick} />
            <Tabs activeTab={activeTab} onTabChange={handleTabChange} />
            <main className="profile-main">
                {activeTab === 'Videos' && <Gallery usuarioId={usuario_id} />}
                {activeTab === 'Posteos' && <Posteos userId={usuario_id} />}
            </main>
            <footer className="footer">
                <Footer />
            </footer>
        </div>
    )
}

export default PlayerProfile;