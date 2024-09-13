import React, { useEffect, useRef } from "react";
import './index.css';

const Tabs = ({ activeTab, onTabChange }) => {
    const [tabPosition, setTabPosition] = React.useState(0);
    const tabRefs = useRef([]);

    useEffect(() => {
        const activeTabElement = tabRefs.current.find(tab => tab.dataset.tab === activeTab);
        if (activeTabElement) {
            setTabPosition(activeTabElement.offsetLeft);
        }
    }, [activeTab]);

    const handleTabClick = (tab) => {
        onTabChange(tab);
    };

    return (
        <div className="tabs">
            <div className="tab-indicatorII" style={{ transform: `translateX(${tabPosition}px)` }} />
            {['Videos', 'Posteos', 'Mas Info', 'Contactar'].map((tab, index) => (
                <button
                    key={tab}
                    data-tab={tab}
                    ref={el => tabRefs.current[index] = el}
                    className={`tab ${activeTab === tab ? 'active' : ''}`}
                    onClick={() => handleTabClick(tab)}
                >
                    {tab}
                </button>
            ))}
        </div>
    );
}

export default Tabs;
