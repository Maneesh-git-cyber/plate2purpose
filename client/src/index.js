import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthProvider } from './context/AuthContext'; // <-- ADD THIS IMPORT

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* ADD THE AuthProvider WRAPPER HERE */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);