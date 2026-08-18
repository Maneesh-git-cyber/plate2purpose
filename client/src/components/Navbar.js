import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav style={{ display: 'flex', gap: '1rem', padding: '1rem', background: '#f0f0f0' }}>
            <Link to="/">Home</Link>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
            
            {/* --- ADD THIS LINE --- */}
            {/* This is a temporary link for testing our new page */}
            <Link to="/dashboard/volunteer" style={{ marginLeft: 'auto', color: 'red' }}>Volunteer Dashboard (Test Link)</Link>
        </nav>
    );
};

export default Navbar;