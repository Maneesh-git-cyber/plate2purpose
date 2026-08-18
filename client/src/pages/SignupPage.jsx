import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './SignupPage.module.css';
import toast from 'react-hot-toast';

import { useAuth } from '../context/AuthContext.jsx';
import axios from '../api/axiosConfig.js';

const SignupPage = () => {
    // --- State and logic remain the same ---
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'DONOR' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { login } = useAuth();
    const { name, email, password, role } = formData;

    const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post('/auth/signup', { name, email, password, role });
            const { token, ...userData } = response.data;
            localStorage.setItem('authToken', token);
            login(userData);
            toast.success('Signup successful! Please complete your profile to get verified.');
            navigate('/verify-account');
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred during signup.');
            setLoading(false);
        }
    };

    const pageStyle = {
      background: 'linear-gradient(to bottom, #f8fdf9 0%, #f1f8f4 100%)',
      minHeight: '100vh',
      position: 'relative',
      overflowX: 'hidden',
    };

    const beforeStyle = {
      content: '""',
      position: 'fixed',
      top: '-10%',
      right: '-10%',
      width: '600px',
      height: '600px',
      background: 'radial-gradient(circle, rgba(82, 183, 136, 0.25) 0%, rgba(149, 213, 178, 0.15) 40%, transparent 70%)',
      borderRadius: '50%',
      zIndex: 0,
      pointerEvents: 'none',
    };

    const afterStyle = {
      content: '""',
      position: 'fixed',
      bottom: '-20%',
      left: '-10%',
      width: '700px',
      height: '700px',
      background: 'radial-gradient(circle, rgba(255, 152, 0, 0.2) 0%, rgba(245, 124, 0, 0.1) 50%, transparent 70%)',
      borderRadius: '50%',
      zIndex: 0,
      pointerEvents: 'none',
    };

    // --- All classNames updated to use the 'styles' object with bracket notation ---
    return (
        <div style={pageStyle}>
            <div style={beforeStyle} />
            <div style={afterStyle} />
            <div className={styles.container}>
                <div className={styles['signup-container']}>
                    <div className={styles['left-panel']} style={{ backgroundImage: "url('https://i.pinimg.com/736x/50/d5/fd/50d5fd3193325eea6ef2dd5c1b26941c.jpg')" }}>
                        <div className={styles['logo-container']}>
                            <h1 style={{ color: 'rgb(75, 73, 73)' }}>Surplus</h1>
                            <p className={styles.tagline} style={{ color: 'rgb(75, 73, 73)' }}>Connecting excess food with those in need</p>
                        </div>
                        <div className={styles['info-text']}>
                            <h2 style={{ color: 'rgb(75, 73, 73)' }}>Join our mission</h2>
                            <p style={{ color: 'rgb(75, 73, 73)' }}>Help us reduce food waste and fight hunger in our communities by joining our platform.</p>
                        </div>
                    </div>
                    <div className={styles['right-panel']}>
                        <div className={styles['form-container']}>
                            <h2>Create an account</h2>
                            {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}
                            
                            <form id="signup-form" onSubmit={handleSignup}>
                                <div className={styles['form-group']}>
                                    <label htmlFor="name">Full Name</label>
                                    <input type="text" id="name" name="name" placeholder="Your name or organization name" value={name} onChange={onChange} required />
                                </div>
                                <div className={styles['form-group']}>
                                    <label htmlFor="email">Email Address</label>
                                    <input type="email" id="email" name="email" placeholder="Your email address" value={email} onChange={onChange} required />
                                </div>
                                <div className={styles['form-group']}>
                                    <label htmlFor="password">Password</label>
                                    <input type="password" id="password" name="password" value={password} onChange={onChange} required minLength="6" />
                                    <p className={styles['password-hint']}>Password must be at least 6 characters</p>
                                </div>
                                <div className={styles['form-group']}>
                                    <label htmlFor="role">I am a:</label>
                                    <select id="role" name="role" value={role} onChange={onChange}>
                                        <option value="DONOR">Donor (Restaurant, Individual, etc.)</option>
                                        <option value="NGO">NGO / Receiver</option>
                                        <option value="VOLUNTEER">Volunteer</option>
                                    </select>
                                </div>

                                <button type="submit" className={styles['signup-button']} disabled={loading}>
                                    {loading ? 'Creating Account...' : 'Sign Up'}
                                </button>
                            </form>
                            <p className={styles['login-link']}>
                                Already have an account? <Link to="/login">Log in</Link>
                            </p>
                        </div>
                    </div>
                </div>
                <div className={styles.homeLink}>
                    <Link to="/">&larr; Back to Home</Link>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;

