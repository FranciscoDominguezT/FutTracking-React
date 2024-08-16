import React, { useState, useEffect, useRef } from "react";
import './index.css';


const Tabs = ({ onTabChange }) => {
    const [activeTab, setActiveTab] = useState('Videos');
    const [tabPosition, setTabPosition] = useState(0);
    const tabRefs = useRef([]);


    useEffect(() => {
        const activeTabElement = tabRefs.current.find(tab => tab.dataset.tab === activeTab);
        if (activeTabElement) {
            setTabPosition(activeTabElement.offsetLeft);
        }
    }, [activeTab]);


    const handleTabClick = (tab, index) => {
        setActiveTab(tab);
        onTabChange(tab);
    };


    return (
        <div className="tabs">
            <div className="tab-indicator" style={{ transform: `translateX(${tabPosition}px)` }} />
            {['Videos', 'Posteos', 'MisDatos'].map((tab, index) => (
                <button
                    key={tab}
                    data-tab={tab}
                    ref={el => tabRefs.current[index] = el}
                    className={`tab ${activeTab === tab ? 'active' : ''}`}
                    onClick={() => handleTabClick(tab, index)}
                >
                    {tab}
                </button>
            ))}
        </div>
    );
}


export default Tabs;
