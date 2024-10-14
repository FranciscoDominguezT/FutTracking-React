import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../Context/auth-context";
import Header from "./Components/Header";
import ProfileInfo from "./Components/ProfileInfo";
import Tabs from "./Components/Tabs";
import Gallery from "./Components/Gallery";
import Posteos from "./Components/Posteos";
import MisDatos from "./Components/MisDatos";
import MisDatosAficionado from "./Components/MisDatosAficionado";
import Footer from "../Home/Components/Footer";
import './index.css';

function Profile() {
    const [activeTab, setActiveTab] = useState('Videos');
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const storedTab = localStorage.getItem('activeTab');
        if (storedTab) {
            setActiveTab(storedTab);
        }
    }, []);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        localStorage.setItem('activeTab', tab);
    };

    const handleEditClick = () => {
        setActiveTab('MisDatos');
        localStorage.setItem('activeTab', 'MisDatos');
    };

    return (
        <div className="container">
            <Header />
            <ProfileInfo onEditClick={handleEditClick} />
            <Tabs activeTab={activeTab} onTabChange={handleTabChange} />
            <main className="profile-main">
                {activeTab === 'Videos' && <Gallery isUserProfile={true} />}
                {activeTab === 'Posteos' && <Posteos />}
                {activeTab === 'MisDatos' && (
                    user.rol === 'Jugador' ? <MisDatos /> : <MisDatosAficionado />
                )}
            </main>
            <footer className="footer">
                <Footer />
            </footer>
        </div>
    );
}

export default Profile;