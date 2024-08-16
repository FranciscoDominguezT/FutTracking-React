import React, { useState } from "react";
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

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    const handleEditClick = () => {
        setActiveTab('MisDatos'); // Cambia la pestaña activa a MisDatos
    };

    return (
        <div className="container">
            <Header />
            <ProfileInfo onEditClick={handleEditClick} />
            <Tabs onTabChange={handleTabChange} />
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