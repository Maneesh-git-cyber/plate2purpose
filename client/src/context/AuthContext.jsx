import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from '../api/axiosConfig.js';

// Create the context
const AuthContext = createContext(null);

// Create the Provider component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // Add a loading state to the context

    // --- THIS useEffect IS THE FIX FOR THE REFRESH PROBLEM ---
    useEffect(() => {
        // This function will run once when the app first loads
        const checkUserLoggedIn = async () => {
            const token = localStorage.getItem('authToken');
            
            if (token) {
                try {
                    // If a token exists, make an API call to the '/auth/me' endpoint
                    // This endpoint will verify the token and return the user's data
                    const response = await axios.get('/auth/me');
                    
                    // If successful, re-populate the user state with the data from the server
                    setUser(response.data);
                } catch (error) {
                    console.error("Authentication token is invalid, logging out.", error);
                    // If the token is invalid (e.g., expired), remove it and clear the user
                    localStorage.removeItem('authToken');
                    setUser(null);
                }
            }
            
            // We are finished with our initial check
            setLoading(false);
        };

        checkUserLoggedIn();
    }, []); // The empty `[]` ensures this runs only ONCE on initial app load

    const login = (userData) => {
        setUser(userData);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('authToken');
        window.location.href = '/login';
    };

    // The "broadcast" now also includes the loading state
    const value = { user, login, logout, loading };

    // We will not render the rest of the application until our initial
    // authentication check is complete. This prevents pages from flickering.
    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

// The custom hook to access the context remains the same
export const useAuth = () => {
    return useContext(AuthContext);
};