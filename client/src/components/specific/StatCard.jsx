import React, { useState, useEffect } from 'react';
import './StatCard.css'; // It should have its own CSS

// This small component for the animated counter now lives inside StatCard
const AnimatedCounter = ({ target }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (target === undefined || target === null) return;
        let start = 0;
        const end = parseInt(target, 10);
        if (start === end) {
            setCount(end); // Set to final value if already there
            return;
        }

        const duration = 1500; // 1.5 seconds
        const incrementTime = 16; // Roughly 60fps
        const totalIncrements = duration / incrementTime;
        const increment = Math.ceil(end / totalIncrements);

        const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
                setCount(end);
                clearInterval(timer);
            } else {
                setCount(start);
            }
        }, incrementTime);

        return () => clearInterval(timer);
    }, [target]);

    return <div className="stat-value">{count.toLocaleString()}</div>;
};

// The main StatCard component now uses the AnimatedCounter
const StatCard = ({ number, label, icon }) => {
    return (
        <div className="stat-item">
            {icon && <div className="impact-icon">{icon}</div>}
            <AnimatedCounter target={number} />
            <div className="stat-label">{label}</div>
        </div>
    );
};

export default StatCard;