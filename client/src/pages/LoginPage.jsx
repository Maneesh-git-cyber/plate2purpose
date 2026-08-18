// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// // Import the plain CSS file
// import './LoginPage.css';

// import { useAuth } from '../context/AuthContext.jsx';
// import axios from '../api/axiosConfig.js';

// const LoginPage = () => {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);

//     const navigate = useNavigate();
//     const { login } = useAuth();

//     const handleLogin = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         setError(null);
//         try {
//             const response = await axios.post('/auth/login', { email, password });
//             const { token, ...userData } = response.data;
//             localStorage.setItem('authToken', token);
//             login(userData);
//             navigate('/dashboard');
//         } catch (err) {
//             setError(err.response?.data?.message || 'An error occurred. Please try again.');
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="pageContainer"> {/* classNames are now strings */}
//             <form className="login-container" onSubmit={handleLogin}>
//                 <h2>Login</h2>
//                 {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}
                
//                 <input 
//                     type="email"
//                     className="login-input" 
//                     placeholder="Email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     required
//                 />
//                 <input 
//                     type="password" 
//                     className="login-input" 
//                     placeholder="Password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     required
//                 />
//                 <button type="submit" className="login-btn" disabled={loading}>
//                     {loading ? 'Logging in...' : 'Login'}
//                 </button>
//                 <div className="signup-text">
//                     If you do not have an account then
//                     <Link to="/signup" className="signup-btn">Sign Up</Link>
//                 </div>
//             </form>
//         </div>
//     );
// };

// export default LoginPage;

import React, { useState} from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import axios from '../api/axiosConfig.js';
// Correctly import the CSS Module
import styles from './LoginPage.module.css';

const LoginPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post('/auth/login', { email, password });
            const { token, ...userData } = response.data;
            localStorage.setItem('authToken', token);
            login(userData);
            
            switch (userData.role) {
                case 'DONOR':
                    navigate('/dashboard/donor');
                    break;
                case 'NGO':
                    navigate('/dashboard/ngo'); 
                    break;
                case 'VOLUNTEER':
                    navigate('/dashboard'); 
                    break;
                default:
                    navigate('/');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred during login.');
            setLoading(false);
        }
    };

    return (
        // All classNames are now correctly using the 'styles' object and camelCase
        <div className={styles.pageContainer}>
            <form className={styles.loginContainer} onSubmit={handleLogin}>
                <h2>Login</h2>
                {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}
                
                <input 
                    type="email"
                    className={styles.loginInput} 
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input 
                    type="password" 
                    className={styles.loginInput} 
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit" className={styles.loginBtn} disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>
                <div className={styles.signupText}>
                    Don't have an account? 
                    <Link to="/signup" className={styles.signupBtn}>Sign Up</Link>
                </div>
            </form>
            <div className={styles.homeLink}>
                <Link to="/">&larr; Back to Home</Link>
            </div>
        </div>
    );
};

export default LoginPage;