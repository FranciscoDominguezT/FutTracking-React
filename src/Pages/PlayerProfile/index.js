import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../Context/auth-context";
import Profile from "../Profile";
import Header from "./Components/Header";
import ProfileInfo from "./Components/ProfileInfo";
import Tabs from "./Components/Tabs";
import Footer from "./Components/Footer";
import Gallery from "./Components/Gallery";
import Posteos from "./Components/Posteos";
import PlayerPosteos from "./Components/PlayerPosteos";
import MasInfo from "./Components/MasInfo";
import Contactar from "./Components/Contactar";
import './index.css';

function PlayerProfile() {
    const { usuario_id } = useParams();
    const [activeTab, setActiveTab] = useState('Videos');
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const storedTab = localStorage.getItem('activeTab');
        if (storedTab) {
            setActiveTab(storedTab);
        }
    }, []);

    useEffect(() => {
        if (user && user.id === parseInt(usuario_id)) {
            navigate('/profile');
        }
    }, [user, usuario_id, navigate]);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        localStorage.setItem('activeTab', tab);
    };

    const handleEditClick = () => {
        setActiveTab('MisDatos');
        localStorage.setItem('activeTab', 'MisDatos');
    };

    if (user && user.id === parseInt(usuario_id)) {
        return <Profile />;
    }

    return (
        <div className="container">
            <Header />
            <ProfileInfo usuario_id={usuario_id} onEditClick={handleEditClick} />
            <Tabs activeTab={activeTab} onTabChange={handleTabChange} />
            <main className="profile-main">
                {activeTab === 'Videos' && <Gallery usuarioId={usuario_id} />}
                {activeTab === 'Posteos' && (
                    user && user.id === parseInt(usuario_id) 
                    ? <Posteos userId={usuario_id} /> 
                    : <PlayerPosteos userId={usuario_id} />
                )}
                {activeTab === 'Mas Info' && <MasInfo userId={usuario_id} />}
                {activeTab === 'Contactar' && <Contactar userId={usuario_id} />}
            </main>
            <footer className="footer">
                <Footer />
            </footer>
        </div>
    );
}

export default PlayerProfile;