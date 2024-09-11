import React, { useState, useEffect } from "react";
import Header from "./Components/Header";
import ProfileInfo from "./Components/ProfileInfo";
import Tabs from "./Components/Tabs";
import Gallery from "./Components/Gallery";
import Posteos from "./Components/Posteos";
import MisDatos from "./Components/MisDatos";
import Footer from "./Components/Footer";
import './index.css';

function Profile() {
    const [activeTab, setActiveTab] = useState('Videos');

    // Recuperar la pestaña activa desde localStorage cuando el componente se monta
    useEffect(() => {
        const storedTab = localStorage.getItem('activeTab');
        if (storedTab) {
            setActiveTab(storedTab);
        }
    }, []);

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
            <ProfileInfo onEditClick={handleEditClick} />
            <Tabs activeTab={activeTab} onTabChange={handleTabChange} />
            <main className="profile-main">
                {activeTab === 'Videos' && <Gallery />}
                {activeTab === 'Posteos' && <Posteos />}
                {activeTab === 'MisDatos' && <MisDatos />}
            </main>
            <footer className="footer">
                <Footer />
            </footer>
        </div>
    );
}

export default Profile;
